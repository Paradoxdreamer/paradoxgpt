module.exports = {
  name: "setname",
  description: "Set group name (bot must be admin)",
  groupOnly: true,
  async execute({ sock, m, args }) {
    const text = args.join(" ").trim();
    if (!text) return m.reply("Usage: .setname <new group name>");
    try {
      await sock.groupUpdateSubject(m.chat, text);
      await m.reply(`Group name set to: *${text}*`);
    } catch (err) {
      await m.reply("Failed. Bot must be admin.\n" + err.message);
    }
  },
};
