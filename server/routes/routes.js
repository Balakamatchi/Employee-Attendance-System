const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const attendanceController = require("../controllers/attendanceController");


router.get("/", (req, res) => {
  res.status(401).json({ message: "Not authorized, no token" });
});

// User Routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/employees", userController.getEmployees);
router.delete("/employees/:id", userController.deleteEmployee);

// Attendance Routes
router.post("/attendance", attendanceController.markAttendance);
router.get("/attendance/all", attendanceController.getAllAttendance);

module.exports = router;