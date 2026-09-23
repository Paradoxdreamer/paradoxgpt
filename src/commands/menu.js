module.exports = {
  name: "menu",
  description: "Show available commands",
  async execute({ m, commands }) {
    const list = Object.values(commands)
      .filter((c) => c.name && !c.ownerOnly)
      .map((c) => `• ${require("../config").prefix}${c.name}${c.description ? ` — ${c.description}` : ""}`)
      .join("\n");

    const text = `🖤 *ParadoxGPT Menu*\n\n${list}\n\n_Modes: normal · chaotic_\n_AI replies when mentioned or when you end with ?_`;

    await m.reply(text);
  },
};
