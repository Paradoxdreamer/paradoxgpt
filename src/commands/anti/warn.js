const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const WARN_FILE = path.join(config.dataDir, "warns.json");
const BAN_FILE = path.join(config.dataDir, "banList.json");

module.exports = {
  name: "warn",
  description: "Warn a user (3 warns = ban)",
  groupOnly: true,
  async execute({ m, args }) {
    const target = m.mentionedJid?.[0];
    if (!target) return m.reply("Tag the user to warn.");

    const reason = args.slice(1).join(" ") || "No reason given";
    const warns = await fs.readJson(WARN_FILE).catch(() => ({}));

    warns[target] = (warns[target] || 0) + 1;
    await fs.writeJson(WARN_FILE, warns, { spaces: 2 });

    if (warns[target] >= 3) {
      const banList = await fs.readJson(BAN_FILE).catch(() => ({ banned: [] }));
      if (!banList.banned.includes(target)) {
        banList.banned.push(target);
        await fs.writeJson(BAN_FILE, banList, { spaces: 2 });
      }
      warns[target] = 0;
      await fs.writeJson(WARN_FILE, warns, { spaces: 2 });

      return m.reply(
        `@${target.split("@")[0]} reached 3 warnings and has been *banned*.`,
        { mentions: [target] }
      );
    }

    await m.reply(
      `Warned @${target.split("@")[0]} (${warns[target]}/3)\nReason: ${reason}`,
      { mentions: [target] }
    );
  },
};
