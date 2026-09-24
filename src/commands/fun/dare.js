const dares = [
  "Send a selfie to this chat!",
  "Send a voice note singing a song!",
  "Do 10 pushups and film it!",
  "Send your last screenshot!",
  "Send a voice note saying something embarrassing!",
  "Do your best impression of another person!",
  "Type with your eyes closed for the next message!",
  "Compliment the last person who texted in this chat!",
  "Change your status to something wild for 10 minutes!",
  "Send a meme that describes your current mood!",
  "Speak only in emojis for your next 3 messages!",
  "Reveal your most used emoji!",
];

module.exports = {
  name: "dare",
  category: "fun",
  description: "Get a dare challenge",
  async execute({ m }) {
    const dare = dares[Math.floor(Math.random() * dares.length)];
    await m.reply(`🔥 *DARE*\n\n${dare}`);
  },
};
