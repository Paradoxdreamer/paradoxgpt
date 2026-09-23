module.exports = {
  name: "demote",
  description: "Demote an admin to member",
  groupOnly: true,
  async execute({ sock, m }) {
    const target =
      m.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.participant;

    if (!target) return m.reply("Tag the admin to demote.");

    try {
      await sock.groupParticipantsUpdate(m.chat, [target], "demote");
      await m.reply(`@${target.split("@")[0]} is no longer an admin.`, {
        mentions: [target],
      });
    } catch (err) {
      await m.reply("Demote failed. Bot must be admin.\n" + err.message);
    }
  },
};
