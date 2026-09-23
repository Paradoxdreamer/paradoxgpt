module.exports = {
  name: "listgc",
  description: "List all groups bot is in (owner)",
  ownerOnly: true,
  async execute({ sock, m }) {
    try {
      const all = await sock.groupFetchAllParticipating();
      const groups = Object.values(all || {});
      if (!groups.length) return m.reply("Not in any groups.");
      const lines = groups
        .map(
          (g, i) =>
            `${i + 1}. *${g.subject}*\n   ${g.id}\n   members: ${g.participants?.length || "?"}`
        )
        .join("\n\n");
      await m.reply(`*Groups (${groups.length})*\n\n${lines}`);
    } catch (err) {
      await m.reply("Failed: " + err.message);
    }
  },
};
