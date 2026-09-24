const jokes = [
  "Why don't scientists trust atoms?\nBecause they make up everything!",
  "I told my wife she was drawing her eyebrows too high.\nShe looked surprised.",
  "Why don't eggs tell jokes?\nThey'd crack each other up!",
  "What do you call a fake noodle?\nAn impasta!",
  "Why did the scarecrow win an award?\nBecause he was outstanding in his field!",
  "I'm reading a book about anti-gravity.\nIt's impossible to put down!",
  "Did you hear about the mathematician who's afraid of negative numbers?\nHe'll stop at nothing to avoid them!",
  "Why do we tell actors to 'break a leg?'\nBecause every play has a cast!",
  "What do you call a bear with no teeth?\nA gummy bear!",
  "I used to hate facial hair...\nBut then it grew on me.",
  "Why did the bicycle fall over?\nBecause it was two tired!",
  "What do you call a dog that does magic?\nA Labracadabrador!",
  "I told my doctor I broke my arm in two places.\nHe told me to stop going to those places.",
  "Why don't skeletons fight each other?\nThey don't have the guts!",
  "What do you call someone with no body and no nose?\nNobody knows!",
];

module.exports = {
  name: "joke",
  category: "fun",
  description: "Random joke",
  async execute({ m }) {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await m.reply(`😂 *Joke*\n\n${joke}`);
  },
};
