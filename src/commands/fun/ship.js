module.exports = {
  name: "ship",
  category: "fun",
  description: "Love calculator — .ship @user1 @user2",
  async execute({ m, args }) {
    let a, b;
    const mentions = m.mentionedJid || [];

    if (mentions.length >= 2) {
      a = mentions[0];
      b = mentions[1];
    } else if (mentions.length === 1) {
      a = m.sender;
      b = mentions[0];
    } else if (args.length >= 1) {
      a = m.sender;
      b = args[0].replace(/\D/g, "") + "@s.whatsapp.net";
    } else {
      return m.reply("💕 *Ship*\n\nUsage: `.ship @user1 @user2`\nOr: `.ship @user`");
    }

    const combined = (a + b).toLowerCase();
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const percentage = Math.abs(hash % 101);

    let emoji, message;
    if (percentage >= 80) {
      emoji = "💘";
      message = "Soulmates!";
    } else if (percentage >= 60) {
      emoji = "💕";
      message = "Great match!";
    } else if (percentage >= 40) {
      emoji = "💭";
      message = "Could work…";
    } else {
      emoji = "💀";
      message = "Run. Just run.";
    }

    const n1 = a.split("@")[0];
    const n2 = b.split("@")[0];
    const filled = Math.floor(percentage / 10);
    const bar = "█".repeat(filled) + "░".repeat(10 - filled);

    await m.reply(
      `💕 *Love Calculator*\n\n@${n1}  ×  @${n2}\n\n${emoji} *${percentage}%*\n\`${bar}\`\n\n_${message}_`,
      { mentions: [a, b] }
    );
  },
};
