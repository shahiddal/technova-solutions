const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173").split(","),
  })
);
app.use(express.json());

// Routes
app.use("/api/contact", contactRoutes);

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "TechNova Solutions API is running 🚀",
  });
});

// Error handler: JSON reply instead of Express's HTML stack trace (e.g. broken JSON body)
app.use((err, req, res, next) => {
  const status = err.status || 500;

  if (status >= 500) console.error("Server Error:", err.message);

  res.status(status).json({
    success: false,
    message: status < 500 ? "Invalid request" : "Something went wrong",
  });
});

// Connect MongoDB
connectDB();

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});