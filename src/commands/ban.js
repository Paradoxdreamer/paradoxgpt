const fs = require("fs-extra");
const path = require("path");
const config = require("../config");

const BAN_FILE = path.join(config.dataDir, "banList.json");

async function loadBans() {
  await fs.ensureFile(BAN_FILE);
  return fs.readJson(BAN_FILE).catch(() => ({ banned: [] }));
}

async function saveBans(data) {
  await fs.writeJson(BAN_FILE, data, { spaces: 2 });
}

module.exports = {
  name: "ban",
  description: "Ban a user from using the bot (owner only)",
  ownerOnly: true,
  async execute({ m }) {
    const target = m.mentionedJid?.[0];
    if (!target) return m.reply("Tag the user to ban.");

    const data = await loadBans();
    if (data.banned.includes(target)) {
      return m.reply("Already banned.");
    }

    data.banned.push(target);
    await saveBans(data);
    await m.reply(`@${target.split("@")[0]} has been exiled.`, {
      mentions: [target],
    });
  },
};

module.exports.loadBans = loadBans;
