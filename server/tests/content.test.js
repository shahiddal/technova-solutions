// Content API + seed tests. They need a throwaway MongoDB database whose name ends in "_test":
//   TEST_MONGO_URI=mongodb://127.0.0.1:27017/technova_test npm test
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");

const { seedContent, loadStaticContent } = require("../scripts/seedContent");
const Service = require("../models/Service");
const { startServer } = require("./helpers/server");

const { TEST_MONGO_URI } = process.env;
const skip = !TEST_MONGO_URI && "set TEST_MONGO_URI to run the content API tests";

let server;
let baseUrl;
let content;
let firstSeed;
let secondSeed;

const get = async (urlPath) => {
  const response = await fetch(baseUrl + urlPath);
  return { status: response.status, body: await response.json() };
};

before(async () => {
  if (skip) return;

  await mongoose.connect(TEST_MONGO_URI);
  const { db } = mongoose.connection;
  assert.match(db.databaseName, /_test$/, "refusing to run against a non-test database");

  // Start clean (content collections only), with one enquiry that seeding must not touch
  for (const name of ["services", "projects", "blogs", "enquiries"]) {
    await db.collection(name).deleteMany({});
  }
  await db.collection("enquiries").insertOne({ name: "Keep Me", email: "keep@example.com" });

  content = await loadStaticContent();
  firstSeed = await seedContent();
  secondSeed = await seedContent();

  await Service.create({ slug: "hidden-service", title: "Hidden Service", published: false });

  server = await startServer({ mongoUri: TEST_MONGO_URI });
  baseUrl = server.baseUrl;
});

after(async () => {
  server?.stop();
  await mongoose.disconnect();
});

test("seed imports every static item and is idempotent", { skip }, async () => {
  for (const key of ["services", "projects", "blogs"]) {
    assert.deepStrictEqual(firstSeed[key], { total: content[key].length, created: content[key].length, existing: 0 });
    assert.deepStrictEqual(secondSeed[key], { total: content[key].length, created: 0, existing: content[key].length });
    assert.strictEqual(await mongoose.connection.db.collection(key).countDocuments(), content[key].length + (key === "services" ? 1 : 0));
  }
});

test("seed leaves other collections alone", { skip }, async () => {
  assert.strictEqual(await mongoose.connection.db.collection("enquiries").countDocuments(), 1);
});

test("duplicate slugs are rejected", { skip }, async () => {
  await assert.rejects(
    Service.create({ slug: "web-development", title: "Copy" }),
    (error) => error.code === 11000
  );
});

for (const [key, route, cardFields] of [
  ["services", "/api/services", ["slug", "icon", "title", "summary"]],
  ["projects", "/api/projects", ["slug", "service", "icon", "title", "category", "summary", "technologies"]],
  ["blogs", "/api/blogs", ["slug", "icon", "title", "category", "author", "date", "summary"]],
]) {
  test(`GET ${route} lists published ${key} in the original order with card fields only`, { skip }, async () => {
    const { status, body } = await get(route);

    assert.strictEqual(status, 200);
    assert.strictEqual(body.success, true);
    assert.deepStrictEqual(body.data.map((item) => item.slug), content[key].map((item) => item.slug));
    body.data.forEach((item, index) => {
      const expected = Object.fromEntries(cardFields.map((field) => [field, content[key][index][field]]));
      assert.deepStrictEqual(item, expected);
    });
  });

  test(`GET ${route}/:slug returns the exact static content`, { skip }, async () => {
    for (const item of content[key]) {
      const { status, body } = await get(`${route}/${item.slug}`);

      assert.strictEqual(status, 200);
      assert.deepStrictEqual(body.data, item);
    }
  });

  test(`GET ${route}/:slug returns JSON 404 for unknown slugs`, { skip }, async () => {
    for (const slug of ["does-not-exist", "BAD%20SLUG", "a".repeat(101)]) {
      const { status, body } = await get(`${route}/${slug}`);

      assert.strictEqual(status, 404);
      assert.strictEqual(body.success, false);
      assert.match(body.message, /not found/);
    }
  });
}

test("unpublished content is hidden from lists and detail", { skip }, async () => {
  const list = await get("/api/services");
  assert.ok(!list.body.data.some((item) => item.slug === "hidden-service"));

  const detail = await get("/api/services/hidden-service");
  assert.strictEqual(detail.status, 404);
});

test("content endpoints are read-only", { skip }, async () => {
  for (const method of ["POST", "PUT", "DELETE"]) {
    const response = await fetch(`${baseUrl}/api/services/web-development`, { method });
    assert.strictEqual(response.status, 404);
    assert.deepStrictEqual(await response.json(), { success: false, message: "API route not found" });
  }
});
