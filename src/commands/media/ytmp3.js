const axios = require("axios");

module.exports = {
  name: "ytmp3",
  category: "media",
  description: "Download YouTube as MP3",
  async execute({ sock, m, args }) {
    const url = args[0];
    if (!url || !/youtu/i.test(url)) {
      return m.reply("Usage: `.ytmp3 https://youtube.com/watch?v=...`");
    }
    await m.reply("Fetching MP3…");
    try {
      const { data } = await axios.get("https://api.siputzx.my.id/api/d/ytmp3", {
        params: { url },
        timeout: 60000,
        validateStatus: () => true,
      });
      const r = data?.data || data?.result || data;
      const audioUrl = r?.url || r?.download || r?.dl;
      if (!audioUrl) return m.reply("No audio link returned.");
      await sock.sendMessage(
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${(r.title || "audio").slice(0, 60)}.mp3`,
        },
        { quoted: m.raw }
      );
    } catch (e) {
      await m.reply("ytmp3 failed: " + e.message);
    }
  },
};
