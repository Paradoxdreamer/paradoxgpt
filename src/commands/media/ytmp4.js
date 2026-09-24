const axios = require("axios");

module.exports = {
  name: "ytmp4",
  category: "media",
  description: "Download YouTube as MP4 video",
  async execute({ sock, m, args }) {
    const url = args[0];
    if (!url || !/youtu/i.test(url)) {
      return m.reply("Usage: `.ytmp4 https://youtube.com/watch?v=...`");
    }
    await m.reply("Fetching MP4…");
    try {
      const { data } = await axios.get("https://api.siputzx.my.id/api/d/ytmp4", {
        params: { url },
        timeout: 90000,
        validateStatus: () => true,
      });
      const r = data?.data || data?.result || data;
      const videoUrl = r?.url || r?.download || r?.dl;
      if (!videoUrl) return m.reply("No video link returned.");
      await sock.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption: r.title || "YouTube video",
          mimetype: "video/mp4",
        },
        { quoted: m.raw }
      );
    } catch (e) {
      await m.reply("ytmp4 failed: " + e.message);
    }
  },
};
