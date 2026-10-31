const crypto = require("node:crypto");
const net = require("node:net");

// In production the admin API is reached only through the Vercel rewrite, which sets
// this header to ADMIN_PROXY_SECRET (same value on Vercel and Render). That proves the
// request came through Vercel, so Vercel's X-Forwarded-For can be trusted for the
// visitor's IP. Without ADMIN_PROXY_SECRET (local development) req.ip is used.
const HEADER = "x-technova-proxy-secret";
const SECRET = process.env.ADMIN_PROXY_SECRET;

if (SECRET && SECRET.length < 32) {
  console.log("ADMIN_PROXY_SECRET should be at least 32 random characters");
}

const digest = (value) => crypto.createHash("sha256").update(value).digest();

// Sets req.clientIp; rejects admin requests that bypass the Vercel proxy
const adminProxy = (req, res, next) => {
  if (!SECRET) {
    req.clientIp = req.ip;
    return next();
  }

  if (!crypto.timingSafeEqual(digest(req.get(HEADER) || ""), digest(SECRET))) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  // Vercel overwrites X-Forwarded-For with the visitor's IP; Render only appends after it
  const visitor = (req.get("x-forwarded-for") || "").split(",")[0].trim();
  req.clientIp = net.isIP(visitor) ? visitor : req.ip;
  next();
};

module.exports = adminProxy;
