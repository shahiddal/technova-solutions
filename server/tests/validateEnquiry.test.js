const test = require("node:test");
const assert = require("node:assert");

const { validateEnquiry } = require("../utils/validateEnquiry");

const valid = {
  name: "Asha Patel",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  company: "",
  service: "web-development",
  message: "We need a new website for our clinic.",
};

test("accepts a valid enquiry and trims values", () => {
  const { errors, data } = validateEnquiry({ ...valid, name: "  Asha Patel  " });

  assert.deepStrictEqual(errors, {});
  assert.strictEqual(data.name, "Asha Patel");
});

test("requires name, email, phone, service and message", () => {
  const { errors } = validateEnquiry({});

  assert.deepStrictEqual(Object.keys(errors).sort(), [
    "email",
    "message",
    "name",
    "phone",
    "service",
  ]);
});

test("rejects bad email, phone, service and short message", () => {
  const { errors } = validateEnquiry({
    ...valid,
    email: "asha@",
    phone: "12-34",
    service: "Web Development!",
    message: "too short",
  });

  assert.deepStrictEqual(Object.keys(errors).sort(), [
    "email",
    "message",
    "phone",
    "service",
  ]);
});

test("rejects phone numbers with letters or more than 15 digits", () => {
  assert.ok(validateEnquiry({ ...valid, phone: "98765abcde" }).errors.phone);
  assert.ok(validateEnquiry({ ...valid, phone: "1234567890123456" }).errors.phone);
});

test("rejects non-string values (NoSQL injection attempts)", () => {
  const { errors } = validateEnquiry({ ...valid, email: { $gt: "" } });

  assert.strictEqual(errors.email, "Invalid value");
});

test("allows an optional project slug but not arbitrary text", () => {
  assert.deepStrictEqual(
    validateEnquiry({ ...valid, project: "e-commerce-platform" }).errors,
    {}
  );
  assert.ok(validateEnquiry({ ...valid, project: "<script>" }).errors.project);
});

test('accepts "other" and any slug-shaped service (the controller checks it exists)', () => {
  assert.deepStrictEqual(validateEnquiry({ ...valid, service: "other" }).errors, {});
  assert.deepStrictEqual(validateEnquiry({ ...valid, service: "new-service" }).errors, {});
  assert.ok(validateEnquiry({ ...valid, service: "" }).errors.service);
});
