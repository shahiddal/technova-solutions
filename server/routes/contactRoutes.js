const express = require("express");

const { createContact } = require("../controllers/contactController");

const router = express.Router();

// Rate limit: max 5 contact submissions per IP every 15 minutes
// shortcut: in-memory, resets on restart and isn't shared across instances; switch to express-rate-limit + a shared store if scaled out
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map();

const contactLimiter = (req, res, next) => {
  const now = Date.now();
  const entry = hits.get(req.ip);

  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(req.ip, { start: now, count: 1 });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  }

  entry.count++;
  next();
};

// Drop expired entries so the map doesn't grow forever
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now - entry.start > WINDOW_MS) hits.delete(ip);
  }
}, WINDOW_MS).unref();

router.post("/", contactLimiter, createContact);

module.exports = router;
