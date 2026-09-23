const path = require("path");
const fs = require("fs-extra");
const config = require("../config");

const BAN_FILE = path.join(config.dataDir, "banList.json");

module.exports = {
  name: "unban",
  description: "Unban a user (owner only)",
  ownerOnly: true,
  async execute({ m }) {
    const target = m.mentionedJid?.[0];
    if (!target) return m.reply("Tag the user to unban.");

    const data = await fs.readJson(BAN_FILE).catch(() => ({ banned: [] }));
    if (!data.banned.includes(target)) {
      return m.reply("That user is not banned.");
    }

    data.banned = data.banned.filter((j) => j !== target);
    await fs.writeJson(BAN_FILE, data, { spaces: 2 });
    await m.reply(`@${target.split("@")[0]} has been forgiven.`, {
      mentions: [target],
    });
  },
};
