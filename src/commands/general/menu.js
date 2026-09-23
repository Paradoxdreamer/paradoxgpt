const config = require("../../config");

module.exports = {
  name: "menu",
  category: "general",
  description: "Show available commands",
  async execute({ m, commands }) {
    const p = config.prefix;

    const groups = {};
    for (const cmd of Object.values(commands || {})) {
      if (!cmd?.name) continue;
      const cat = cmd.category || "misc";
      groups[cat] = groups[cat] || [];
      groups[cat].push(cmd.name);
    }

    const order = ["general", "ai", "tools", "media", "group", "auto", "anti", "owner"];
    const labels = {
      general: "General",
      ai: "AI",
      tools: "Tools",
      media: "Media",
      group: "Group",
      auto: "Auto",
      anti: "Anti",
      owner: "Owner",
    };

    let text = `*ParadoxGPT Menu*\n`;

    for (const cat of order) {
      const names = groups[cat];
      if (!names || !names.length) continue;
      names.sort();
      text += `\n*${labels[cat] || cat}*  \`(${cat})\`\n`;
      text += names.map((n) => `${p}${n}`).join(" · ") + "\n";
    }

    for (const cat of Object.keys(groups).sort()) {
      if (order.includes(cat)) continue;
      const names = groups[cat].sort();
      text += `\n*${cat}*\n`;
      text += names.map((n) => `${p}${n}`).join(" · ") + "\n";
    }

    text += `\n_Modes: normal · chaotic_\n_Hot-reload: category folders auto-load_`;
    await m.reply(text.trim());
  },
};
