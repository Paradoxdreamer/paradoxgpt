module.exports = {
  name: "groupinfo",
  description: "Show group stats and metadata",
  groupOnly: true,
  async execute({ sock, m }) {
    try {
      const meta = await sock.groupMetadata(m.chat);
      const admins = meta.participants.filter(
        (p) => p.admin === "admin" || p.admin === "superadmin"
      );
      const created = meta.creation
        ? new Date(meta.creation * 1000).toLocaleString()
        : "—";

      const text = `*Group Info*\n\n*Name:* ${meta.subject}\n*ID:* ${meta.id}\n*Members:* ${meta.participants.length}\n*Admins:* ${admins.length}\n*Created:* ${created}\n*Owner:* ${meta.owner ? "@" + meta.owner.split("@")[0] : "—"}\n*Restrict:* ${meta.restrict ? "Yes" : "No"}\n*Announce:* ${meta.announce ? "Only admins" : "All members"}\n\n*Description:*\n${meta.desc || "_No description_"}`;

      await sock.sendMessage(
        m.chat,
        { text, mentions: meta.owner ? [meta.owner] : [] },
        { quoted: m.raw }
      );
    } catch (err) {
      await m.reply("Could not fetch group info.");
    }
  },
};
