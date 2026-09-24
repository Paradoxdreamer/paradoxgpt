const engine = require("../../lib/songEngine");

module.exports = {
  name: "song",
  category: "media",
  description: "Song info card — Spotify/iTunes metadata + art",
  async execute({ sock, m, args }) {
    const query = args.join(" ").trim();
    const userId = m.sender.replace("@s.whatsapp.net", "");

    if (!query) {
      return m.reply(
        `🎵 *ParadoxGPT Music*\n\n` +
          `*.song <name>* — info card\n` +
          `*.play <name>* — full audio\n` +
          `*.play <name> --ptt* — voice note\n` +
          `*.lyrics <name>* — lyrics\n` +
          `*.queue* — download queue\n` +
          `*.history* — your recent plays\n\n` +
          `_Some songs find you. Others need a push._`
      );
    }

    if (engine.isSearchOnCooldown(userId)) {
      return m.reply(`_Easy. Wait ${engine.SEARCH_CD_MS / 1000}s between searches._`);
    }

    await m.reply("🔍 Searching…");
    const resolved = await engine.resolveTrack(query);
    if (!resolved) return m.reply(`❌ Nothing surfaced for *"${query}"*\n_Try adding the artist name._`);

    const { track, allRanked, confident } = resolved;
    if (!confident && allRanked?.length > 1) {
      const top = allRanked.slice(0, 3);
      const list = top.map((r, i) => `${i + 1}. *${r.track.name}* — ${r.track.artist}`).join("\n");
      await m.reply(`🎵 *Multiple matches for "${query}"*\n\n${list}\n\n_Reply with *.song <exact title>*_`);
    }

    engine.recordPlay(userId, track);
    const video = await engine.resolveVideo(track);
    await engine.sendCard(sock, m, track, video, "song");
  },
};
