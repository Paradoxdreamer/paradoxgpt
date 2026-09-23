module.exports = {
  name: "tagall",
  description: "Mention every member in the group",
  groupOnly: true,
  async execute({ sock, m }) {
    try {
      const meta = await sock.groupMetadata(m.chat);
      const members = meta.participants.map((p) => p.id);
      const text = members.map((id) => `@${id.split("@")[0]}`).join(" ");

      await sock.sendMessage(m.chat, {
        text: `📢 *Tag All*\n\n${text}`,
        mentions: members,
      }, { quoted: m.raw });
    } catch (err) {
      await m.reply("Could not fetch group members.");
    }
  },
};
