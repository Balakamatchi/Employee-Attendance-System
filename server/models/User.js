const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },         // full name
  password: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" }
});

module.exports = mongoose.model("User", userSchema);
