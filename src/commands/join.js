module.exports = {
  name: "join",
  description: "Join group via invite link (owner)",
  ownerOnly: true,
  async execute({ sock, m, args }) {
    const link = args[0] || "";
    const match = link.match(/(?:https?:\/\/)?chat\.whatsapp\.com\/([A-Za-z0-9]+)/i);
    if (!match) {
      return m.reply("Usage: .join https://chat.whatsapp.com/InviteCode");
    }
    try {
      const code = match[1];
      const result = await sock.groupAcceptInvite(code);
      await m.reply(`Joined group.\nID: ${result || "ok"}`);
    } catch (err) {
      await m.reply("Join failed: " + err.message);
    }
  },
};
