module.exports = {
  name: "poll",
  description: "Create a poll (.poll Q | A | B | C)",
  groupOnly: true,
  async execute({ sock, m, args }) {
    const raw = args.join(" ");
    const parts = raw.split("|").map((s) => s.trim()).filter(Boolean);

    if (parts.length < 3) {
      return m.reply(
        "Usage: .poll Question | Option1 | Option2 | Option3\n\nExample:\n.poll Best language? | JS | Python | Go"
      );
    }

    const name = parts[0];
    const values = parts.slice(1).slice(0, 12);

    try {
      await sock.sendMessage(m.chat, {
        poll: {
          name,
          values,
          selectableCount: 1,
        },
      });
    } catch (err) {
      await m.reply("Poll failed: " + err.message);
    }
  },
};
