// Failed admin login counter, per client IP and in total, in fixed 15-minute windows.
// The total cap keeps brute force slow even when attempts come from many IPs.
// shortcut: in-memory, resets on restart and isn't shared across instances; move to MongoDB/Redis if scaled out
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IP = 5;
const MAX_FAILURES_TOTAL = 20;
const TOTAL = Symbol("total");

const failures = new Map();

const countFor = (key, now) => {
  const entry = failures.get(key);
  return entry && now - entry.start <= WINDOW_MS ? entry.count : 0;
};

const isLoginBlocked = (ip) => {
  const now = Date.now();
  return (
    countFor(ip, now) >= MAX_FAILURES_PER_IP ||
    countFor(TOTAL, now) >= MAX_FAILURES_TOTAL
  );
};

const recordLoginFailure = (ip) => {
  const now = Date.now();

  for (const key of [ip, TOTAL]) {
    const entry = failures.get(key);

    if (!entry || now - entry.start > WINDOW_MS) {
      failures.set(key, { start: now, count: 1 });
    } else {
      entry.count++;
    }
  }
};

const clearLoginFailures = (ip) => {
  failures.delete(ip);
};

// Drop expired entries so the map doesn't grow forever
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of failures) {
    if (now - entry.start > WINDOW_MS) failures.delete(key);
  }
}, WINDOW_MS).unref();

module.exports = { isLoginBlocked, recordLoginFailure, clearLoginFailures };
