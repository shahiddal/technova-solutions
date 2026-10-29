const Enquiry = require("../models/Enquiry");
const Service = require("../models/Service");
const {
  validateEnquiry,
  OTHER_SERVICE,
  SERVICE_ERROR,
} = require("../utils/validateEnquiry");
const { sendEnquiryNotification } = require("../services/mailer");

const SUCCESS_MESSAGE =
  "Thank you! Your enquiry has been received. Our team will contact you within 1 business day.";

// Same email + message within this window counts as a double submit
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const createEnquiry = async (req, res) => {
  try {
    // Honeypot: real visitors never see or fill the "website" field
    if (req.body?.website) {
      return res.status(201).json({ success: true, message: SUCCESS_MESSAGE });
    }

    const { errors, data } = validateEnquiry(req.body);

    // The service must be a published Service in MongoDB (one existence check, _id only)
    if (
      !errors.service &&
      data.service !== OTHER_SERVICE &&
      !(await Service.exists({ slug: data.service, published: true }))
    ) {
      errors.service = SERVICE_ERROR;
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({
        success: false,
        message: "Please correct the highlighted fields.",
        errors,
      });
    }

    const duplicate = await Enquiry.exists({
      email: data.email.toLowerCase(),
      message: data.message,
      createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    });

    if (duplicate) {
      return res.status(200).json({ success: true, message: SUCCESS_MESSAGE });
    }

    const enquiry = await Enquiry.create(data);

    // Don't make the visitor wait for (or fail on) the email
    sendEnquiryNotification(enquiry).catch((error) =>
      console.error("Enquiry email failed:", error.message)
    );

    res.status(201).json({ success: true, message: SUCCESS_MESSAGE });
  } catch (error) {
    console.error("Enquiry API Error:", error.message);

    res.status(500).json({
      success: false,
      message:
        "We couldn't send your enquiry right now. Please try again in a few minutes.",
    });
  }
};

module.exports = {
  createEnquiry,
};
