const emojiMap = {
  smile: "😄", laugh: "😂", cry: "😭", angry: "😡",
  love: "❤️", heart: "❤️", fire: "🔥", cool: "😎",
  wow: "😮", think: "🤔", shrug: "🤷", wave: "👋",
  thumbsup: "👍", thumbsdown: "👎", clap: "👏", pray: "🙏",
  dance: "💃", run: "🏃", sleep: "😴", dead: "💀",
  rich: "💰", money: "💵", star: "⭐", crown: "👑",
  gem: "💎", bomb: "💣", skull: "💀", alien: "👽",
  robot: "🤖", ghost: "👻", cat: "🐱", dog: "🐶",
  panda: "🐼", lion: "🦁", paradox: "🌑", chaos: "🌀",
};

module.exports = {
  name: "emoji",
  category: "fun",
  description: "Emoji by keyword — .emoji cry",
  async execute({ m, args }) {
    const text = args.join(" ").toLowerCase().trim();
    if (!text) {
      const keys = Object.keys(emojiMap).slice(0, 16).join(", ");
      return m.reply(`😀 *Emoji*\n\nUsage: \\`.emoji <keyword>\\`\n\nExamples: cry, love, fire, cool\n\nKeys: ${keys}…`);
    }
    const emoji = emojiMap[text];
    await m.reply(emoji || `No match for *${text}*. Try: love, fire, cry, cool`);
  },
};
