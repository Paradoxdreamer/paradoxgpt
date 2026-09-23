const path = require("path");
const fs = require("fs-extra");
const config = require("../../config");

const FILE = path.join(config.dataDir, "leave.json");

module.exports = {
  name: "setleave",
  description: "Set custom leave message",
  groupOnly: true,
  async execute({ m, args }) {
    const text = args.join(" ").trim();
    if (!text) return m.reply("Usage: .setleave Goodbye @user");
    const data = await fs.readJson(FILE).catch(() => ({ enabled: {}, messages: {} }));
    data.messages = data.messages || {};
    data.messages[m.chat] = text;
    await fs.writeJson(FILE, data, { spaces: 2 });
    await m.reply("Leave message saved.");
  },
};
