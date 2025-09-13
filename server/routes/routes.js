const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const attendanceController = require("../controllers/attendanceController");
const ipMiddleware = require("../middleware/ipMiddleware"); 

//  Public Routes
router.post("/register", userController.register);
router.post("/login", userController.login);

//  Protected User Routes
// Only logged-in user can see their own profile
router.get("/me", ipMiddleware, userController.getProfile);

// Admin-only (optional: check role inside controller)
router.get("/employees", ipMiddleware, userController.getEmployees);
router.delete("/employees/:id", ipMiddleware, userController.deleteEmployee);

//  Protected Attendance Routes
router.post("/attendance", ipMiddleware, attendanceController.markAttendance);

// Employee can see only their own attendance
router.get("/attendance/me", ipMiddleware, attendanceController.getMyAttendance);

// Admin can see all attendance
router.get("/attendance/all", ipMiddleware, attendanceController.getAllAttendance);

module.exports = router;
