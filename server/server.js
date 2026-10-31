const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const {
  serviceRoutes,
  projectRoutes,
  blogRoutes,
} = require("./routes/contentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Behind the host's proxy (Render): use the real client IP for rate limiting, not the proxy's
app.set("trust proxy", 1);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173").split(","),
  })
);
app.use(express.json());

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);

// Unknown API routes: JSON instead of Express's default HTML page
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

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