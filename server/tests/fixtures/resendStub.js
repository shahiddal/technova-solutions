// Test-only preload (node --require): answers Resend API calls locally and
// appends each one as a JSON line to RESEND_STUB_LOG, so tests can count emails.
const fs = require("node:fs");

const realFetch = globalThis.fetch;

globalThis.fetch = async (url, options) => {
  if (!String(url).startsWith("https://api.resend.com")) return realFetch(url, options);

  fs.appendFileSync(
    process.env.RESEND_STUB_LOG,
    JSON.stringify({ headers: options.headers, body: JSON.parse(options.body) }) + "\n"
  );

  return new Response(JSON.stringify({ id: "stub-email" }), { status: 200 });
};
