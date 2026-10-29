// Imports the site's static content (client/src/data) into MongoDB.
// Idempotent: upserts by slug, never deletes anything, and only touches
// the services, projects and blogs collections.
//
//   npm run seed            (uses MONGO_URI from server/.env)

require("dotenv").config();

const path = require("path");
const { pathToFileURL } = require("url");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Service = require("../models/Service");
const Project = require("../models/Project");
const Blog = require("../models/Blog");

const DATA_DIR = path.join(__dirname, "../../client/src/data");

const SOURCES = [
  { key: "services", Model: Service },
  { key: "projects", Model: Project },
  { key: "blogs", Model: Blog },
];

// The data files are ES modules, so load them with import()
const loadStaticContent = async () => {
  const content = {};

  for (const { key } of SOURCES) {
    const file = pathToFileURL(path.join(DATA_DIR, `${key}.js`)).href;
    content[key] = (await import(file))[key];
  }

  return content;
};

const seedContent = async () => {
  const content = await loadStaticContent();
  const summary = {};

  for (const { key, Model } of SOURCES) {
    // Build the unique slug index before writing, so duplicates can't slip in
    await Model.init();

    const result = await Model.bulkWrite(
      content[key].map((item, order) => ({
        updateOne: {
          filter: { slug: item.slug },
          update: {
            $set: { ...item, order },
            // Only new items are published; a later unpublish isn't undone by re-seeding
            $setOnInsert: { published: true },
          },
          upsert: true,
        },
      }))
    );

    summary[key] = {
      total: content[key].length,
      created: result.upsertedCount,
      existing: result.matchedCount,
    };
  }

  return summary;
};

module.exports = { seedContent, loadStaticContent };

if (require.main === module) {
  (async () => {
    await connectDB();

    const { host, name } = mongoose.connection;
    console.log(`Seeding content into ${host}/${name}`);

    console.table(await seedContent());

    await mongoose.disconnect();
  })().catch(async (error) => {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
}
