const { getMode, setMode } = require("../ai/gemini");

module.exports = {
  name: "mode",
  description: "Switch personality (normal | chaotic)",
  async execute({ m, args }) {
    const input = (args[0] || "").toLowerCase();
    const valid = ["normal", "chaotic"];

    if (!valid.includes(input)) {
      const current = await getMode();
      return m.reply(
        `Current mode: *${current}*\n\nUsage: .mode normal\n       .mode chaotic`
      );
    }

    await setMode(input);
    const vibe =
      input === "chaotic"
        ? "Brace yourself. The chaos is awake 😈"
        : "Switching back to chill… for now 🧘‍♂️";

    await m.reply(`ParadoxGPT is now in *${input.toUpperCase()} MODE*.\n${vibe}`);
  },
};
