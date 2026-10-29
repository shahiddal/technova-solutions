const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
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

    // Slug of the service preselected when someone enquires from this project
    service: String,

    icon: String,
    category: String,
    summary: String,
    description: String,
    technologies: [String],
    features: [String],
    development: [String],
    challenges: [String],
    solutions: [String],
    results: [String],

    // Optional: the Live Demo / GitHub buttons only show when set
    liveUrl: String,
    githubUrl: String,

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

projectSchema.index({ published: 1, order: 1 });

module.exports = mongoose.model("Project", projectSchema);
