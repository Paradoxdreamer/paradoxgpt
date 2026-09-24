const settings = require("../../lib/botSettings");

module.exports = {
  name: "botmode",
  aliases: ["visibility", "privatemode", "publicmode", "automode"],
  category: "owner",
  description: "Public/private visibility + auto (style mimic) mode",
  ownerOnly: true,
  async execute({ m, args }) {
    const sub = (args[0] || "").toLowerCase();
    const val = (args[1] || "").toLowerCase();

    if (!sub || sub === "status" || sub === "show") {
      const s = await settings.load();
      return m.reply(
        `⚙️ *Bot Mode*\n\n` +
          `Visibility: *${s.visibility}*\n` +
          `Auto (style mimic): *${s.autoMode ? "ON" : "OFF"}*\n` +
          `Style samples stored: *${s.styleSamples?.length || 0}*\n\n` +
          `*.botmode public* — everyone can use commands\n` +
          `*.botmode private* — owners only\n` +
          `*.botmode auto on|off* — talk like the owner\n` +
          `*.botmode clearstyle* — reset style samples`
      );
    }

    if (sub === "public") {
      await settings.save({ visibility: "public" });
      return m.reply("✅ Visibility set to *public* — everyone can use non-owner commands.");
    }

    if (sub === "private") {
      await settings.save({ visibility: "private" });
      return m.reply("🔒 Visibility set to *private* — only locked owners can use the bot.");
    }

    if (sub === "auto") {
      if (val !== "on" && val !== "off") {
        return m.reply("Usage: *.botmode auto on* or *.botmode auto off*");
      }
      await settings.save({ autoMode: val === "on" });
      return m.reply(
        val === "on"
          ? "🎭 *Auto mode ON* — free chat will mimic your speaking style.\n_Keep chatting normally so I can learn your voice._"
          : "🎭 *Auto mode OFF* — default ParadoxGPT personality."
      );
    }

    if (sub === "clearstyle") {
      await settings.save({ styleSamples: [] });
      return m.reply("Style samples cleared.");
    }

    return m.reply("Usage: *.botmode public|private|auto on|off|status|clearstyle*");
  },
};
