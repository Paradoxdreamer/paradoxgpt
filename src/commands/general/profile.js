const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const FILE = path.join(config.dataDir, "profiles.json");

async function loadProfiles() {
  await fs.ensureFile(FILE);
  return fs.readJson(FILE).catch(() => ({}));
}

module.exports = {
  name: "profile",
  category: "general",
  description: "View your ParadoxGPT profile",
  async execute({ m }) {
    const profiles = await loadProfiles();
    const target = m.mentionedJid?.[0] || m.sender;
    const id = target;
    const p = profiles[id] || {
      xp: 0,
      level: 1,
      roastsReceived: 0,
      commandsUsed: 0,
      firstSeen: new Date().toISOString(),
    };

    if (!profiles[id]) {
      profiles[id] = p;
      await fs.writeJson(FILE, profiles, { spaces: 2 });
    }

    const name = id.split("@")[0];
    const text =
      `*Profile — @${name}*\n\n` +
      `Level: ${p.level}\n` +
      `XP: ${p.xp}\n` +
      `Roasts taken: ${p.roastsReceived || 0}\n` +
      `Commands used: ${p.commandsUsed || 0}\n` +
      `First seen: ${p.firstSeen ? new Date(p.firstSeen).toLocaleDateString() : "—"}`;

    await m.reply(text, { mentions: [id] });
  },
};

module.exports.bumpStat = async (jid, key, amount = 1) => {
  const profiles = await loadProfiles();
  if (!profiles[jid]) {
    profiles[jid] = {
      xp: 0,
      level: 1,
      roastsReceived: 0,
      commandsUsed: 0,
      firstSeen: new Date().toISOString(),
    };
  }
  profiles[jid][key] = (profiles[jid][key] || 0) + amount;
  profiles[jid].level = Math.floor((profiles[jid].xp || 0) / 100) + 1;
  await fs.writeJson(FILE, profiles, { spaces: 2 });
};
