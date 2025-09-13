const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Allowed IP prefixes for office Wi-Fi
const allowedIPs = ["192.168.1.", "10.0.0.", "192.168.137.", "192.0.0."];

// File to store persistent .local IP mappings
const localIPFile = path.join(__dirname, "../localIPMap.json");

// Load or initialize mapping
let localIPMap = {};
if (fs.existsSync(localIPFile)) {
  try {
    localIPMap = JSON.parse(fs.readFileSync(localIPFile, "utf8"));
    console.log("Loaded .local IP mappings from file");
  } catch (err) {
    console.error("Error reading localIPMap.json:", err);
    localIPMap = {};
  }
}

// Save mapping to file
function saveLocalIPMap() {
  fs.writeFileSync(localIPFile, JSON.stringify(localIPMap, null, 2), "utf8");
}

// Check if IP is allowed
function isIPAllowed(ip) {
  return allowedIPs.some((prefix) => ip.startsWith(prefix));
}

// Map .local hostname to deterministic IP
function mapLocalToIP(hostname) {
  if (localIPMap[hostname]) return localIPMap[hostname];

  const hash = crypto.createHash("md5").update(hostname).digest("hex");
  const lastByte = parseInt(hash.slice(-2), 16) % 254 + 1;
  const mappedIP = `192.0.0.${lastByte}`;

  localIPMap[hostname] = mappedIP;
  saveLocalIPMap();

  return mappedIP;
}

// Combined Auth + IP Middleware
const auth = async (req, res, next) => {
  try {
    // 🔑 Check JWT token
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;

    // 🌐 Check IP address
    let ip = req.ip || req.connection.remoteAddress;
    if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", ""); // IPv4 fix

    if (ip.endsWith(".local")) {
      // Map .local hostname to a deterministic IP
      ip = mapLocalToIP(ip);
    }

    if (!isIPAllowed(ip)) {
      return res.status(403).json({ message: "Access denied: outside office network" });
    }

    next();
  } catch (err) {
    console.error("Auth/IP check failed:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
