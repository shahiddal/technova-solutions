// Content lookups. Swap these for API calls when the content moves to the backend.

export const findBySlug = (items, slug) =>
  items.find((item) => item.slug === slug);

// The next `count` items after the current one, wrapping around the list
export const getRelated = (items, slug, count = 3) => {
  const index = items.findIndex((item) => item.slug === slug);

  return Array.from(
    { length: Math.min(count, items.length - 1) },
    (_, offset) => items[(index + offset + 1) % items.length]
  );
};
