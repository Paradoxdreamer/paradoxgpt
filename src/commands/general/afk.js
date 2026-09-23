const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const FILE = path.join(config.dataDir, "afk.json");

async function load() {
  await fs.ensureFile(FILE);
  return fs.readJson(FILE).catch(() => ({}));
}

async function save(data) {
  await fs.writeJson(FILE, data, { spaces: 2 });
}

module.exports = {
  name: "afk",
  description: "Set AFK status with optional reason",
  async execute({ m, args }) {
    const reason = args.join(" ").trim() || "AFK";
    const data = await load();
    data[m.sender] = {
      reason,
      since: Date.now(),
      name: m.pushName || m.sender.split("@")[0],
    };
    await save(data);
    await m.reply(`You are now AFK: *${reason}*`);
  },
};

module.exports.loadAfk = load;
module.exports.saveAfk = save;
module.exports.checkAfkMention = async function checkAfkMention(sock, m) {
  try {
    const data = await load();
    const mentioned = m.mentionedJid || [];
    for (const jid of mentioned) {
      if (data[jid]) {
        const mins = Math.floor((Date.now() - data[jid].since) / 60000);
        await sock.sendMessage(m.chat, {
          text: `@${jid.split("@")[0]} is AFK: *${data[jid].reason}* (${mins}m)`,
          mentions: [jid],
        });
      }
    }
    if (data[m.sender]) {
      const was = data[m.sender];
      delete data[m.sender];
      await save(data);
      await sock.sendMessage(m.chat, {
        text: `Welcome back @${m.sender.split("@")[0]} (was AFK: ${was.reason})`,
        mentions: [m.sender],
      });
    }
  } catch {}
};
