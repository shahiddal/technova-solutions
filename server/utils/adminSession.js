// Admin session: a signed JWT (HS256) in an httpOnly cookie scoped to /api/admin.
// In production the browser reaches /api/admin through the site's own domain (Vercel
// rewrite), so the cookie is first-party and can be SameSite=Strict.
const jwt = require("jsonwebtoken");

const COOKIE_NAME = "technova_admin";
const SESSION_HOURS = 8;

const SECRET = process.env.ADMIN_AUTH_SECRET;
const isAdminAuthConfigured = Boolean(SECRET && SECRET.length >= 32);

if (!isAdminAuthConfigured) {
  console.log("Admin login is off (set ADMIN_AUTH_SECRET to at least 32 random characters)");
}

const cookieOptions = (req) => ({
  httpOnly: true,
  // HTTPS requests (and always in production) only; plain-HTTP localhost still works in development
  secure: req.secure || process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/admin",
});

const readCookie = (header, name) => {
  for (const part of (header || "").split(";")) {
    const index = part.indexOf("=");
    if (index > 0 && part.slice(0, index).trim() === name) {
      return decodeURIComponent(part.slice(index + 1).trim());
    }
  }
  return null;
};

// Only the admin id (sub) and session version go in the token
const createSession = (req, res, admin) => {
  const token = jwt.sign({ v: admin.sessionVersion }, SECRET, {
    algorithm: "HS256",
    subject: String(admin._id),
    expiresIn: `${SESSION_HOURS}h`,
  });

  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions(req),
    maxAge: SESSION_HOURS * 60 * 60 * 1000,
  });
};

const clearSession = (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions(req));
};

// Verified token payload ({ sub, v, iat, exp }), or null if missing, tampered or expired
const readSession = (req) => {
  if (!isAdminAuthConfigured) return null;

  try {
    const token = readCookie(req.headers.cookie, COOKIE_NAME);
    return token ? jwt.verify(token, SECRET, { algorithms: ["HS256"] }) : null;
  } catch {
    return null;
  }
};

module.exports = {
  COOKIE_NAME,
  isAdminAuthConfigured,
  createSession,
  clearSession,
  readSession,
};
