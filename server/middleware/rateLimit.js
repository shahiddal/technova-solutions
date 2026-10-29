// Fixed-window rate limiter per client IP
// shortcut: in-memory, resets on restart and isn't shared across instances; switch to express-rate-limit + a shared store if scaled out
const createRateLimiter = ({ windowMs, max }) => {
  const hits = new Map();

  // Drop expired entries so the map doesn't grow forever
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (now - entry.start > windowMs) hits.delete(ip);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const entry = hits.get(req.ip);

    if (!entry || now - entry.start > windowMs) {
      hits.set(req.ip, { start: now, count: 1 });
      return next();
    }

    if (entry.count >= max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    entry.count++;
    next();
  };
};

module.exports = createRateLimiter;
