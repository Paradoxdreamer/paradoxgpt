module.exports = {
  name: "leavegc",
  description: "Leave a group (owner)",
  ownerOnly: true,
  async execute({ sock, m, args }) {
    const jid = args[0] || (m.isGroup ? m.chat : null);
    if (!jid) return m.reply("Usage: .leavegc [groupJid] (or run inside a group)");
    try {
      await m.reply("Leaving…");
      await sock.groupLeave(jid);
    } catch (err) {
      await m.reply("Leave failed: " + err.message);
    }
  },
};
