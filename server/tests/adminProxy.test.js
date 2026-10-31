// Admin API behind the Vercel proxy (ADMIN_PROXY_SECRET set), against a "_test" database.
//   TEST_MONGO_URI=mongodb://127.0.0.1:27017/technova_test npm test
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");

const { startServer } = require("./helpers/server");
const { upsertAdmin } = require("../scripts/createAdmin");
const Admin = require("../models/Admin");

const { TEST_MONGO_URI } = process.env;
const skip = !TEST_MONGO_URI && "set TEST_MONGO_URI to run the admin proxy tests";

const PROXY_SECRET = "proxy-secret-" + "p".repeat(40);
const EMAIL = "admin@example.com";
const PASSWORD = "correct horse battery staple";
const VERCEL_EGRESS = "76.76.21.1";

let server;

// viaVercel: what the Vercel rewrite sends (secret header + X-Forwarded-For it wrote,
// with Render's hop appended after it)
const request = async (method, route, { body, viaVercel, xff, secret, cookie } = {}) => {
  const headers = {
    ...(body && { "Content-Type": "application/json" }),
    ...(cookie && { Cookie: cookie }),
    ...(xff && { "X-Forwarded-For": xff }),
    ...(viaVercel && { "X-Forwarded-For": `${viaVercel}, ${VERCEL_EGRESS}`, "X-Technova-Proxy-Secret": PROXY_SECRET }),
    ...(secret !== undefined && { "X-Technova-Proxy-Secret": secret }),
  };
  const response = await fetch(server.baseUrl + route, { method, headers, body: body && JSON.stringify(body) });
  return { status: response.status, headers: response.headers, body: await response.json() };
};

const login = (password, options) => request("POST", "/api/admin/login", { body: { email: EMAIL, password }, ...options });

before(async () => {
  if (skip) return;

  await mongoose.connect(TEST_MONGO_URI);
  assert.match(mongoose.connection.db.databaseName, /_test$/, "refusing to run against a non-test database");
  await Admin.deleteMany({});
  await upsertAdmin(EMAIL, PASSWORD);

  server = await startServer({
    mongoUri: TEST_MONGO_URI,
    env: { ADMIN_AUTH_SECRET: "test-secret-" + "x".repeat(40), ADMIN_PROXY_SECRET: PROXY_SECRET },
  });
});

after(async () => {
  server?.stop();
  await mongoose.disconnect();
});

test("admin API rejects requests that bypass the proxy (no or wrong secret)", { skip }, async () => {
  for (const secret of [undefined, "", "wrong", PROXY_SECRET.slice(0, -1)]) {
    for (const [method, route] of [["POST", "/api/admin/login"], ["GET", "/api/admin/me"], ["POST", "/api/admin/logout"]]) {
      const res = await request(method, route, {
        body: method === "POST" ? { email: EMAIL, password: PASSWORD } : undefined,
        xff: "203.0.113.99",
        secret,
      });

      assert.strictEqual(res.status, 403, `${method} ${route} secret=${secret}`);
      assert.deepStrictEqual(res.body, { success: false, message: "Forbidden" });
      assert.strictEqual(res.headers.get("set-cookie"), null);
    }
  }
});

test("public APIs don't need the proxy secret", { skip }, async () => {
  assert.strictEqual((await request("GET", "/api/services")).status, 200);
});

test("through the proxy, login works and the session works", { skip }, async () => {
  const res = await login(PASSWORD, { viaVercel: "203.0.113.1" });
  assert.strictEqual(res.status, 200);

  const cookie = res.headers.get("set-cookie").split(";")[0];
  assert.strictEqual((await request("GET", "/api/admin/me", { viaVercel: "203.0.113.1", cookie })).status, 200);
});

test("the per-IP limit uses the visitor IP Vercel reports, not the shared Vercel IP", { skip }, async () => {
  for (let i = 0; i < 5; i++) {
    assert.strictEqual((await login("wrong password!", { viaVercel: "203.0.113.10" })).status, 401);
  }

  // Same visitor is blocked...
  assert.strictEqual((await login(PASSWORD, { viaVercel: "203.0.113.10" })).status, 429);
  // ...but another visitor behind the same Vercel IP is not
  assert.strictEqual((await login(PASSWORD, { viaVercel: "203.0.113.20" })).status, 200);
});

test("a malformed forwarded IP falls back to the proxy-reported address", { skip }, async () => {
  for (let i = 0; i < 5; i++) {
    await login("wrong password!", { viaVercel: `not-an-ip-${i}` });
  }

  // All of those counted against the same fallback address, so it is blocked now
  assert.strictEqual((await login(PASSWORD, { viaVercel: "garbage" })).status, 429);
});
