const axios = require("axios");

module.exports = {
  name: "translate",
  description: "Translate text (e.g. .translate es Hello)",
  async execute({ m, args }) {
    if (args.length < 2) {
      return m.reply(
        "Usage:\n.translate <to> <text>\n.translate <from>|<to> <text>\n\nExample: .translate es Good morning"
      );
    }

    let langpair = "en|" + args[0].toLowerCase();
    let text = args.slice(1).join(" ");

    if (args[0].includes("|")) {
      langpair = args[0].toLowerCase();
      text = args.slice(1).join(" ");
    } else if (args[0].length <= 5) {
      langpair = "Autodetect|" + args[0].toLowerCase();
      text = args.slice(1).join(" ");
    }

    if (!text) return m.reply("Provide text to translate.");

    try {
      const { data } = await axios.get("https://api.mymemory.translated.net/get", {
        params: { q: text, langpair },
        timeout: 12000,
      });

      const translated = data?.responseData?.translatedText;
      if (!translated) return m.reply("Translation failed.");

      await m.reply(
        `*Translate* (${langpair})\n\n*Original:* ${text}\n*Result:* ${translated}`
      );
    } catch (err) {
      await m.reply("Translate error: " + err.message);
    }
  },
};
