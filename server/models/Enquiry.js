const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    company: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // Slug of a published Service, or "other"
    service: {
      type: String,
      required: true,
      maxlength: 100,
    },

    // Slug of the project the visitor enquired from, if any
    project: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

// Duplicate check looks up recent enquiries by email
enquirySchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("Enquiry", enquirySchema);
