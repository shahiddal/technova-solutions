const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Check required fields (must be non-empty strings, not objects/arrays)
    if ([name, email, subject, message].some((field) => typeof field !== "string" || !field.trim())) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Length limits
    if (
      name.length > 100 ||
      email.length > 254 ||
      subject.length > 200 ||
      message.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields are too long",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Create contact
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Contact message submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Contact API Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to submit contact message",
    });
  }
};

module.exports = {
  createContact,
};