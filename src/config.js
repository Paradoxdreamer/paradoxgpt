require("dotenv").config();
const path = require("path");

const config = {
  botName: process.env.BOT_NAME || "ParadoxGPT",
  ownerNumber: (process.env.OWNER_NUMBER || "").replace(/\D/g, ""),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  omegaPrimaryUrl:
    process.env.OMEGA_PRIMARY_URL ||
    "https://omegatech-api.dixonomega.tech/api/ai/Qwen-Claude-Haiku",
  omegaFallbackUrl:
    process.env.OMEGA_FALLBACK_URL ||
    "https://omegatech-api.dixonomega.tech/api/ai/Gpt-4-mini",
  prefix: process.env.COMMAND_PREFIX || ".",
  webPort: parseInt(process.env.WEB_PORT || "3000", 10),
  webHost: process.env.WEB_HOST || "0.0.0.0",
  sessionDir: path.resolve(process.env.SESSION_DIR || "./data/session"),
  dataDir: path.resolve("./data"),
  cooldownMs: 2500,
  spamLimit: 6,
  banDurationMs: 60 * 60 * 1000,
  omdbApiKey: process.env.OMDB_API_KEY || "4a3b711b",
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || "",
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  },
  aiApiUrl:
    process.env.AI_API_URL ||
    process.env.OMEGA_PRIMARY_URL ||
    "https://omegatech-api.dixonomega.tech",
};

module.exports = config;
