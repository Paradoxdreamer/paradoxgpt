const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const FILE = path.join(config.dataDir, "channels.json");

async function load() {
  await fs.ensureFile(FILE);
  return fs.readJson(FILE).catch(() => ({
    channels: {},
    defaultChannel: null,
  }));
}

async function save(data) {
  await fs.writeJson(FILE, data, { spaces: 2 });
}

module.exports = {
  name: "channel",
  category: "auto",
  description: "Post to / manage announcement channel (owner)",
  ownerOnly: true,
  async execute({ sock, m, args }) {
    const sub = (args[0] || "").toLowerCase();
    const rest = args.slice(1).join(" ").trim();
    const data = await load();

    if (sub === "list") {
      const entries = Object.entries(data.channels || {});
      if (!entries.length) return m.reply("No channels saved. Use .channel add <jid>");
      const lines = entries.map(
        ([jid, c]) =>
          `• ${c.name || jid}\n  ${jid}\n  autopost: ${c.autoPost ? "on" : "off"}`
      );
      return m.reply(
        `*Saved channels*\nDefault: ${data.defaultChannel || "none"}\n\n${lines.join("\n\n")}`
      );
    }

    if (sub === "add" || sub === "set") {
      let jid = rest.replace(/\s/g, "");
      if (!jid && m.chat && m.chat.endsWith("@g.us")) jid = m.chat;
      if (!jid) {
        return m.reply(
          "Usage: .channel set <group-or-channel-jid>\nOr run inside a group: .channel set"
        );
      }
      if (!jid.includes("@")) jid = jid + "@g.us";

      data.channels[jid] = data.channels[jid] || {
        name: jid.split("@")[0],
        autoPost: false,
        lastPost: 0,
      };
      data.defaultChannel = jid;
      await save(data);
      return m.reply("Default channel set:\n" + jid);
    }

    if (sub === "autopost") {
      const mode = (args[1] || "").toLowerCase();
      const jid = data.defaultChannel;
      if (!jid) return m.reply("Set a default channel first: .channel set <jid>");
      if (mode !== "on" && mode !== "off") {
        return m.reply("Usage: .channel autopost on|off");
      }
      data.channels[jid] = data.channels[jid] || {};
      data.channels[jid].autoPost = mode === "on";
      await save(data);
      return m.reply("Auto-post for default channel is now *" + mode + "*.");
    }

    if (sub === "post") {
      const text = rest;
      if (!text) return m.reply("Usage: .channel post <message>");
      const jid = data.defaultChannel;
      if (!jid) return m.reply("No default channel. Use .channel set <jid> first.");

      try {
        await sock.sendMessage(jid, {
          text: "*Channel Post*\n\n" + text + "\n\n_— " + config.botName + "_",
        });
        if (data.channels[jid]) {
          data.channels[jid].lastPost = Date.now();
          await save(data);
        }
        return m.reply("Posted to channel.");
      } catch (err) {
        return m.reply("Failed to post: " + err.message);
      }
    }

    return m.reply(
      "*Channel commands*\n" +
        ".channel set [jid] — set default channel\n" +
        ".channel add <jid> — save channel\n" +
        ".channel post <msg> — post once\n" +
        ".channel autopost on|off\n" +
        ".channel list"
    );
  },
};

module.exports.loadChannels = load;
module.exports.saveChannels = save;
