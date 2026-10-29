// Helpers for content loaded from the API

// The next `count` items after the current one, wrapping around the list
export const getRelated = (items, slug, count = 3) => {
  const index = items.findIndex((item) => item.slug === slug);

  return Array.from(
    { length: Math.min(count, items.length - 1) },
    (_, offset) => items[(index + offset + 1) % items.length]
  );
};

// Reading time at ~200 words per minute
export const getReadingTime = (blog) => {
  const words = blog.content
    .flatMap((block) => block.items || [block.text])
    .join(" ")
    .split(/\s+/).length;

  return `${Math.max(1, Math.round(words / 200))} min read`;
};
