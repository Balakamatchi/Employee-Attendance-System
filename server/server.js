const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); // ✅ Load .env file

const routes = require("./routes/routes"); // 👈 Import routes

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Use routes
app.use("/api", routes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Auto Attendance Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
