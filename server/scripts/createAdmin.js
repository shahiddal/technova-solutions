// Creates the single admin account, or resets its password (which also signs out
// every existing session). Interactive only: asks you to confirm the target database,
// then asks for the password twice without echoing it.
//
//   npm run create-admin         (uses MONGO_URI from server/.env; ADMIN_EMAIL optional)

require("dotenv").config();

const readline = require("node:readline");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const BCRYPT_ROUNDS = 12;
const PASSWORD_MIN = 12;
const BCRYPT_MAX_BYTES = 72; // bcrypt ignores anything longer

const upsertAdmin = async (rawEmail, password) => {
  const email = String(rawEmail || "").trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  if (password.length < PASSWORD_MIN || Buffer.byteLength(password) > BCRYPT_MAX_BYTES) {
    throw new Error(`Password must be at least ${PASSWORD_MIN} characters and at most ${BCRYPT_MAX_BYTES} bytes`);
  }

  // Single-admin setup: never add a second account
  const other = await Admin.exists({ email: { $ne: email } });
  if (other) {
    throw new Error("A different admin account already exists; reset that one instead");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const existed = Boolean(await Admin.exists({ email }));

  await Admin.updateOne(
    { email },
    { $set: { passwordHash, active: true }, $inc: { sessionVersion: 1 } },
    { upsert: true }
  );

  return { email, created: !existed };
};

module.exports = { upsertAdmin };

const ask = (rl, question) => new Promise((resolve) => rl.question(question, resolve));

const askHidden = (rl, question) =>
  new Promise((resolve) => {
    rl.muted = false;
    rl.question(question, (answer) => {
      rl.muted = false;
      rl.output.write("\n");
      resolve(answer);
    });
    rl.muted = true;
  });

if (require.main === module) {
  (async () => {
    if (!process.stdin.isTTY) throw new Error("Run this in an interactive terminal");

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    // Hide typed characters while rl.muted is set (password prompts)
    rl._writeToOutput = (text) => {
      if (!rl.muted) rl.output.write(text);
    };

    try {
      await connectDB();
      const { host, name } = mongoose.connection;
      console.log(`Target database: ${host}/${name}`);

      if ((await ask(rl, "Type the database name to confirm: ")).trim() !== name) {
        throw new Error("Database name did not match; nothing was changed");
      }

      const email = process.env.ADMIN_EMAIL || (await ask(rl, "Admin email: "));
      const password = await askHidden(rl, "Password: ");

      if ((await askHidden(rl, "Repeat password: ")) !== password) {
        throw new Error("Passwords did not match; nothing was changed");
      }

      const result = await upsertAdmin(email, password);
      console.log(`${result.created ? "Created" : "Updated"} admin ${result.email}`);
    } finally {
      rl.close();
      await mongoose.disconnect();
    }
  })().catch((error) => {
    console.error("create-admin failed:", error.message);
    process.exit(1);
  });
}
