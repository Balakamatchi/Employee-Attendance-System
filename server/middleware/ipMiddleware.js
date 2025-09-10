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

module.exports = { isIPAllowed, mapLocalToIP };
