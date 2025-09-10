import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [role, setRole] = useState("employee");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!id || !password) {
      setMessage("Please fill all fields");
      return;
    }
    if (role === "admin") {
      if (id === "Cupid" && password === "27102024") {
        navigate("/dashboard", { state: { role } });
      } else {
        setMessage("Invalid Admin Credentials");
      }
    } else {
      try {
        const res = await axios.post("http://localhost:5000/api/login", {
          employeeId: id,
          password,
        });
        setMessage(res.data.message);
        navigate("/dashboard", {
          state: { employeeId: res.data.employeeId, role: res.data.role },
        });
      } catch (err) {
        setMessage(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {/* Toggle / Swipe bar for role */}
        <div style={styles.toggleWrapper}>
          <div
            onClick={() => setRole("employee")}
            style={{
              ...styles.toggleOption,
              backgroundColor: role === "employee" ? "#2563eb" : "#e0e0e0",
              color: role === "employee" ? "#fff" : "#000",
            }}
          >
            Employee
          </div>
          <div
            onClick={() => setRole("admin")}
            style={{
              ...styles.toggleOption,
              backgroundColor: role === "admin" ? "#2563eb" : "#e0e0e0",
              color: role === "admin" ? "#fff" : "#000",
            }}
          >
            Admin
          </div>
        </div>

        <input
          style={styles.input}
          type="text"
          placeholder={role === "admin" ? "Admin ID" : "Employee ID"}
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
        {message && <p style={styles.error}>{message}</p>}
        {role === "employee" && (
          <p>
            New user?{" "}
            <span style={styles.link} onClick={() => navigate("/register")}>
              Register here
            </span>
          </p>
        )}
      </div>
    </div>
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
  title: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  toggleWrapper: {
    display: "flex",
    marginBottom: 15,
    borderRadius: 6,
    overflow: "hidden",
    cursor: "pointer",
  },
  toggleOption: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  input: {
    width: "100%",
    padding: 12,
    margin: "10px 0",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: "600",
    cursor: "pointer",
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
  },
  link: {
    color: "#2563eb",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "500",
  },
};

export default Login;
