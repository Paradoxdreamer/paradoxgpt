const axios = require("axios");

module.exports = {
  name: "tiktok",
  category: "media",
  description: "Download TikTok video",
  async execute({ sock, m, args }) {
    const url = args[0];
    if (!url || !/tiktok\.com|vt\.tiktok/i.test(url)) {
      return m.reply("Usage: `.tiktok https://www.tiktok.com/@user/video/...`");
    }
    await m.reply("Fetching TikTok…");
    try {
      const { data } = await axios.get("https://api.siputzx.my.id/api/d/tiktok", {
        params: { url },
        timeout: 60000,
        validateStatus: () => true,
      });
      const r = data?.data || data?.result || data;
      const videoUrl = r?.url || r?.download || r?.no_watermark || r?.play || r?.video;
      if (!videoUrl) return m.reply("No TikTok media returned.");
      await sock.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption: r.title || r.author || "TikTok",
        },
        { quoted: m.raw }
      );
    } catch (e) {
      await m.reply("TikTok download failed: " + e.message);
    }
  },
};
