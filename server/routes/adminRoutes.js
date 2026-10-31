const express = require("express");

const { login, logout, me, dashboard } = require("../controllers/adminController");
const requireAdmin = require("../middleware/requireAdmin");
const adminProxy = require("../middleware/adminProxy");

const router = express.Router();

// Admin responses are per-user; never let a browser or proxy cache them
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Must come through the Vercel proxy in production; sets req.clientIp
router.use(adminProxy);

router.post("/login", login);
router.post("/logout", logout);

// Everything below needs a logged-in admin
router.get("/me", requireAdmin, me);
router.get("/dashboard", requireAdmin, dashboard);

module.exports = router;
