const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const FILE = path.join(config.dataDir, "settings.json");

async function loadSettings() {
  await fs.ensureFile(FILE);
  return fs.readJson(FILE).catch(() => ({ antilink: {} }));
}

module.exports = {
  name: "antilink",
  description: "Auto-delete links in group (on/off)",
  groupOnly: true,
  async execute({ m, args }) {
    const data = await loadSettings();
    data.antilink = data.antilink || {};
    const sub = (args[0] || "").toLowerCase();

    if (sub === "on") {
      data.antilink[m.chat] = true;
      await fs.writeJson(FILE, data, { spaces: 2 });
      return m.reply("Anti-link *enabled*. Links will be deleted.");
    }
    if (sub === "off") {
      data.antilink[m.chat] = false;
      await fs.writeJson(FILE, data, { spaces: 2 });
      return m.reply("Anti-link *disabled*.");
    }
    return m.reply("Usage: .antilink on | .antilink off");
  },
};

module.exports.isAntiLinkEnabled = async (chatId) => {
  const data = await loadSettings();
  return !!(data.antilink && data.antilink[chatId]);
};
