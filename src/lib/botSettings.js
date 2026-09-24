"use strict";
const fs = require("fs-extra");
const path = require("path");
const config = require("../config");

const FILE = path.join(config.dataDir, "botSettings.json");

const DEFAULTS = {
  visibility: "public",
  autoMode: false,
  styleSamples: [],
  maxSamples: 40,
};

async function load() {
  try {
    await fs.ensureFile(FILE);
    const data = await fs.readJson(FILE).catch(() => ({}));
    return { ...DEFAULTS, ...data, styleSamples: data.styleSamples || [] };
  } catch {
    return { ...DEFAULTS };
  }
}

async function save(partial) {
  const cur = await load();
  const next = { ...cur, ...partial };
  if (next.styleSamples?.length > next.maxSamples) {
    next.styleSamples = next.styleSamples.slice(0, next.maxSamples);
  }
  await fs.writeJson(FILE, next, { spaces: 2 });
  return next;
}

function normalizeNum(jidOrNum) {
  return String(jidOrNum || "").replace(/\D/g, "");
}

function isOwner(jid) {
  const num = normalizeNum(jid);
  return config.lockedOwners.some(
    (o) => num === o || num.endsWith(o) || o.endsWith(num)
  );
}

function isPairedSelf(jid, sock) {
  const botNum = normalizeNum(sock?.user?.id || "");
  const num = normalizeNum(jid);
  return botNum && (num === botNum || num.endsWith(botNum) || botNum.endsWith(num));
}

async function canUseBot(jid, sock) {
  if (isOwner(jid)) return true;
  const settings = await load();
  if (settings.visibility === "private") return false;
  return true;
}

async function isAutoMode() {
  const s = await load();
  return !!s.autoMode;
}

async function pushStyleSample(text) {
  if (!text || text.length < 8 || text.startsWith(config.prefix)) return;
  const s = await load();
  const samples = [text.trim().slice(0, 280), ...(s.styleSamples || [])].slice(
    0,
    s.maxSamples || 40
  );
  await save({ styleSamples: samples });
}

async function getStylePrompt() {
  const s = await load();
  if (!s.autoMode || !s.styleSamples?.length) return null;
  const examples = s.styleSamples.slice(0, 12).map((t) => `- ${t}`).join("\n");
  return (
    `You are mimicking the exact speaking style of the bot's owner. ` +
    `Match their tone, slang, emoji use, length, and attitude as closely as possible. ` +
    `Do not sound formal or like a generic assistant.\n\n` +
    `Recent examples of how they talk:\n${examples}\n\n` +
    `Reply ONLY in that same voice.`
  );
}

module.exports = {
  load,
  save,
  isOwner,
  isPairedSelf,
  canUseBot,
  isAutoMode,
  pushStyleSample,
  getStylePrompt,
  DEFAULTS,
};
