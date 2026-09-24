module.exports = {
  name: "tweet",
  category: "fun",
  description: "Fake tweet card — .tweet @user|text",
  async execute({ m, args }) {
    const raw = args.join(" ");
    const parts = raw.split("|").map((s) => s.trim());

    if (parts.length < 2 || !parts[1]) {
      return m.reply(
        `🐦 *Fake Tweet*\n\nUsage: \\`.tweet @username|your text here\\`\n\nExample:\n\\`.tweet @elonmusk|I am buying Twitter!\\``
      );
    }

    const username = parts[0].replace(/^@/, "").replace(/\s/g, "") || "someone";
    const text = parts.slice(1).join("|");
    const date = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const card =
      `╭─────────────────────╮\n` +
      `│  🐦  *${username}*  ✓\n` +
      `│  @${username.toLowerCase()}\n` +
      `│\n` +
      `│  ${text}\n` +
      `│\n` +
      `│  10:30 AM · ${date}\n` +
      `│  💬 234   🔄 1.2K   ❤️ 5.6K\n` +
      `╰─────────────────────╯`;

    await m.reply(card);
  },
};
