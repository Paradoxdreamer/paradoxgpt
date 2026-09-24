const axios = require("axios");

module.exports = {
  name: "media",
  category: "media",
  description: "Download media from a URL",
  async execute({ sock, m, args }) {
    const url = args[0];
    if (!url || !/^https?:\/\//i.test(url)) {
      return m.reply(
        "Usage: `.media <url>`\nAlso: `.play` `.ytmp3` `.ytmp4` `.tiktok` `.ig`"
      );
    }

    if (/youtu/i.test(url)) return m.reply("YouTube — use `.ytmp3 <url>` or `.ytmp4 <url>`");
    if (/tiktok/i.test(url)) return m.reply("TikTok — use `.tiktok <url>`");
    if (/instagram|instagr\.am/i.test(url)) return m.reply("Instagram — use `.ig <url>`");

    await m.reply("Fetching…");
    try {
      const head = await axios.head(url, {
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: () => true,
      });
      const ct = String(head.headers["content-type"] || "");
      if (/image\//i.test(ct)) {
        return sock.sendMessage(m.chat, { image: { url } }, { quoted: m.raw });
      }
      if (/video\//i.test(ct)) {
        return sock.sendMessage(m.chat, { video: { url } }, { quoted: m.raw });
      }
      if (/audio\//i.test(ct)) {
        return sock.sendMessage(m.chat, { audio: { url }, mimetype: ct }, { quoted: m.raw });
      }
      await m.reply("Not a direct media URL. Try `.ytmp4` / `.tiktok` / `.ig`.");
    } catch (e) {
      await m.reply("Media fetch failed: " + e.message);
    }
  },
};
