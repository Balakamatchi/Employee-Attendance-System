const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const attendanceController = require("../controllers/attendanceController");
const ipMiddleware = require("../middleware/ipMiddleware"); // JWT + IP check

// --------------- Public Routes ---------------
router.post("/register", userController.register);
router.post("/login", userController.login);

// --------------- Protected Routes ---------------
// Employee: view own profile
router.get("/me", ipMiddleware, userController.getProfile);

// Admin-only: view all employees
router.get("/employees", ipMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}, userController.getEmployees);

// Admin-only: delete employee
router.delete("/employees/:id", ipMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}, userController.deleteEmployee);

// Employee: mark own attendance
router.post("/attendance", ipMiddleware, attendanceController.markAttendance);

// Employee: view own attendance
router.get("/attendance/me", ipMiddleware, attendanceController.getMyAttendance);

// Admin-only: view all attendance
router.get("/attendance/all", ipMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}, attendanceController.getAllAttendance);

module.exports = router;
