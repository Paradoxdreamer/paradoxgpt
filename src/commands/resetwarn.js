const fs = require("fs-extra");
const path = require("path");
const config = require("../config");

const WARN_FILE = path.join(config.dataDir, "warns.json");

module.exports = {
  name: "resetwarn",
  description: "Reset warnings for a user (owner)",
  ownerOnly: true,
  async execute({ m }) {
    const target = m.mentionedJid?.[0];
    if (!target) return m.reply("Tag the user to reset.");

    const warns = await fs.readJson(WARN_FILE).catch(() => ({}));
    warns[target] = 0;
    await fs.writeJson(WARN_FILE, warns, { spaces: 2 });
    await m.reply(`Warnings reset for @${target.split("@")[0]}.`, {
      mentions: [target],
    });
  },
};
