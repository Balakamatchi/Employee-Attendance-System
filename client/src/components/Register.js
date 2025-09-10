import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    password: "",
    address: "",
    email: "",
    mobile: "",
    dob: "",
    department: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value) return "Name is required.";
        if (!/[A-Za-z]/.test(value)) return "Name must contain at least one letter.";
        if (!/^[A-Za-z\s]*$/.test(value)) return "Name can contain only letters and spaces.";
        return "";
      case "employeeId":
        if (!value) return "Employee ID is required.";
        return /^NM\d+$/.test(value)
          ? ""
          : "Employee ID must start with 'NM' followed by numbers.";
      case "password":
        if (!value) return "Password is required.";
        return /^\d+$/.test(value) ? "" : "Password can contain only numbers.";
      case "email":
        if (!value) return "Email is required.";
        return /^[a-z][a-z0-9]*@gmail\.com$/.test(value)
          ? ""
          : "Email must start with a lowercase letter, may contain numbers after the first character, and end with @gmail.com.";
      case "mobile":
        if (!value) return "Mobile number is required.";
        return /^\d{10}$/.test(value) ? "" : "Mobile number must be exactly 10 digits.";
      case "address":
        if (!value) return "Address is required.";
        return "";
      case "dob":
        if (!value) return "Date of Birth is required.";
        return "";
      case "department":
        if (!value) return "Department is required.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleRegister = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
        ...formData,
        role: "employee"
      });
      alert(res.data?.message || "Registration successful.");
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);
      alert(err.response?.data?.message || "Server Error. Please try again later.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>Register as Employee</h2>
        <div style={styles.formGrid}>
          {/* Full Name */}
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>

          {/* Employee ID */}
          <div>
            <input
              name="employeeId"
              type="text"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.employeeId && <p style={styles.error}>{errors.employeeId}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          {/* Address */}
          <div>
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.address && <p style={styles.error}>{errors.address}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          {/* Mobile */}
          <div>
            <input
              name="mobile"
              type="tel"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.mobile && <p style={styles.error}>{errors.mobile}</p>}
          </div>

          {/* DOB */}
          <div>
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.dob && <p style={styles.error}>{errors.dob}</p>}
          </div>

          {/* Department */}
          <div>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Department</option>
              <option value="Software Engineers">Software Engineers</option>
              <option value="Data Scientists">Data Scientists</option>
              <option value="Product Managers">Product Managers</option>
              <option value="AI/ML Engineers">AI/ML Engineers</option>
              <option value="Network Administrators">Network Administrators</option>
              <option value="Security Specialists">Security Specialists</option>
              <option value="Customer Support Engineers">Customer Support Engineers</option>
              <option value="UX/UI Designers">UX/UI Designers</option>
              <option value="Sales and Marketing">Sales and Marketing</option>
            </select>
            {errors.department && <p style={styles.error}>{errors.department}</p>}
          </div>
        </div>

        <button onClick={handleRegister} style={styles.button}>Register</button>
        <p>
          Already registered?{" "}
          <span onClick={() => navigate("/")} style={styles.link}>Login here</span>
        </p>
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
    width: 700,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: 10,
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  }
};

export default Register;
