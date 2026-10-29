// Always-valid service choice; every other value must be a published Service slug (checked in the controller)
const OTHER_SERVICE = "other";
const SERVICE_ERROR = "Please select a service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-().]+$/;
const SLUG_REGEX = /^[a-z0-9-]{1,100}$/;

const MESSAGE_MIN = 20;

// Returns { errors, data }: errors maps field -> message, data holds the trimmed values
const validateEnquiry = (body = {}) => {
  const errors = {};
  const data = {};

  // Every field must be a string (or missing), never an object/array
  for (const field of ["name", "email", "phone", "company", "service", "project", "message"]) {
    const value = body[field];

    if (value !== undefined && value !== null && typeof value !== "string") {
      errors[field] = "Invalid value";
    } else {
      data[field] = (value || "").trim();
    }
  }

  const { name, email, phone, company, service, project, message } = data;

  if (!errors.name) {
    if (!name) errors.name = "Name is required";
    else if (name.length < 2 || name.length > 100)
      errors.name = "Name must be 2 to 100 characters";
  }

  if (!errors.email) {
    if (!email) errors.email = "Email is required";
    else if (email.length > 254 || !EMAIL_REGEX.test(email))
      errors.email = "Please enter a valid email address";
  }

  if (!errors.phone) {
    const digits = phone.replace(/\D/g, "").length;

    if (!phone) errors.phone = "Phone number is required";
    else if (!PHONE_REGEX.test(phone) || digits < 7 || digits > 15)
      errors.phone = "Please enter a valid phone number";
  }

  if (!errors.company && company.length > 100) {
    errors.company = "Company name must be 100 characters or less";
  }

  if (!errors.service && !SLUG_REGEX.test(service)) {
    errors.service = SERVICE_ERROR;
  }

  if (!errors.project && project && !SLUG_REGEX.test(project)) {
    errors.project = "Invalid project";
  }

  if (!errors.message) {
    if (!message) errors.message = "Message is required";
    else if (message.length < MESSAGE_MIN)
      errors.message = `Message must be at least ${MESSAGE_MIN} characters`;
    else if (message.length > 5000)
      errors.message = "Message must be 5000 characters or less";
  }

  // Leave empty optional fields out of the saved document
  if (!data.company) delete data.company;
  if (!data.project) delete data.project;

  return { errors, data };
};

module.exports = { validateEnquiry, OTHER_SERVICE, SERVICE_ERROR };
