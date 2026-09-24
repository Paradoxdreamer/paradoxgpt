const axios = require("axios");

module.exports = {
  name: "meme",
  category: "fun",
  description: "Random meme from Imgflip",
  async execute({ sock, m }) {
    try {
      const { data } = await axios.get("https://api.imgflip.com/get_memes", {
        timeout: 15000,
      });
      if (!data?.success || !data?.data?.memes?.length) {
        return m.reply("Couldn't load memes.");
      }
      const memes = data.data.memes;
      const random = memes[Math.floor(Math.random() * memes.length)];
      await sock.sendMessage(
        m.chat,
        {
          image: { url: random.url },
          caption: `*${random.name}*\n\n💀 via \\`.meme\\``,
        },
        { quoted: m.raw }
      );
    } catch (e) {
      await m.reply("Meme failed: " + e.message);
    }
  },
};
