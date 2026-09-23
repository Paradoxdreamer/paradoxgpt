module.exports = {
  name: "ping",
  description: "Check bot latency",
  async execute({ m }) {
    const start = Date.now();
    await m.reply(`Pong · ${Date.now() - start}ms`);
  },
};
