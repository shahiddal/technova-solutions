// Public, read-only handlers shared by services, projects and blogs.
// Express 5 forwards thrown errors to the central JSON error handler.

// Internal fields never sent to the public site
const HIDDEN_FIELDS = "-_id -__v -published -order -createdAt -updatedAt";

const SLUG_REGEX = /^[a-z0-9-]{1,100}$/;

const listPublished = (Model, cardFields) => async (req, res) => {
  const items = await Model.find({ published: true })
    .sort({ order: 1, slug: 1 })
    .select(`${cardFields} -_id`)
    .lean();

  res.json({ success: true, data: items });
};

const getPublishedBySlug = (Model, label) => async (req, res) => {
  const { slug } = req.params;

  const item = SLUG_REGEX.test(slug)
    ? await Model.findOne({ slug, published: true }).select(HIDDEN_FIELDS).lean()
    : null;

  if (!item) {
    return res.status(404).json({
      success: false,
      message: `${label} not found`,
    });
  }

  res.json({ success: true, data: item });
};

module.exports = {
  listPublished,
  getPublishedBySlug,
};
