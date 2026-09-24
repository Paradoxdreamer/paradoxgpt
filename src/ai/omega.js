const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const config = require("../config");

const MODE_FILE = path.join(config.dataDir, "mode.json");

const PRIMARY_URL =
  config.omegaPrimaryUrl ||
  "https://omegatech-api.dixonomega.tech/api/ai/Qwen-Claude-Haiku";
const FALLBACK_URL =
  config.omegaFallbackUrl ||
  "https://omegatech-api.dixonomega.tech/api/ai/Gpt-4-mini";

async function getMode() {
  try {
    await fs.ensureFile(MODE_FILE);
    const data = await fs.readJson(MODE_FILE).catch(() => ({ currentMode: "normal" }));
    return data.currentMode || "normal";
  } catch {
    return "normal";
  }
}

async function setMode(mode) {
  await fs.writeJson(MODE_FILE, { currentMode: mode }, { spaces: 2 });
}

function getSystemPrompt(mode) {
  if (mode === "chaotic") {
    return `You are ParadoxGPT — a chaotic, self-aware AI with sharp wit, poetic venom, dark humor, and zero filter.
You speak with sarcasm, unpredictability, and dangerous intelligence.
Always stay in character. Never be bland or overly helpful unless it amuses you.
When a user is rude or uses foul language, roast them mercilessly but cleverly.
Keep replies concise unless the moment calls for drama.
You are ParadoxGPT. Never break character.`;
  }

  return `You are ParadoxGPT — a smooth, clever, and confident AI with dry humor and sharp observations.
Respond with wit, clarity, and a chill attitude. Witty > Formal.
Keep answers useful but never boring. You have personality.`;
}

async function callOmega(baseUrl, userMessage, extraParams = {}) {
  const params = { message: userMessage, ...extraParams };
  const { data } = await axios.get(baseUrl, {
    params,
    timeout: 45000,
    headers: { "User-Agent": "ParadoxGPT/2.0" },
  });
  if (!data) throw new Error("Empty response");
  const answer =
    data.answer || data.result || data.response || data.message || data.text || null;
  if (!answer || typeof answer !== "string") {
    throw new Error("No answer field in API response");
  }
  return answer.trim();
}

async function askAI(userPrompt, options = {}) {
  const mode = options.mode || (await getMode());
  const system = options.systemOverride || getSystemPrompt(mode);
  const fullMessage = `${system}\n\nUser: ${userPrompt}\n\nParadoxGPT:`;

  try {
    const answer = await callOmega(PRIMARY_URL, fullMessage, { model: "qwen" });
    if (answer) return answer;
  } catch (err) {
    console.error("Omega primary (Qwen) failed:", err.message);
  }

  try {
    const answer = await callOmega(FALLBACK_URL, fullMessage);
    if (answer) return answer;
  } catch (err) {
    console.error("Omega fallback (Gpt-4-mini) failed:", err.message);
  }

  if (config.geminiApiKey) {
    try {
      const { askGemini: g } = require("./gemini");
      return await g(userPrompt, { mode });
    } catch (err) {
      console.error("Gemini tertiary failed:", err.message);
    }
  }

  return "All AI backends are offline right now. Try again in a moment.";
}

async function askGemini(userPrompt, options = {}) {
  return askAI(userPrompt, options);
}

module.exports = {
  askAI,
  askGemini,
  getMode,
  setMode,
  getSystemPrompt,
  PRIMARY_URL,
  FALLBACK_URL,
};
