module.exports = {
  name: "linkgc",
  description: "Get this group's invite link",
  groupOnly: true,
  async execute({ sock, m }) {
    try {
      const code = await sock.groupInviteCode(m.chat);
      await m.reply(`Group link:\nhttps://chat.whatsapp.com/${code}`);
    } catch (err) {
      await m.reply("Failed. Bot must be admin.\n" + err.message);
    }
  },
};
