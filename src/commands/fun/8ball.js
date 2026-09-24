const answers = {
  positive: [
    "Yes! 🎉", "Definitely! ✨", "Of course! 💯", "Absolutely! 🔥",
    "Without a doubt! 💪", "You can count on it! 🚀",
  ],
  neutral: [
    "Maybe 🤔", "Ask again later 🕐", "I'm not sure 🤷", "Could be…",
    "Possibly 🤞", "Reply hazy, try again 🌫️",
  ],
  negative: [
    "No ❌", "Definitely not 🚫", "Never! 🙅",
    "Don't count on it 💀", "Outlook not so good 👎", "My sources say no.",
  ],
};

module.exports = {
  name: "8ball",
  category: "fun",
  description: "Magic 8-ball — .8ball Will I be rich?",
  async execute({ m, args }) {
    const question = args.join(" ").trim();
    if (!question) {
      return m.reply("🎱 *8Ball*\n\nUsage: `.8ball <question>`\nExample: `.8ball Will I be rich?`");
    }
    const roll = Math.random();
    let pool;
    if (roll < 0.4) pool = answers.positive;
    else if (roll < 0.7) pool = answers.neutral;
    else pool = answers.negative;
    const answer = pool[Math.floor(Math.random() * pool.length)];
    await m.reply(`🎱 *8Ball*\n\n❓ ${question}\n\n→ ${answer}`);
  },
};
