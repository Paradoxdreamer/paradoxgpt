const axios = require("axios");

module.exports = {
  name: "search",
  description: "Search the web (DuckDuckGo)",
  async execute({ m, args }) {
    const q = args.join(" ").trim();
    if (!q) return m.reply("Usage: .search <query>");
    await m.reply(`Searching: *${q}*…`);
    try {
      const { data } = await axios.get("https://api.duckduckgo.com/", {
        params: { q, format: "json", no_redirect: 1, no_html: 1, skip_disambig: 1 },
        timeout: 15000,
        headers: { "User-Agent": "ParadoxGPT/2.0" },
      });
      const lines = [];
      if (data.Heading) lines.push(`*${data.Heading}*`);
      if (data.AbstractText) lines.push(data.AbstractText);
      if (data.AbstractURL) lines.push(`Link: ${data.AbstractURL}`);
      const related = (data.RelatedTopics || []).filter((t) => t.Text).slice(0, 5)
        .map((t, i) => `${i + 1}. ${t.Text}${t.FirstURL ? `\n   ${t.FirstURL}` : ""}`);
      if (related.length) { lines.push("\n*Related:*"); lines.push(related.join("\n")); }
      if (!lines.length) return m.reply(`No instant answer. Try: https://duckduckgo.com/?q=${encodeURIComponent(q)}`);
      await m.reply(lines.join("\n\n"));
    } catch (err) {
      await m.reply("Search failed. Try again later.");
    }
  },
};
