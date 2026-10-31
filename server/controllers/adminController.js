const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const Admin = require("../models/Admin");
const Service = require("../models/Service");
const Project = require("../models/Project");
const Blog = require("../models/Blog");
const Enquiry = require("../models/Enquiry");
const {
  isAdminAuthConfigured,
  createSession,
  clearSession,
  readSession,
} = require("../utils/adminSession");
const {
  isLoginBlocked,
  recordLoginFailure,
  clearLoginFailures,
} = require("../utils/loginAttempts");

// Compared against when the email is unknown, so both cases take the same time
const DUMMY_HASH = bcrypt.hashSync("unused-timing-equaliser", 12);

// Same reply for unknown email and wrong password
const LOGIN_FAILED = {
  success: false,
  message: "Invalid email or password",
};

const login = async (req, res) => {
  if (!isAdminAuthConfigured) {
    return res.status(503).json({ success: false, message: "Admin login is not available" });
  }

  if (isLoginBlocked(req.clientIp)) {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    });
  }

  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password ||
    email.length > 254 ||
    password.length > 200
  ) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email: email.trim().toLowerCase(), active: true }).select(
    "+passwordHash"
  );
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !valid) {
    recordLoginFailure(req.clientIp);
    return res.status(401).json(LOGIN_FAILED);
  }

  clearLoginFailures(req.clientIp);
  createSession(req, res, admin);

  res.json({ success: true, admin: { email: admin.email } });
};

// Always clears the cookie; a valid session also ends every other session of this admin
const logout = async (req, res) => {
  const session = readSession(req);

  if (session && mongoose.isValidObjectId(session.sub)) {
    await Admin.updateOne(
      { _id: session.sub, sessionVersion: session.v },
      { $inc: { sessionVersion: 1 } }
    );
  }

  clearSession(req, res);
  res.json({ success: true, message: "Logged out" });
};

const me = (req, res) => {
  res.json({ success: true, admin: { email: req.admin.email } });
};

const dashboard = async (req, res) => {
  const [services, projects, blogs, enquiries, newEnquiries] = await Promise.all([
    Service.countDocuments(),
    Project.countDocuments(),
    Blog.countDocuments(),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
  ]);

  res.json({
    success: true,
    admin: { email: req.admin.email },
    data: { services, projects, blogs, enquiries, newEnquiries },
  });
};

module.exports = {
  login,
  logout,
  me,
  dashboard,
};
