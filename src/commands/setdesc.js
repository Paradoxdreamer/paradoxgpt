module.exports = {
  name: "setdesc",
  description: "Set group description (bot must be admin)",
  groupOnly: true,
  async execute({ sock, m, args }) {
    const text = args.join(" ").trim();
    if (!text) return m.reply("Usage: .setdesc <new description>");
    try {
      await sock.groupUpdateDescription(m.chat, text);
      await m.reply("Group description updated.");
    } catch (err) {
      await m.reply("Failed. Bot must be admin.\n" + err.message);
    }
  },
};
