const axios = require("axios");

const FALLBACK = [
  '"The only way to do great work is to love what you do." — Steve Jobs',
  '"In the middle of difficulty lies opportunity." — Albert Einstein',
  '"Stay hungry, stay foolish." — Steve Jobs',
  '"Life is what happens when you\'re busy making other plans." — John Lennon',
  '"Crafted from silence and sunless skies." — ParadoxGPT',
];

module.exports = {
  name: "quote",
  category: "fun",
  description: "Random inspirational quote",
  async execute({ m }) {
    try {
      const { data } = await axios.get("https://api.quotable.io/random", { timeout: 10000 });
      if (data?.content) {
        return m.reply(`💬 *Quote*\n\n"${data.content}"\n\n— *${data.author}*`);
      }
    } catch (_) {}
    const quote = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    await m.reply(`💬 *Quote*\n\n${quote}`);
  },
};
