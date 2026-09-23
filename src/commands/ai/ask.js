const { askGemini } = require("../../ai/omega");

module.exports = {
  name: "ask",
  description: "Ask ParadoxGPT anything",
  async execute({ m, args }) {
    const prompt = args.join(" ").trim();
    if (!prompt) {
      return m.reply("Ask me something. Example: .ask what is entropy?");
    }

    await m.reply("Thinking…");
    const reply = await askGemini(prompt);
    await m.reply(reply);
  },
};
