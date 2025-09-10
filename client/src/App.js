import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AttendanceHistory from "./components/AttendanceHistory";
import ManageEmployees from "./components/ManageEmployees";

function App() {
  return (
    <Router>
      <div style={styles.wrapper}>
        <Routes>
          <Route
            path="/"
            element={
              <div style={styles.card}>
                <h2 style={styles.heading}>Welcome to Employee Attendance System</h2>
                <Link to="/login" style={styles.linkButton}>
                  Login
                </Link>
                <Link to="/register" style={styles.linkSecondary}>
                  Register as Employee
                </Link>
              
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/attendance-history" element={<AttendanceHistory />} />
          <Route path="/admin/manage-employees" element={<ManageEmployees />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0f7fa, #e6ecf0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: 350,
  },
  heading: {
    marginBottom: 30,
    fontSize: 24,
    color: "#333",
  },
  linkButton: {
    display: "block",
    padding: "12px",
    marginBottom: "15px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 6,
    fontWeight: "bold",
  },
  linkSecondary: {
    display: "block",
    marginTop: 10,
    color: "#007bff",
    textDecoration: "underline",
  },
};

export default App;