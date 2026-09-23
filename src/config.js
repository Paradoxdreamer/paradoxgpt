require("dotenv").config();
const path = require("path");

const config = {
  botName: process.env.BOT_NAME || "ParadoxGPT",
  ownerNumber: (process.env.OWNER_NUMBER || "").replace(/\D/g, ""),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  prefix: process.env.COMMAND_PREFIX || ".",
  webPort: parseInt(process.env.WEB_PORT || "3000", 10),
  webHost: process.env.WEB_HOST || "0.0.0.0",
  sessionDir: path.resolve(process.env.SESSION_DIR || "./data/session"),
  dataDir: path.resolve("./data"),
  cooldownMs: 2500,
  spamLimit: 6,
  banDurationMs: 60 * 60 * 1000,
};

if (!config.geminiApiKey) {
  console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
}

module.exports = config;
