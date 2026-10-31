// Starts server.js on a free port for API tests, against the given MongoDB URI
const net = require("node:net");
const path = require("node:path");
const { spawn } = require("node:child_process");

const freePort = () =>
  new Promise((resolve) => {
    const probe = net.createServer().listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });

const startServer = async ({ mongoUri, env = {}, nodeArgs = [] }) => {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, [...nodeArgs, "server.js"], {
    cwd: path.join(__dirname, "../.."),
    env: { ...process.env, RESEND_API_KEY: "", ...env, PORT: String(port), MONGO_URI: mongoUri },
    stdio: ["ignore", "pipe", "pipe"],
  });

  // Keep everything the server logs, so tests can check nothing secret is printed
  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));

  // Wait until the API answers from the database
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      if ((await fetch(`${baseUrl}/api/services`)).ok) {
        return { baseUrl, stop: () => child.kill(), output: () => output };
      }
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  child.kill();
  throw new Error("API did not start");
};

module.exports = { startServer };
