const User = require("../models/User");

// Register user
exports.register = async (req, res) => {
  const { employeeId, name, password, address, email, mobile, dob, department, role } = req.body;

  if (!employeeId || !name || !password || !address || !email || !mobile || !dob || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ employeeId });
    if (existing) return res.status(400).json({ message: "Employee already registered" });

    const user = new User({
      employeeId,
      name,
      password,
      address,
      email,
      mobile,
      dob,
      department,
      role: role || "employee"
    });

    await user.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { employeeId, password } = req.body;

  try {
    const user = await User.findOne({ employeeId, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", employeeId, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};
