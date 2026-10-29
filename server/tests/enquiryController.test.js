// Unit tests for the enquiry controller's service lookup, with the database mocked out
const test = require("node:test");
const assert = require("node:assert");

const Service = require("../models/Service");
const Enquiry = require("../models/Enquiry");
const mailer = require("../services/mailer");

// Count notifications: swap the mailer export before the controller grabs it
let emailsSent = 0;
mailer.sendEnquiryNotification = async () => {
  emailsSent++;
};
const { createEnquiry } = require("../controllers/enquiryController");

const VALID = {
  name: "Asha Patel",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  service: "web-development",
  message: "We need a new website for our clinic.",
};

const call = async (body) => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  await createEnquiry({ body }, res);
  return res;
};

const setup = (t, { serviceExists }) => {
  emailsSent = 0;
  const lookups = t.mock.method(Service, "exists", serviceExists);
  t.mock.method(Enquiry, "exists", async () => null);
  const created = t.mock.method(Enquiry, "create", async (data) => ({ ...data, _id: "id" }));
  return { lookups, created };
};

test("checks the service with one minimal published-only lookup", async (t) => {
  const { lookups, created } = setup(t, { serviceExists: async () => ({ _id: "x" }) });

  const res = await call(VALID);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(lookups.mock.callCount(), 1);
  assert.deepStrictEqual(lookups.mock.calls[0].arguments, [
    { slug: "web-development", published: true },
  ]);
  assert.strictEqual(created.mock.callCount(), 1);
  assert.strictEqual(emailsSent, 1);
});

test("rejects a service that isn't published (or doesn't exist) without saving or emailing", async (t) => {
  const { created } = setup(t, { serviceExists: async () => null });

  const res = await call({ ...VALID, service: "hidden-service" });

  assert.strictEqual(res.statusCode, 400);
  assert.deepStrictEqual(res.body, {
    success: false,
    message: "Please correct the highlighted fields.",
    errors: { service: "Please select a service" },
  });
  assert.strictEqual(created.mock.callCount(), 0);
  assert.strictEqual(emailsSent, 0);
});

test('"other" is always accepted without a database lookup', async (t) => {
  const { lookups, created } = setup(t, { serviceExists: async () => null });

  const res = await call({ ...VALID, service: "other" });

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(lookups.mock.callCount(), 0);
  assert.strictEqual(created.mock.calls[0].arguments[0].service, "other");
});

test("reports a missing service together with other field errors", async (t) => {
  setup(t, { serviceExists: async () => null });

  const res = await call({ ...VALID, email: "bad", service: "nope" });

  assert.deepStrictEqual(Object.keys(res.body.errors).sort(), ["email", "service"]);
});

test("a database failure during the lookup returns the safe 500 and saves/sends nothing", async (t) => {
  const { created } = setup(t, {
    serviceExists: async () => {
      throw new Error("connect ECONNREFUSED 10.0.0.5:27017 (user:secret@cluster0)");
    },
  });
  t.mock.method(console, "error", () => {});

  const res = await call(VALID);

  assert.strictEqual(res.statusCode, 500);
  assert.deepStrictEqual(res.body, {
    success: false,
    message: "We couldn't send your enquiry right now. Please try again in a few minutes.",
  });
  assert.strictEqual(created.mock.callCount(), 0);
  assert.strictEqual(emailsSent, 0);
});
