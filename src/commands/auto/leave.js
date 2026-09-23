const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const FILE = path.join(config.dataDir, "leave.json");

async function load() {
  await fs.ensureFile(FILE);
  return fs.readJson(FILE).catch(() => ({ enabled: {}, messages: {} }));
}

async function save(data) {
  await fs.writeJson(FILE, data, { spaces: 2 });
}

module.exports = {
  name: "leave",
  description: "Toggle leave messages (on/off)",
  groupOnly: true,
  async execute({ m, args }) {
    const data = await load();
    const sub = (args[0] || "").toLowerCase();
    if (sub === "on") {
      data.enabled[m.chat] = true;
      await save(data);
      return m.reply("Leave messages *enabled*.");
    }
    if (sub === "off") {
      data.enabled[m.chat] = false;
      await save(data);
      return m.reply("Leave messages *disabled*.");
    }
    return m.reply("Usage: .leave on | .leave off");
  },
};

module.exports.loadLeave = load;
module.exports.saveLeave = save;
