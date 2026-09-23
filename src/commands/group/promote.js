module.exports = {
  name: "promote",
  description: "Promote member to admin",
  groupOnly: true,
  async execute({ sock, m }) {
    const target =
      m.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.participant;

    if (!target) return m.reply("Tag the user to promote.");

    try {
      await sock.groupParticipantsUpdate(m.chat, [target], "promote");
      await m.reply(`@${target.split("@")[0]} is now an admin.`, {
        mentions: [target],
      });
    } catch (err) {
      await m.reply("Promote failed. Bot must be admin.\n" + err.message);
    }
  },
};
