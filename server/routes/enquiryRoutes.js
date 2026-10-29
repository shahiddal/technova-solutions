const express = require("express");

const { createEnquiry } = require("../controllers/enquiryController");
const createRateLimiter = require("../middleware/rateLimit");

const router = express.Router();

// Rate limit: max 5 enquiries per IP every 15 minutes
const enquiryLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

router.post("/", enquiryLimiter, createEnquiry);

module.exports = router;
