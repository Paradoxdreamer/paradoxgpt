const engine = require("../../lib/songEngine");

module.exports = {
  name: "play",
  category: "media",
  description: "Download full song audio — .play <name> | --ptt | --auto",
  async execute({ sock, m, args }) {
    const flags = args.filter((a) => a.startsWith("--"));
    const cleanArgs = args.filter((a) => !a.startsWith("--"));
    const ptt = flags.includes("--ptt");
    const autoDJ = flags.includes("--auto");
    const query = cleanArgs.join(" ").trim();
    const userId = m.sender.replace("@s.whatsapp.net", "");
    const userName = m.pushName || "Wanderer";

    if (autoDJ) {
      return engine.runAutoDJ(sock, m, userId, userName, ptt);
    }

    if (!query) {
      return m.reply(
        `🎵 *Play*\n\n` +
          `*.play <song>* — full audio\n` +
          `*.play <song> --ptt* — as voice note\n` +
          `*.play --auto* — AI DJ mix (needs 3+ plays)\n` +
          `*.song <song>* — info only\n` +
          `*.lyrics <song>* — lyrics\n` +
          `*.history* — your taste profile`
      );
    }

    if (engine.isSearchOnCooldown(userId)) {
      return m.reply(`_Easy. Wait ${engine.SEARCH_CD_MS / 1000}s between searches._`);
    }

    await m.reply("🔍 Finding track…");
    const resolved = await engine.resolveTrack(query);
    if (!resolved) return m.reply(`❌ Nothing for *"${query}"*`);

    const { track } = resolved;
    engine.recordPlay(userId, track);
    const video = await engine.resolveVideo(track);
    await engine.sendCard(sock, m, track, video, "play");
    await engine.sendAudioDownload(sock, m, track, video, userId, ptt);
  },
};
