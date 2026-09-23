const path = require("path");
const fs = require("fs-extra");
const config = require("../config");

const FILE = path.join(config.dataDir, "welcome.json");

module.exports = {
  name: "setwelcome",
  description: "Set custom welcome text (must include @user)",
  groupOnly: true,
  async execute({ m, args }) {
    const text = args.join(" ").trim();
    if (!text || !text.includes("@user")) {
      return m.reply("Message must include @user\nExample: .setwelcome Welcome @user to the chaos!");
    }

    const data = await fs.readJson(FILE).catch(() => ({ enabled: {}, messages: {} }));
    data.messages = data.messages || {};
    data.messages[m.chat] = text;
    await fs.writeJson(FILE, data, { spaces: 2 });
    await m.reply("✅ Custom welcome message saved.");
  },
};
