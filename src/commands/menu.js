const config = require("../config");

module.exports = {
  name: "menu",
  description: "Show available commands",
  async execute({ m, commands }) {
    const p = config.prefix;
    const text = `*ParadoxGPT Menu*\n\n*General*\n${p}ping · ${p}menu · ${p}profile · ${p}afk\n${p}mode · ${p}ask · ${p}roast\n\n*Tools*\n${p}search · ${p}news · ${p}weather · ${p}translate\n${p}qr · ${p}remind · ${p}poll\n\n*Media*\n${p}s (sticker) · ${p}toimg · ${p}see (view-once)\n\n*Group*\n${p}tagall · ${p}hidetag · ${p}groupinfo · ${p}linkgc\n${p}kick · ${p}promote · ${p}demote\n${p}setname · ${p}setdesc\n${p}welcome · ${p}leave · ${p}antilink · ${p}warn\n\n*Channel / Broadcast* _(owner)_\n${p}broadcast · ${p}channel · ${p}listgc\n${p}join · ${p}leavegc · ${p}ban · ${p}unban\n\n_Modes: normal · chaotic_\n_AI replies when mentioned or message ends with ?_\n_Hot-reload: commands update every 5s_`;

    await m.reply(text);
  },
};
