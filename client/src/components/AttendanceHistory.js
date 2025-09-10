import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AttendanceHistory() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [attendanceRes, employeesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/attendance`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/employees`),
        ]);

        setAttendanceRecords(attendanceRes.data);
        setEmployees(employeesRes.data);
        setFilteredRecords(attendanceRes.data);
      } catch (err) {
        setError("Failed to fetch attendance data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle date input change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    applyFilters(date, selectedDept);
  };

  // Handle department filter change
  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    applyFilters(selectedDate, dept);
  };

  // Apply both filters
  const applyFilters = (date, dept) => {
    let filtered = attendanceRecords;

    if (date) {
      filtered = filtered.filter(
        (record) => new Date(record.date).toISOString().split("T")[0] === date
      );
    }

    if (dept) {
      filtered = filtered.filter((record) => {
        const emp = employees.find((e) => e.employeeId === record.employeeId);
        return emp?.department === dept;
      });
    }

    setFilteredRecords(filtered);
  };

  // Build full employee list with attendance status
  const getRecordsForDate = (date) => {
    return employees
      .filter((emp) => !selectedDept || emp.department === selectedDept)
      .map((emp) => {
        const record = filteredRecords.find(
          (rec) =>
            rec.employeeId === emp.employeeId &&
            new Date(rec.date).toISOString().split("T")[0] === date
        );
        if (record) return { ...record, ...emp };
        return {
          _id: emp._id,
          employeeId: emp.employeeId,
          name: emp.name,
          email: emp.email,
          department: emp.department,
          time: "—",
          ip: "—",
          status: "Absent",
          reason: "",
        };
      });
  };

  const recordsByDate = selectedDate
    ? { [new Date(selectedDate).toLocaleDateString()]: getRecordsForDate(selectedDate) }
    : filteredRecords.reduce((acc, record) => {
        const dateKey = new Date(record.date).toLocaleDateString();
        if (!acc[dateKey])
          acc[dateKey] = getRecordsForDate(
            new Date(record.date).toISOString().split("T")[0]
          );
        return acc;
      }, {});

  if (loading) return <p style={styles.loading}>Loading attendance records...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Header */}
        <h2 style={styles.header}>📊 Employee Attendance History</h2>

        {/* Logout at Top Center */}
        <div style={styles.logoutWrapper}>
          <Link to="/Login" style={styles.logoutBtn}>
            🔐 Logout
          </Link>
        </div>

        {/* Filters */}
        <div style={styles.filterWrapper}>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={styles.dateInput}
          />

          <select value={selectedDept} onChange={handleDeptChange} style={styles.select}>
            <option value="">All Departments</option>
            {[...new Set(employees.map((e) => e.department))].map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {Object.keys(recordsByDate).length === 0 ? (
          <p style={styles.td}>No attendance records found.</p>
        ) : (
          <div style={styles.tablesContainer}>
            {Object.entries(recordsByDate).map(([date, records]) => (
              <div key={date} style={styles.singleTableCard}>
                <h3 style={{ color: "#007bff", marginBottom: 10 }}>{date}</h3>
                <div style={styles.tableCard}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Employee ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Department</th>
                        <th style={styles.th}>Time</th>
                        <th style={styles.th}>IP Address</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr
                          key={record._id || record.employeeId}
                          style={{
                            ...styles.tr,
                            background:
                              record.status === "Absent" ? "#ffe6e6" : "#f9f9f9",
                          }}
                        >
                          <td style={styles.td}>{record.employeeId}</td>
                          <td style={styles.td}>{record.name || "—"}</td>
                          <td style={styles.td}>{record.email || "—"}</td>
                          <td style={styles.td}>{record.department || "—"}</td>
                          <td style={styles.td}>{record.time}</td>
                          <td style={styles.td}>{record.ip}</td>
                          <td style={styles.td}>
                            {record.status || "Present"}
                          </td>
                          <td style={styles.td}>
                            {record.reason?.trim() !== "" ? record.reason : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f0f4f8", padding: 30 },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    width: "95%",
    maxWidth: 1200,
    margin: "auto",
  },
  header: { marginBottom: 10, color: "#007bff", textAlign: "center" },
  logoutWrapper: {
    textAlign: "center",
    marginBottom: 20,
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: 6,
    textDecoration: "none",
    fontWeight: "bold",
  },
  filterWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  dateInput: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  select: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  tablesContainer: { display: "flex", flexWrap: "wrap", gap: 20 },
  singleTableCard: { flex: "1 1 100%" },
  tableCard: {
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: 10,
    overflowX: "auto",
    marginTop: 10,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: 12, background: "#007bff", color: "#fff", textAlign: "left" },
  td: { padding: 10 },
  tr: { borderBottom: "1px solid #ddd" },
  loading: { padding: 30 },
  error: { color: "red", padding: 30 },
};

export default AttendanceHistory;
