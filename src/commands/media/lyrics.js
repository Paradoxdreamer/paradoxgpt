const engine = require("../../lib/songEngine");

module.exports = {
  name: "lyrics",
  category: "media",
  description: "Fetch song lyrics",
  async execute({ m, args }) {
    const query = args.join(" ").trim();
    const userId = m.sender.replace("@s.whatsapp.net", "");
    if (!query) return m.reply("📜 Usage: *.lyrics Blinding Lights*");
    if (engine.isSearchOnCooldown(userId)) return m.reply(`_Wait ${engine.SEARCH_CD_MS / 1000}s._`);

    await m.reply("🔍 Looking up lyrics…");
    const resolved = await engine.resolveTrack(query);
    if (!resolved) return m.reply(`❌ Couldn't find *"${query}"*`);
    const { track } = resolved;
    const lyrics = await engine.fetchLyrics(track.artist.split(",")[0].trim(), track.name);
    if (!lyrics) return m.reply(`❌ No lyrics for *${track.name}*`);
    const trimmed = lyrics.length > 3000 ? lyrics.slice(0, 3000) + "\n\n_[trimmed]_" : lyrics;
    await m.reply(`📜 *${track.name}* — ${track.artist}\n\n${trimmed}`);
  },
};
