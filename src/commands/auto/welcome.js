const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const FILE = path.join(config.dataDir, "welcome.json");

async function load() {
  await fs.ensureFile(FILE);
  return fs.readJson(FILE).catch(() => ({ enabled: {}, messages: {} }));
}

async function save(data) {
  await fs.writeJson(FILE, data, { spaces: 2 });
}

module.exports = {
  name: "welcome",
  description: "Toggle welcome messages (on/off)",
  groupOnly: true,
  async execute({ m, args }) {
    const data = await load();
    const sub = (args[0] || "").toLowerCase();
    if (sub === "on") {
      data.enabled[m.chat] = true;
      await save(data);
      return m.reply("Welcome messages *enabled* for this group.");
    }
    if (sub === "off") {
      data.enabled[m.chat] = false;
      await save(data);
      return m.reply("Welcome messages *disabled*.");
    }
    return m.reply("Usage: .welcome on | .welcome off");
  },
};

module.exports.loadWelcome = load;
module.exports.saveWelcome = save;
