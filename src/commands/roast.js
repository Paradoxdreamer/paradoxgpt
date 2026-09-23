const { askGemini } = require("../ai/gemini");

module.exports = {
  name: "roast",
  description: "Roast a tagged user",
  async execute({ m }) {
    const target = m.mentionedJid?.[0];
    if (!target) {
      return m.reply("Tag someone to roast. Example: .roast @user");
    }

    const name = target.split("@")[0];
    const prompt = `Write a witty, creative, slightly savage roast aimed at someone named ${name}. Keep it clever and humorous, not just mean. One short paragraph.`;

    const roast = await askGemini(prompt, { mode: "chaotic" });
    await m.reply(`@${name} 🔥\n\n${roast}`, { mentions: [target] });
  },
};
