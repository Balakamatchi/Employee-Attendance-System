const Attendance = require("../models/Attendance");
const { isIPAllowed, mapLocalToIP } = require("../middleware/ipMiddleware");

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, ip: clientIp, reason, status } = req.body;

    if (!employeeId || !clientIp) {
      return res.status(400).json({ message: "Missing employeeId or ip" });
    }

    const ip = clientIp.endsWith(".local") ? mapLocalToIP(clientIp) : clientIp;

    if (!isIPAllowed(ip)) {
      return res.status(403).json({ message: "IP not allowed - Must be connected to office Wi-Fi" });
    }

    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8);

    const existing = await Attendance.findOne({ employeeId, date });
    if (existing) {
      return res.status(200).json({ message: "Attendance already marked today", attendance: existing });
    }

    const newAttendance = new Attendance({
      employeeId,
      date,
      time,
      ip,
      status: status || "Present",
      reason: reason || ""
    });

    await newAttendance.save();
    res.status(200).json({ message: "Attendance marked successfully", attendance: newAttendance });
  } catch (error) {
    console.error("Error in /api/attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1, time: -1 });
    res.json(records);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Server error" });
  }
};
