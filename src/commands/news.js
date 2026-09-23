const axios = require("axios");

module.exports = {
  name: "news",
  description: "Topic headlines / related news links",
  async execute({ m, args }) {
    const q = args.join(" ").trim() || "world news";
    await m.reply(`Looking up: *${q}*…`);
    try {
      const { data } = await axios.get("https://api.duckduckgo.com/", {
        params: { q: q + " news", format: "json", no_html: 1 },
        timeout: 15000,
        headers: { "User-Agent": "ParadoxGPT/2.0" },
      });
      const topics = (data.RelatedTopics || [])
        .filter((t) => t.Text && t.FirstURL)
        .slice(0, 6);
      if (!topics.length && data.AbstractText) {
        return m.reply(`*${data.Heading || q}*\n\n${data.AbstractText}\n\n${data.AbstractURL || ""}`);
      }
      if (!topics.length) {
        return m.reply(
          `No results. Try: https://duckduckgo.com/?q=${encodeURIComponent(q + " news")}&ia=news`
        );
      }
      const lines = topics.map((t, i) => `${i + 1}. ${t.Text}\n   ${t.FirstURL}`);
      await m.reply(`*${q}*\n\n${lines.join("\n\n")}`);
    } catch (err) {
      await m.reply("News lookup failed.");
    }
  },
};
