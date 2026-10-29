const express = require("express");

const { createContact } = require("../controllers/contactController");
const createRateLimiter = require("../middleware/rateLimit");

const router = express.Router();

// Rate limit: max 5 contact submissions per IP every 15 minutes
const contactLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

router.post("/", contactLimiter, createContact);

module.exports = router;
