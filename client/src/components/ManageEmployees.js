import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch {
      setError("Failed to fetch employee data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this employee?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch {
      alert("Failed to delete employee.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p style={styles.loading}>Loading employees...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.header}>👥 Manage Employee Accounts</h2>
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Employee ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} style={styles.td}>
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} style={styles.tr}>
                    <td style={styles.td}>{emp.employeeId}</td>
                    <td style={styles.td}>{emp.name}</td>
                    <td style={styles.td}>{emp.email}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        disabled={deletingId === emp._id}
                        style={styles.button(deletingId === emp._id)}
                      >
                        {deletingId === emp._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Link to="/Login" style={styles.link}>
          🔐 Logout
        </Link>
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
    padding: 30,
    fontFamily: "Segoe UI",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: 800,
  },
  header: {
    marginBottom: 10,
    color: "#007bff",
  },
  link: {
    marginTop: 20,
    display: "inline-block",
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  tableCard: {
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: 10,
    overflowX: "auto",
    marginTop: 20,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: 12, background: "#007bff", color: "#fff", textAlign: "left" },
  td: { padding: 10, background: "#f9f9f9" },
  tr: { borderBottom: "1px solid #ddd", transition: "0.3s" },
  button: (isDisabled) => ({
    padding: "6px 12px",
    color: "#fff",
    backgroundColor: isDisabled ? "#888" : "#dc3545",
    border: "none",
    borderRadius: 4,
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "0.2s",
  }),
  loading: { padding: 30 },
  error: { color: "red", padding: 30 },
};

export default ManageEmployees;
