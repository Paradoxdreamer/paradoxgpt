module.exports = {
  name: "kick",
  description: "Remove a member from the group",
  groupOnly: true,
  async execute({ sock, m }) {
    const target =
      m.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.participant ||
      null;

    if (!target) {
      return m.reply("Tag or reply to the user to kick.");
    }

    try {
      await sock.groupParticipantsUpdate(m.chat, [target], "remove");
      await m.reply(`@${target.split("@")[0]} has been removed.`, {
        mentions: [target],
      });
    } catch (err) {
      await m.reply(
        "Kick failed. Make sure the bot is *admin*.\n" + err.message
      );
    }
  },
};
