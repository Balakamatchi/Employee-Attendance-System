const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const routes = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// Enable CORS for frontend and localhost
const allowedOrigins = [
  "https://unrivaled-daffodil-496820.netlify.app", 
  "http://localhost:3000",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS policy does not allow this origin"), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// API routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.send("Employee Attendance System - Backend is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
