const axios = require("axios");

module.exports = {
  name: "play",
  category: "media",
  description: "Download YouTube audio by query or URL",
  async execute({ sock, m, args }) {
    const q = args.join(" ").trim();
    if (!q) return m.reply("Usage: `.play never gonna give you up` or `.play <youtube-url>`");

    await m.reply("Searching YouTube…");

    try {
      const { data } = await axios.get("https://api.siputzx.my.id/api/d/ytmp3", {
        params: q.includes("http") ? { url: q } : { query: q },
        timeout: 60000,
        validateStatus: () => true,
      });

      let result = data?.data || data?.result || data;
      if (!result?.url && !result?.download && !result?.dl) {
        const search = await axios.get("https://api.siputzx.my.id/api/s/youtube", {
          params: { query: q },
          timeout: 30000,
          validateStatus: () => true,
        });
        const first = search.data?.data?.[0] || search.data?.result?.[0];
        if (!first?.url && !first?.link) {
          return m.reply("No results. Try a clearer query or a direct YouTube URL.");
        }
        const ytUrl = first.url || first.link;
        const dl = await axios.get("https://api.siputzx.my.id/api/d/ytmp3", {
          params: { url: ytUrl },
          timeout: 60000,
          validateStatus: () => true,
        });
        result = dl.data?.data || dl.data?.result || dl.data;
      }

      const audioUrl = result?.url || result?.download || result?.dl;
      const title = result?.title || q;
      if (!audioUrl) return m.reply("Couldn't get a download link. Try again later.");

      await sock.sendMessage(
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${String(title).slice(0, 60)}.mp3`,
          ptt: false,
        },
        { quoted: m.raw }
      );
      await m.reply(`*${title}*`);
    } catch (err) {
      console.error("play error:", err.message);
      await m.reply("Download failed. Try `.ytmp4` or retry later.");
    }
  },
};
