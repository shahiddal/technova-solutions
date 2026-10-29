// End-to-end enquiry API tests against a real server and a throwaway "_test" database.
// Resend is stubbed locally (tests/fixtures/resendStub.js) so emails can be counted.
//   TEST_MONGO_URI=mongodb://127.0.0.1:27017/technova_test npm test
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const mongoose = require("mongoose");

const { startServer } = require("./helpers/server");

const { TEST_MONGO_URI } = process.env;
const skip = !TEST_MONGO_URI && "set TEST_MONGO_URI to run the enquiry API tests";

const EMAIL_LOG = path.join(os.tmpdir(), `technova-resend-${process.pid}.log`);

let server;
let db;
let nextIp = 1;

// Each test posts from its own client IP so the rate limiter doesn't leak between tests
const post = async (route, body, ip = `10.0.0.${nextIp++}`) => {
  const response = await fetch(server.baseUrl + route, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
};

// Notifications are sent after the response, so give them a moment
const emailsSent = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return fs.existsSync(EMAIL_LOG) ? fs.readFileSync(EMAIL_LOG, "utf8").trim().split("\n").filter(Boolean).length : 0;
};

const enquiries = (filter = {}) => db.collection("enquiries").countDocuments(filter);

const enquiry = (overrides) => ({
  name: "Asha Patel",
  email: `asha-${nextIp}@example.com`,
  phone: "+91 98765 43210",
  service: "web-development",
  message: "We need a new website for our clinic.",
  ...overrides,
});

const INVALID_SERVICE = {
  success: false,
  message: "Please correct the highlighted fields.",
  errors: { service: "Please select a service" },
};

before(async () => {
  if (skip) return;

  await mongoose.connect(TEST_MONGO_URI);
  db = mongoose.connection.db;
  assert.match(db.databaseName, /_test$/, "refusing to run against a non-test database");

  for (const name of ["services", "enquiries", "contacts"]) {
    await db.collection(name).deleteMany({});
  }
  await db.collection("services").insertMany([
    { slug: "web-development", title: "Web Development", published: true },
    { slug: "hidden-service", title: "Hidden Service", published: false },
  ]);

  fs.rmSync(EMAIL_LOG, { force: true });
  server = await startServer({
    mongoUri: TEST_MONGO_URI,
    nodeArgs: ["--require", path.join(__dirname, "fixtures/resendStub.js")],
    env: {
      RESEND_API_KEY: "re_test_key",
      MAIL_FROM: "TechNova <no-reply@example.com>",
      ENQUIRY_EMAIL_TO: "sales@example.com",
      RESEND_STUB_LOG: EMAIL_LOG,
    },
  });
});

after(async () => {
  server?.stop();
  fs.rmSync(EMAIL_LOG, { force: true });
  await mongoose.disconnect();
});

test("published service: saved once and one email sent", { skip }, async () => {
  const sentBefore = await emailsSent();
  const body = enquiry({ email: "published@example.com" });

  const res = await post("/api/enquiries", body);

  assert.strictEqual(res.status, 201);
  assert.deepStrictEqual(Object.keys(res.body).sort(), ["message", "success"]);
  assert.strictEqual(await enquiries({ email: "published@example.com", service: "web-development" }), 1);
  assert.strictEqual(await emailsSent(), sentBefore + 1);
});

test("unpublished service: rejected, not saved, no email", { skip }, async () => {
  const sentBefore = await emailsSent();

  const res = await post("/api/enquiries", enquiry({ email: "hidden@example.com", service: "hidden-service" }));

  assert.strictEqual(res.status, 400);
  assert.deepStrictEqual(res.body, INVALID_SERVICE);
  assert.strictEqual(await enquiries({ email: "hidden@example.com" }), 0);
  assert.strictEqual(await emailsSent(), sentBefore);
});

test("non-existent service: rejected, not saved, no email", { skip }, async () => {
  const sentBefore = await emailsSent();

  for (const service of ["does-not-exist", "Web Development"]) {
    const res = await post("/api/enquiries", enquiry({ email: "missing@example.com", service }));

    assert.strictEqual(res.status, 400);
    assert.deepStrictEqual(res.body, INVALID_SERVICE);
  }
  assert.strictEqual(await enquiries({ email: "missing@example.com" }), 0);
  assert.strictEqual(await emailsSent(), sentBefore);
});

test('"other" is still accepted', { skip }, async () => {
  const sentBefore = await emailsSent();

  const res = await post("/api/enquiries", enquiry({ email: "other@example.com", service: "other" }));

  assert.strictEqual(res.status, 201);
  assert.strictEqual(await enquiries({ email: "other@example.com", service: "other" }), 1);
  assert.strictEqual(await emailsSent(), sentBefore + 1);
});

test("duplicate submit within 10 minutes: success, no second record or email", { skip }, async () => {
  const body = enquiry({ email: "dupe@example.com" });
  await post("/api/enquiries", body);
  const sentBefore = await emailsSent();

  const res = await post("/api/enquiries", body);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(await enquiries({ email: "dupe@example.com" }), 1);
  assert.strictEqual(await emailsSent(), sentBefore);
});

test("honeypot: normal success reply, nothing saved or sent", { skip }, async () => {
  const sentBefore = await emailsSent();

  const res = await post("/api/enquiries", enquiry({ email: "bot@example.com", website: "http://spam.example" }));

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(await enquiries({ email: "bot@example.com" }), 0);
  assert.strictEqual(await emailsSent(), sentBefore);
});

test("rate limit: 6th request from one IP gets 429 and nothing is saved", { skip }, async () => {
  const ip = "10.9.9.9";
  for (let i = 0; i < 5; i++) await post("/api/enquiries", {}, ip);
  const sentBefore = await emailsSent();

  const res = await post("/api/enquiries", enquiry({ email: "limited@example.com" }), ip);

  assert.strictEqual(res.status, 429);
  assert.strictEqual(await enquiries({ email: "limited@example.com" }), 0);
  assert.strictEqual(await emailsSent(), sentBefore);
});

test("/api/contact is unchanged", { skip }, async () => {
  const res = await post("/api/contact", {
    name: "Old Form",
    email: "old@example.com",
    subject: "Hello",
    message: "Legacy contact endpoint still works",
  });

  assert.strictEqual(res.status, 201);
  assert.deepStrictEqual(res.body, { success: true, message: "Contact message submitted successfully" });
  assert.strictEqual(await db.collection("contacts").countDocuments({ email: "old@example.com" }), 1);
});
