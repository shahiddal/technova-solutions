const express = require("express");

const Service = require("../models/Service");
const Project = require("../models/Project");
const Blog = require("../models/Blog");
const {
  listPublished,
  getPublishedBySlug,
} = require("../controllers/contentController");

// Read-only: GET list (card fields only) and GET by slug (full document)
const contentRouter = (Model, cardFields, label) => {
  const router = express.Router();

  router.get("/", listPublished(Model, cardFields));
  router.get("/:slug", getPublishedBySlug(Model, label));

  return router;
};

module.exports = {
  serviceRoutes: contentRouter(Service, "slug icon title summary", "Service"),
  projectRoutes: contentRouter(
    Project,
    "slug service icon title category summary technologies",
    "Project"
  ),
  blogRoutes: contentRouter(
    Blog,
    "slug icon title category author date summary",
    "Article"
  ),
};
