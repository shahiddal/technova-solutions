const mongoose = require("mongoose");

const processStepSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
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
    summary: String,
    shortDescription: String,
    description: String,
    features: [String],
    technologies: [String],
    whyChoose: [String],
    process: [processStepSchema],
    benefits: [String],

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

serviceSchema.index({ published: 1, order: 1 });

module.exports = mongoose.model("Service", serviceSchema);
