const mongoose = require("mongoose");

const Admin = require("../models/Admin");
const { readSession } = require("../utils/adminSession");

// Protects admin APIs: a valid session cookie for an active admin, or JSON 401.
// Sets req.admin = { id, email } for the route.
const requireAdmin = async (req, res, next) => {
  const session = readSession(req);

  const admin =
    session && mongoose.isValidObjectId(session.sub)
      ? await Admin.findById(session.sub).select("email active sessionVersion").lean()
      : null;

  if (!admin || !admin.active || admin.sessionVersion !== session.v) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  req.admin = { id: String(admin._id), email: admin.email };
  next();
};

module.exports = requireAdmin;
