const engine = require("../../lib/songEngine");

module.exports = {
  name: "history",
  category: "media",
  description: "Your recent plays / taste profile",
  async execute({ m }) {
    const userId = m.sender.replace("@s.whatsapp.net", "");
    const profile = engine.getProfile(userId);
    if (!profile.plays.length) {
      return m.reply(`_No plays yet. Use .play to start building your taste profile._`);
    }
    const topGenres = Object.entries(profile.genreFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([g]) => g)
      .join(", ");
    const topArtists = Object.entries(profile.artistFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([a]) => a)
      .join(", ");
    let msg = `🎧 *Your Recent Plays*\n\n`;
    for (const p of profile.plays.slice(0, 10)) {
      const ago = Math.round((Date.now() - p.ts) / 60000);
      msg += `▸ *${p.name}* — ${p.artist} _(${ago < 60 ? ago + "m" : Math.round(ago / 60) + "h"} ago)_\n`;
    }
    msg += `\n📊 *Top Artists:* ${topArtists || "—"}\n`;
    msg += `🎼 *Top Genres:* ${topGenres || "—"}`;
    await m.reply(msg);
  },
};
