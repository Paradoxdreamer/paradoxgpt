const axios = require("axios");

module.exports = {
  name: "ig",
  category: "media",
  description: "Download Instagram post / reel",
  async execute({ sock, m, args }) {
    const url = args[0];
    if (!url || !/instagram\.com|instagr\.am/i.test(url)) {
      return m.reply("Usage: `.ig https://www.instagram.com/p/...` or reel URL");
    }
    await m.reply("Fetching Instagram…");
    try {
      const { data } = await axios.get("https://api.siputzx.my.id/api/d/igdl", {
        params: { url },
        timeout: 60000,
        validateStatus: () => true,
      });
      const list = data?.data || data?.result || [];
      const items = Array.isArray(list) ? list : [list];
      let sent = 0;
      for (const item of items.slice(0, 4)) {
        const mediaUrl = item?.url || item?.download || item?.media;
        if (!mediaUrl) continue;
        const isVideo = /\.mp4|video/i.test(mediaUrl) || item?.type === "video";
        if (isVideo) {
          await sock.sendMessage(m.chat, { video: { url: mediaUrl } }, { quoted: m.raw });
        } else {
          await sock.sendMessage(m.chat, { image: { url: mediaUrl } }, { quoted: m.raw });
        }
        sent++;
      }
      if (!sent) return m.reply("No media found on that Instagram link.");
    } catch (e) {
      await m.reply("Instagram download failed: " + e.message);
    }
  },
};
