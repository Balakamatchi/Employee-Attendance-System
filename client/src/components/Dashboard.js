import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const { state } = useLocation();
  const isAdmin = state?.role === "admin";
  const employeeId = state?.employeeId;
  const navigate = useNavigate();

  const [ip, setIP] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [reason, setReason] = useState("");

  const getLocalIP = () => {
    return new Promise((resolve) => {
      const rtc = new RTCPeerConnection({ iceServers: [] });
      rtc.createDataChannel("");
      rtc.onicecandidate = (event) => {
        if (!event.candidate) return;
        const ipMatch = event.candidate.candidate.split(" ")[4];
        if (ipMatch && ipMatch.includes(".")) resolve(ipMatch);
      };
      rtc.createOffer().then((offer) => rtc.setLocalDescription(offer));
    });
  };

  const handleMarkAttendance = async () => {
    setLoading(true);

    try {
      const now = new Date();
      const hours = now.getHours();
      let status = "";
      let requiresReason = false;

      if (hours >= 8 && hours < 10) {
        status = "Present ";
      } else if (hours >= 10 && hours < 12) {
        status = "Late to Office (After 10 AM)";
        requiresReason = true;
      } else if (hours >= 12 && hours < 16) {
        status = "Afternoon Present (After 12 PM)";
        requiresReason = true;
      } else if (hours >= 16 && hours < 18) {
        status = "Came after 4 PM";
        requiresReason = true;
      } else {
        setMessage("⚠️ Attendance can only be marked between 8 AM and 6 PM.");
        setLoading(false);
        return;
      }

      if (requiresReason && reason.trim() === "") {
        setMessage("⚠️ Please provide a reason for your attendance status.");
        setLoading(false);
        return;
      }

      setMessage("Detecting IP...");
      const localIP = await getLocalIP();
      setIP(localIP);

      // Directly call POST /api/attendance
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/attendance`, {
        employeeId,
        ip: localIP,
        status,
        reason: requiresReason ? reason : "",
      });

      if (res.data.message.includes("already marked")) {
        setMessage("⚠️ You have already marked attendance today.");
        setAttendanceMarked(true);
      } else {
        setMessage(`✅ Attendance marked as "${status}"`);
        setAttendanceMarked(true);
      }

      if (res.data.attendance?.ip) setIP(res.data.attendance.ip);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to mark attendance. Try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <main style={styles.content}>
          <h1 style={styles.heading}>
            {isAdmin ? "👨‍💼 Admin Dashboard" : `👤 Employee Dashboard`}
          </h1>
          <p style={styles.subtext}>
            {isAdmin
              ? "Manage employee accounts and track attendance records."
              : `Welcome Employee ${employeeId}, mark your attendance securely.`}
          </p>

          {isAdmin ? (
            <div style={styles.grid}>
              <div
                style={styles.cardInner}
                onClick={() => navigate("/admin/attendance-history")}
              >
                📊
                <h3>Attendance Records</h3>
              </div>
              <div
                style={styles.cardInner}
                onClick={() => navigate("/admin/manage-employees")}
              >
                👥
                <h3>Manage Employees</h3>
              </div>
            </div>
          ) : (
            <div style={styles.cardInner}>
              {(new Date().getHours() >= 10 &&
                new Date().getHours() < 18 &&
                !attendanceMarked) && (
                <div style={styles.reasonBoxWrapper}>
                  <textarea
                    placeholder="Provide reason for attendance..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={styles.textarea}
                  />
                </div>
              )}

              <button
                onClick={handleMarkAttendance}
                disabled={attendanceMarked || loading}
                style={{
                  ...styles.bigButton,
                  background: attendanceMarked
                    ? "linear-gradient(135deg,#10b981,#059669)"
                    : "linear-gradient(135deg,#3b82f6,#2563eb)",
                }}
              >
                {loading
                  ? "⏳ Marking..."
                  : attendanceMarked
                  ? "✅ Attendance Marked"
                  : "🕒 Mark Today's Attendance"}
              </button>

              <p style={styles.message}>{message}</p>
              {ip && <p style={styles.ip}>📡 Detected IP: {ip}</p>}
            </div>
          )}
        </main>

        <center>
          <button onClick={() => navigate("/login")} style={styles.logoutBtn}>
            🔐 Logout
          </button>
        </center>
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
    padding: "30px 40px",
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
    width: "90%",
    maxWidth: 900,
  },
  logoutBtn: {
    marginTop: 20,
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg,#3b82f6,#2563eb)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  content: { marginTop: 20 },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
  },
  subtext: { fontSize: 16, color: "#374151", marginBottom: 30 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
  },
  cardInner: {
    background: "#ffffff",
    borderRadius: 12,
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    textAlign: "center",
    border: "2px solid #3b82f6",
  },
  bigButton: {
    width: "100%",
    padding: "15px",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 15,
    transition: "0.3s",
  },
  message: { fontSize: 14, marginTop: 10, color: "#1e3a8a" },
  ip: { fontSize: 13, color: "#374151", marginTop: 5 },

  // New styles for centering reason box
  reasonBoxWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  textarea: {
    width: "80%",
    maxWidth: "500px",
    padding: "12px",
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    resize: "vertical",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default Dashboard;
