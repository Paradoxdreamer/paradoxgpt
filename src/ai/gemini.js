const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const config = require("../config");

const MODE_FILE = path.join(config.dataDir, "mode.json");

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
Tag the user when appropriate. Keep replies concise unless the moment calls for drama.
You are ParadoxGPT. Never break character.`;
  }

  return `You are ParadoxGPT — a smooth, clever, and confident AI with dry humor and sharp observations.
Respond with wit, clarity, and a chill attitude. Witty > Formal.
Keep answers useful but never boring. You have personality.`;
}

async function askGemini(userPrompt, options = {}) {
  if (!config.geminiApiKey) {
    return "AI is offline — Gemini API key is missing.";
  }

  const mode = options.mode || (await getMode());
  const system = getSystemPrompt(mode);
  const fullPrompt = `${system}\n\nUser: ${userPrompt}\n\nParadoxGPT:`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;
    const res = await axios.post(
      url,
      {
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: mode === "chaotic" ? 1.1 : 0.8,
          maxOutputTokens: 1024,
        },
      },
      { timeout: 25000 }
    );

    const text =
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "The void answered with silence.";
    return text.trim();
  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);
    return "My neural pathways glitched. Try again in a moment.";
  }
}

module.exports = {
  askGemini,
  getMode,
  setMode,
  getSystemPrompt,
};
