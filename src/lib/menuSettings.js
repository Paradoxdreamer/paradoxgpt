const fs = require("fs-extra");
const path = require("path");
const config = require("../config");

const SETTINGS_FILE = path.join(config.dataDir, "menuSettings.json");
const CATEGORY_IMAGES_FILE = path.join(config.dataDir, "categoryImages.json");

const DEFAULTS = {
  botName: config.botName || "ParadoxGPT",
  bio: "Crafted from silence and sunless skies.",
  handles: {
    whatsapp: "",
    telegram: "",
    github: "https://github.com/Paradoxdreamer/paradoxgpt",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
  },
  channel: {
    name: "ParadoxGPT Channel",
    url: "",
    id: "",
  },
  botPicUrl: "https://files.catbox.moe/vx6rwh.jpg",
  footer:
    "Crafted from silence and sunless skies\nAsk me anything, command me everything\nbut Beware… even dreams can bite",
  ownerName: "Paradox Dreamer",
  version: "2.0.0",
};

async function loadSettings() {
  await fs.ensureDir(config.dataDir);
  if (!(await fs.pathExists(SETTINGS_FILE))) {
    await fs.writeJson(SETTINGS_FILE, DEFAULTS, { spaces: 2 });
    return { ...DEFAULTS };
  }
  const data = await fs.readJson(SETTINGS_FILE).catch(() => ({}));
  return {
    ...DEFAULTS,
    ...data,
    handles: { ...DEFAULTS.handles, ...(data.handles || {}) },
    channel: { ...DEFAULTS.channel, ...(data.channel || {}) },
  };
}

async function saveSettings(partial) {
  const current = await loadSettings();
  const next = {
    ...current,
    ...partial,
    handles: { ...current.handles, ...(partial.handles || {}) },
    channel: { ...current.channel, ...(partial.channel || {}) },
  };
  await fs.writeJson(SETTINGS_FILE, next, { spaces: 2 });
  return next;
}

async function loadCategoryImages() {
  await fs.ensureDir(config.dataDir);
  if (!(await fs.pathExists(CATEGORY_IMAGES_FILE))) {
    await fs.writeJson(CATEGORY_IMAGES_FILE, {}, { spaces: 2 });
    return {};
  }
  return fs.readJson(CATEGORY_IMAGES_FILE).catch(() => ({}));
}

async function saveCategoryImages(map) {
  await fs.writeJson(CATEGORY_IMAGES_FILE, map, { spaces: 2 });
  return map;
}

function gothicFooter(settings) {
  const lines = (settings.footer || DEFAULTS.footer)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const width = 36;
  const pad = (s) => {
    const t = s.slice(0, width);
    return t + " ".repeat(Math.max(0, width - t.length));
  };
  let box = `╔${"═".repeat(width + 2)}╗\n`;
  for (const line of lines) {
    box += `║ ${pad(line)} ║\n`;
  }
  box += `╚${"═".repeat(width + 2)}╝`;
  return box;
}

function handlesBlock(settings) {
  const h = settings.handles || {};
  const rows = [];
  if (h.whatsapp) rows.push(`WA: ${h.whatsapp}`);
  if (h.telegram) rows.push(`TG: ${h.telegram}`);
  if (h.github) rows.push(`GH: ${h.github}`);
  if (h.instagram) rows.push(`IG: ${h.instagram}`);
  if (h.twitter) rows.push(`X: ${h.twitter}`);
  if (h.youtube) rows.push(`YT: ${h.youtube}`);
  if (h.tiktok) rows.push(`TT: ${h.tiktok}`);
  return rows.length ? rows.join("\n") : "";
}

module.exports = {
  loadSettings,
  saveSettings,
  loadCategoryImages,
  saveCategoryImages,
  gothicFooter,
  handlesBlock,
  DEFAULTS,
  SETTINGS_FILE,
  CATEGORY_IMAGES_FILE,
};
