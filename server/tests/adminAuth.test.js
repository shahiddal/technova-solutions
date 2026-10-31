// Admin authentication tests against a real server and a throwaway "_test" database.
//   TEST_MONGO_URI=mongodb://127.0.0.1:27017/technova_test npm test
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { startServer } = require("./helpers/server");
const { upsertAdmin } = require("../scripts/createAdmin");
const Admin = require("../models/Admin");

const { TEST_MONGO_URI } = process.env;
const skip = !TEST_MONGO_URI && "set TEST_MONGO_URI to run the admin auth tests";

const SECRET = "test-secret-" + "x".repeat(40);
const EMAIL = "admin@example.com";
const PASSWORD = "correct horse battery staple";

let server;
let nextIp = 1;
const newIp = () => `10.1.0.${nextIp++}`;

const request = async (method, route, { body, cookie, ip = newIp(), headers = {} } = {}) => {
  const response = await fetch(server.baseUrl + route, {
    method,
    headers: {
      "X-Forwarded-For": ip,
      ...(body && { "Content-Type": "application/json" }),
      ...(cookie && { Cookie: cookie }),
      ...headers,
    },
    body: body && JSON.stringify(body),
  });
  const text = await response.text();
  return { status: response.status, headers: response.headers, text, body: text ? JSON.parse(text) : null };
};

const login = (body, options) => request("POST", "/api/admin/login", { body, ...options });

// "name=value" from a Set-Cookie header
const cookieFrom = (res) => res.headers.get("set-cookie").split(";")[0];

const tokenFor = async (claims, options) => {
  const admin = await Admin.findOne({ email: EMAIL });
  return jwt.sign({ v: admin.sessionVersion, ...claims }, SECRET, {
    subject: String(admin._id),
    expiresIn: "1h",
    ...options,
  });
};

before(async () => {
  if (skip) return;

  await mongoose.connect(TEST_MONGO_URI);
  assert.match(mongoose.connection.db.databaseName, /_test$/, "refusing to run against a non-test database");
  await Admin.deleteMany({});
  await upsertAdmin(EMAIL, PASSWORD);

  server = await startServer({ mongoUri: TEST_MONGO_URI, env: { ADMIN_AUTH_SECRET: SECRET } });
});

after(async () => {
  server?.stop();
  await mongoose.disconnect();
});

test("provisioning stores a bcrypt hash, never the password", { skip }, async () => {
  const admin = await Admin.findOne({ email: EMAIL }).select("+passwordHash").lean();

  assert.match(admin.passwordHash, /^\$2[aby]\$12\$/);
  assert.ok(!JSON.stringify(admin).includes(PASSWORD));
});

test("provisioning enforces one admin and a strong password", { skip }, async () => {
  await assert.rejects(upsertAdmin("second@example.com", PASSWORD), /different admin account already exists/);
  await assert.rejects(upsertAdmin(EMAIL, "short"), /at least 12 characters/);
  await assert.rejects(upsertAdmin(EMAIL, "x".repeat(73)), /at most 72 bytes/);
  assert.strictEqual(await Admin.countDocuments(), 1);
});

test("correct credentials log in and set a secure session cookie", { skip }, async () => {
  const res = await login({ email: " Admin@Example.com ", password: PASSWORD });

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, { success: true, admin: { email: EMAIL } });
  assert.strictEqual(res.headers.get("cache-control"), "no-store");

  const cookie = res.headers.get("set-cookie");
  assert.match(cookie, /^technova_admin=[\w-]+\.[\w-]+\.[\w-]+;/);
  assert.match(cookie, /Max-Age=28800/);
  assert.match(cookie, /Path=\/api\/admin/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  assert.doesNotMatch(cookie, /Secure/, "plain HTTP in development");

  // The token only carries the admin id and session version
  const payload = jwt.decode(cookieFrom(res).split("=")[1]);
  assert.deepStrictEqual(Object.keys(payload).sort(), ["exp", "iat", "sub", "v"]);
  assert.strictEqual(payload.exp - payload.iat, 8 * 60 * 60);
});

test("over HTTPS (behind the proxy) the cookie is Secure", { skip }, async () => {
  const res = await login({ email: EMAIL, password: PASSWORD }, { headers: { "X-Forwarded-Proto": "https" } });

  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get("set-cookie"), /; Secure/);
});

test("wrong password and unknown email get the same generic 401", { skip }, async () => {
  const wrongPassword = await login({ email: EMAIL, password: "not the password" });
  const unknownEmail = await login({ email: "nobody@example.com", password: PASSWORD });

  for (const res of [wrongPassword, unknownEmail]) {
    assert.strictEqual(res.status, 401);
    assert.deepStrictEqual(res.body, { success: false, message: "Invalid email or password" });
    assert.strictEqual(res.headers.get("set-cookie"), null);
  }
});

test("missing or non-string credentials are rejected", { skip }, async () => {
  for (const body of [{}, { email: EMAIL }, { password: PASSWORD }, { email: { $ne: "" }, password: { $ne: "" } }]) {
    const res = await login(body);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.headers.get("set-cookie"), null);
  }
});

test("protected endpoints return 401 without a session and 200 with one", { skip }, async () => {
  for (const route of ["/api/admin/me", "/api/admin/dashboard"]) {
    const res = await request("GET", route);
    assert.strictEqual(res.status, 401);
    assert.deepStrictEqual(res.body, { success: false, message: "Authentication required" });
  }

  const cookie = cookieFrom(await login({ email: EMAIL, password: PASSWORD }));

  const me = await request("GET", "/api/admin/me", { cookie });
  assert.strictEqual(me.status, 200);
  assert.deepStrictEqual(me.body, { success: true, admin: { email: EMAIL } });

  const dashboard = await request("GET", "/api/admin/dashboard", { cookie });
  assert.strictEqual(dashboard.status, 200);
  assert.deepStrictEqual(Object.keys(dashboard.body.data).sort(), ["blogs", "enquiries", "newEnquiries", "projects", "services"]);
});

test("expired, tampered, wrong-secret and wrong-algorithm tokens get 401", { skip }, async () => {
  const valid = await tokenFor();
  const tokens = [
    await tokenFor({}, { expiresIn: -10 }),
    valid.slice(0, -2) + (valid.endsWith("AA") ? "BB" : "AA"),
    jwt.sign({ v: 0 }, "some-other-secret-" + "y".repeat(40), { subject: "x", expiresIn: "1h" }),
    jwt.sign({ v: 0, sub: valid.sub }, "", { algorithm: "none" }),
    "not-a-jwt",
  ];

  for (const token of tokens) {
    const res = await request("GET", "/api/admin/me", { cookie: `technova_admin=${token}` });
    assert.strictEqual(res.status, 401, token);
  }

  assert.strictEqual((await request("GET", "/api/admin/me", { cookie: `technova_admin=${valid}` })).status, 200);
});

test("logout clears the cookie and invalidates the session server-side", { skip }, async () => {
  const cookie = cookieFrom(await login({ email: EMAIL, password: PASSWORD }));

  const res = await request("POST", "/api/admin/logout", { cookie });
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get("set-cookie"), /^technova_admin=;.*Expires=Thu, 01 Jan 1970/);

  // Replaying the old token no longer works
  assert.strictEqual((await request("GET", "/api/admin/me", { cookie })).status, 401);

  // Logout without a session is harmless
  assert.strictEqual((await request("POST", "/api/admin/logout")).status, 200);
});

test("a deactivated admin can't log in or use an existing session", { skip }, async () => {
  const cookie = cookieFrom(await login({ email: EMAIL, password: PASSWORD }));
  await Admin.updateOne({ email: EMAIL }, { active: false });

  try {
    assert.strictEqual((await request("GET", "/api/admin/me", { cookie })).status, 401);
    assert.strictEqual((await login({ email: EMAIL, password: PASSWORD })).status, 401);
  } finally {
    await Admin.updateOne({ email: EMAIL }, { active: true });
  }
});

test("CORS never allows credentials or a wildcard origin", { skip }, async () => {
  for (const origin of ["https://evil.example", "http://localhost:5173"]) {
    const res = await request("OPTIONS", "/api/admin/login", {
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });

    assert.notStrictEqual(res.headers.get("access-control-allow-origin"), "*");
    assert.strictEqual(res.headers.get("access-control-allow-credentials"), null);
  }

  const evil = await request("OPTIONS", "/api/admin/login", {
    headers: { Origin: "https://evil.example", "Access-Control-Request-Method": "POST" },
  });
  assert.strictEqual(evil.headers.get("access-control-allow-origin"), null);
});

test("5 failed logins from one IP block that IP, even with the right password", { skip }, async () => {
  const ip = "10.2.0.1";
  for (let i = 0; i < 5; i++) {
    assert.strictEqual((await login({ email: EMAIL, password: "wrong password!" }, { ip })).status, 401);
  }

  const blocked = await login({ email: EMAIL, password: PASSWORD }, { ip });
  assert.strictEqual(blocked.status, 429);
  assert.deepStrictEqual(blocked.body, { success: false, message: "Too many login attempts. Please try again later." });
  assert.strictEqual(blocked.headers.get("set-cookie"), null);

  // Other IPs are unaffected
  assert.strictEqual((await login({ email: EMAIL, password: PASSWORD })).status, 200);
});

test("a successful login resets that IP's failure count", { skip }, async () => {
  const ip = "10.3.0.1";
  for (let i = 0; i < 4; i++) await login({ email: EMAIL, password: "wrong password!" }, { ip });
  assert.strictEqual((await login({ email: EMAIL, password: PASSWORD }, { ip })).status, 200);

  for (let i = 0; i < 4; i++) {
    assert.strictEqual((await login({ email: EMAIL, password: "wrong password!" }, { ip })).status, 401);
  }
});

test("responses and server logs never contain the password, hash or secret", { skip }, async () => {
  const stored = await Admin.findOne({ email: EMAIL }).select("+passwordHash").lean();
  const responses = [
    await login({ email: EMAIL, password: PASSWORD }),
    await login({ email: EMAIL, password: "wrong password!" }),
  ];
  const cookie = cookieFrom(responses[0]);
  responses.push(await request("GET", "/api/admin/me", { cookie }));
  responses.push(await request("GET", "/api/admin/dashboard", { cookie }));

  const everything = responses.map((res) => res.text).join("\n") + server.output();
  for (const secret of [PASSWORD, stored.passwordHash, SECRET, "passwordHash"]) {
    assert.ok(!everything.includes(secret), `leaked: ${secret.slice(0, 8)}…`);
  }
});

// Runs last: it fills the global failure budget for the rest of this server's life
test("20 failed logins across IPs block all logins (distributed brute force)", { skip }, async () => {
  for (let i = 0; i < 20; i++) {
    await login({ email: EMAIL, password: "wrong password!" }, { ip: `10.4.${i}.1` });
  }

  const res = await login({ email: EMAIL, password: PASSWORD }, { ip: "10.5.0.1" });
  assert.strictEqual(res.status, 429);
});
