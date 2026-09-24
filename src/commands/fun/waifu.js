const axios = require("axios");

const CATEGORIES = [
  "waifu", "neko", "shinobu", "megumin", "cuddle", "cry", "hug",
  "awoo", "kiss", "pat", "smug", "bonk", "blush", "smile", "wave",
  "highfive", "slap", "kick", "happy", "wink", "poke", "dance",
];

module.exports = {
  name: "waifu",
  category: "fun",
  description: "Random anime image — .waifu hug",
  async execute({ sock, m, args }) {
    const category = (args[0] || "waifu").toLowerCase();
    if (!CATEGORIES.includes(category)) {
      return m.reply(
        `👘 *Waifu*\n\nUsage: \\`.waifu <category>\\`\n\n` +
          CATEGORIES.join(" · ") +
          `\n\nExample: \\`.waifu hug\\``
      );
    }
    try {
      const { data } = await axios.get(`https://api.waifu.pics/sfw/${category}`, {
        timeout: 15000,
      });
      if (!data?.url) return m.reply("No image returned.");
      await sock.sendMessage(
        m.chat,
        { image: { url: data.url }, caption: `👘 \\`.waifu ${category}\\`` },
        { quoted: m.raw }
      );
    } catch (e) {
      await m.reply("Waifu API failed: " + e.message);
    }
  },
};
