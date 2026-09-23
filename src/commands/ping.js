module.exports = {
  name: "ping",
  description: "Check if the bot is alive",
  async execute({ m }) {
    const start = Date.now();
    await m.reply(`Pong 🏓\nLatency: ${Date.now() - start}ms`);
  },
};
