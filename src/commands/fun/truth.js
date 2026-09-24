const truths = [
  "What's your biggest fear?",
  "What's the most embarrassing thing you've ever done?",
  "What's a secret you've never told anyone?",
  "What's your biggest regret?",
  "Who was your first crush?",
  "What's the weirdest thing you've done alone?",
  "What's your biggest lie?",
  "What's something you're glad your parents don't know about you?",
  "What's the most trouble you've ever been in?",
  "Who in this chat would you date?",
  "What's a habit you're trying to quit?",
  "What's the last thing that made you cry?",
];

module.exports = {
  name: "truth",
  category: "fun",
  description: "Get a truth question",
  async execute({ m }) {
    const truth = truths[Math.floor(Math.random() * truths.length)];
    await m.reply(`🤔 *TRUTH*\n\n${truth}`);
  },
};
