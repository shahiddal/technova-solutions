const mongoose = require("mongoose");

// Article body block: { type: "p" | "h2", text } or { type: "list", items }
const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["p", "h2", "list"],
      required: true,
    },

    text: String,

    // No default, so paragraphs don't get an empty items array
    items: {
      type: [String],
      default: undefined,
    },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    icon: String,
    category: String,
    author: String,

    // Display date as shown on the site, e.g. "October 20, 2026"
    date: String,

    summary: String,
    tags: [String],
    content: [contentBlockSchema],

    // Position in lists (lowest first)
    order: {
      type: Number,
      default: 0,
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ published: 1, order: 1 });

module.exports = mongoose.model("Blog", blogSchema);
