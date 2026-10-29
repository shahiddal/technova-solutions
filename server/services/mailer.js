// Enquiry notification emails. Only sendEmail() knows about the provider (Resend),
// so switching providers means rewriting that one function.

const RESEND_API_URL = "https://api.resend.com/emails";

const { RESEND_API_KEY, MAIL_FROM, ENQUIRY_EMAIL_TO } = process.env;

// Email is optional: without these settings, enquiries are only saved to MongoDB
const enabled = Boolean(RESEND_API_KEY && MAIL_FROM && ENQUIRY_EMAIL_TO);

if (!enabled) {
  console.log(
    "Enquiry email notifications are off (set RESEND_API_KEY, MAIL_FROM and ENQUIRY_EMAIL_TO to enable)"
  );
}

const sendEmail = async ({ to, replyTo, subject, text, idempotencyKey }) => {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      // Resend drops repeats of the same key, so one enquiry never sends two emails
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ from: MAIL_FROM, to, reply_to: replyTo, subject, text }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`Resend ${response.status}: ${body.message || response.statusText}`);
  }
};

const formatIST = (date) =>
  `${date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST`;

// Plain text only, so visitor input can't inject HTML into the email
const sendEnquiryNotification = async (enquiry) => {
  if (!enabled) return;

  await sendEmail({
    to: ENQUIRY_EMAIL_TO,
    replyTo: enquiry.email,
    subject: `New enquiry from ${enquiry.name.replace(/\s+/g, " ")} (${enquiry.service})`,
    text: [
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone}`,
      `Company: ${enquiry.company || "-"}`,
      `Service: ${enquiry.service}`,
      `Project: ${enquiry.project || "-"}`,
      `Received: ${formatIST(enquiry.createdAt)} (${enquiry.createdAt.toISOString()})`,
      "",
      enquiry.message,
    ].join("\n"),
    idempotencyKey: `enquiry-${enquiry._id}`,
  });
};

module.exports = { sendEnquiryNotification };
