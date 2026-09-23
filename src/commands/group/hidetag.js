module.exports = {
  name: "hidetag",
  description: "Silent mention of all group members",
  groupOnly: true,
  async execute({ sock, m, args }) {
    let text = args.join(" ").trim();
    if (!text && m.quoted) {
      text =
        m.quoted.conversation ||
        m.quoted.extendedTextMessage?.text ||
        "‎";
    }
    if (!text) text = "‎";

    try {
      const meta = await sock.groupMetadata(m.chat);
      const members = meta.participants.map((p) => p.id);
      await sock.sendMessage(
        m.chat,
        { text, mentions: members },
        { quoted: m.raw }
      );
    } catch (err) {
      await m.reply("Hidetag failed: " + err.message);
    }
  },
};
