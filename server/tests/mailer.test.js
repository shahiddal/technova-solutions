const test = require("node:test");
const assert = require("node:assert");

const MAILER = require.resolve("../services/mailer");

// The mailer reads env vars when it loads, so load a fresh copy per config
const loadMailer = (env) => {
  Object.assign(process.env, env);
  delete require.cache[MAILER];
  const mailer = require(MAILER);
  for (const key of Object.keys(env)) delete process.env[key];
  return mailer;
};

const CONFIG = {
  RESEND_API_KEY: "re_test_key",
  MAIL_FROM: "TechNova <no-reply@example.com>",
  ENQUIRY_EMAIL_TO: "sales@example.com",
};

const enquiry = {
  _id: "64b000000000000000000001",
  name: "Asha\nPatel",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  service: "web-development",
  project: "company-website",
  message: "We need a new website.",
  createdAt: new Date("2026-10-29T08:59:33Z"),
};

const stubFetch = (t, response) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    return response;
  });
  return calls;
};

test("does nothing when Resend is not configured", async (t) => {
  const calls = stubFetch(t, { ok: true });
  const { sendEnquiryNotification } = loadMailer({});

  await sendEnquiryNotification(enquiry);

  assert.strictEqual(calls.length, 0);
});

test("sends one plain-text email through Resend", async (t) => {
  const calls = stubFetch(t, { ok: true });
  const { sendEnquiryNotification } = loadMailer(CONFIG);

  await sendEnquiryNotification(enquiry);

  assert.strictEqual(calls.length, 1);
  const { url, options } = calls[0];
  const body = JSON.parse(options.body);

  assert.strictEqual(url, "https://api.resend.com/emails");
  assert.strictEqual(options.headers.Authorization, "Bearer re_test_key");
  assert.strictEqual(options.headers["Idempotency-Key"], `enquiry-${enquiry._id}`);
  assert.strictEqual(body.to, "sales@example.com");
  assert.strictEqual(body.reply_to, "asha@example.com");
  assert.strictEqual(body.subject, "New enquiry from Asha Patel (web-development)");
  assert.strictEqual(body.html, undefined);
  for (const line of ["Phone: +91 98765 43210", "Project: company-website", "29 Oct 2026, 2:29 pm IST", "We need a new website."])
    assert.ok(body.text.includes(line), line);
});

test("throws when Resend rejects the email", async (t) => {
  stubFetch(t, {
    ok: false,
    status: 403,
    statusText: "Forbidden",
    json: async () => ({ message: "The domain is not verified" }),
  });
  const { sendEnquiryNotification } = loadMailer(CONFIG);

  await assert.rejects(sendEnquiryNotification(enquiry), /Resend 403: The domain is not verified/);
});
