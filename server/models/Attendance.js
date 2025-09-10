const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: String,
  fullName: String,
  address: String,
  email: String,
  mobile: String,
  department: String,
  date: String,
  time: String,
  ip: String,
  reason: String,
  status: String, 
});

module.exports = mongoose.model("Attendance", attendanceSchema);

