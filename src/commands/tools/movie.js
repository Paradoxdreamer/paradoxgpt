const axios = require("axios");
const config = require("../../config");

const QUOTES = [
  "Some stories demand to be witnessed.",
  "Not all stories are meant to end well.",
  "Every film is a memory waiting to haunt you.",
  "The screen lies. The feeling doesn't.",
  "Fiction is just reality wearing a mask.",
  "A great film doesn't ask for your time. It takes it.",
];

function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

const movieCache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

function normalizeCacheKey(title, year = "") {
  const norm = title.toLowerCase().replace(/\s+/g, " ").trim();
  return `movie:${norm}${year ? `:${year}` : ""}`;
}

function getCached(key) {
  const entry = movieCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    movieCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  movieCache.set(key, { data, ts: Date.now() });
  if (movieCache.size > 100) {
    let oldestKey = null, oldestTs = Infinity;
    for (const [k, v] of movieCache) {
      if (v.ts < oldestTs) { oldestTs = v.ts; oldestKey = k; }
    }
    if (oldestKey) movieCache.delete(oldestKey);
  }
}

function getApiKey() {
  return config.omdbApiKey || "4a3b711b";
}

async function safeGet(url) {
  try {
    return await axios.get(url, { timeout: 10000 });
  } catch (e) {
    await new Promise((r) => setTimeout(r, 800));
    return axios.get(url, { timeout: 10000 });
  }
}

async function fetchMovie(title, year = "") {
  const cacheKey = normalizeCacheKey(title, year);
  const cached = getCached(cacheKey);
  if (cached) return { data: cached, fromCache: true };
  const yearParam = year ? `&y=${year}` : "";
  const { data } = await safeGet(
    `https://www.omdbapi.com/?t=${encodeURIComponent(title)}${yearParam}&plot=full&apikey=${getApiKey()}`
  );
  if (data.Response === "False") return null;
  setCache(cacheKey, data);
  return { data, fromCache: false };
}

async function searchMovies(query) {
  const cacheKey = `search:${query.toLowerCase().replace(/\s+/g, " ").trim()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const { data } = await safeGet(
    `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${getApiKey()}`
  );
  if (data.Response === "False" || !data.Search?.length) return [];
  const results = data.Search.slice(0, 5).sort((a, b) => {
    const score = (r) =>
      (r.Title.toLowerCase() === query.toLowerCase() ? 2 : 0) + (r.Type === "movie" ? 1 : 0);
    return score(b) - score(a);
  });
  setCache(cacheKey, results);
  return results;
}

function ratingBar(score, max = 10) {
  if (!score || score === "N/A") return "—";
  const n = parseFloat(score);
  const stars = Math.round(Math.min(n / max, 1) * 5);
  return `${"⭐".repeat(stars)}${"·".repeat(5 - stars)} (${score}/${max})`;
}

function buildCard(d) {
  const isSeries = d.Type === "series";
  let card = `🎬 *${d.Title}* (${d.Year})\n\n`;
  if (isSeries) {
    card += `📺 *Type:* TV Series\n`;
    if (d.totalSeasons && d.totalSeasons !== "N/A") card += `🗂️ *Seasons:* ${d.totalSeasons}\n`;
  } else {
    card += `🎞️ *Type:* ${d.Type === "movie" ? "Movie" : d.Type}\n`;
  }
  if (d.Genre && d.Genre !== "N/A") card += `🎭 *Genre:* ${d.Genre}\n`;
  if (d.Runtime && d.Runtime !== "N/A") card += `⏱️ *Runtime:* ${d.Runtime}\n`;
  if (d.Director && d.Director !== "N/A") card += `🎬 *Director:* ${d.Director}\n`;
  if (d.Writer && d.Writer !== "N/A")
    card += `✍️ *Writer:* ${d.Writer.split(",").slice(0, 2).join(", ")}\n`;
  if (d.Actors && d.Actors !== "N/A") card += `👥 *Cast:* ${d.Actors}\n`;
  if (d.Language && d.Language !== "N/A") card += `🌐 *Language:* ${d.Language}\n`;
  if (d.Country && d.Country !== "N/A") card += `🌍 *Country:* ${d.Country}\n`;
  if (d.BoxOffice && d.BoxOffice !== "N/A") card += `💰 *Box Office:* ${d.BoxOffice}\n`;
  if (d.Awards && d.Awards !== "N/A") card += `🏆 *Awards:* ${d.Awards}\n`;
  card += `\n`;
  if (d.imdbRating && d.imdbRating !== "N/A") card += `IMDB: ${ratingBar(d.imdbRating, 10)}\n`;
  const rt = d.Ratings?.find((r) => r.Source === "Rotten Tomatoes");
  const mc = d.Ratings?.find((r) => r.Source === "Metacritic");
  if (rt) card += `🍅 RT: ${rt.Value}\n`;
  if (mc) card += `🎯 MC: ${mc.Value}\n`;
  if (d.Plot && d.Plot !== "N/A") {
    const plot = d.Plot.length > 300 ? d.Plot.slice(0, 297) + "…" : d.Plot;
    card += `\n📖 _${plot}_\n`;
  }
  card += `\n🔗 https://www.imdb.com/title/${d.imdbID}`;
  card += `\n\n_${randomQuote()}_`;
  return card;
}

module.exports = {
  name: "movie",
  category: "tools",
  description: "Movie / series lookup (OMDB)",
  async execute({ sock, m, args }) {
    const sub = args[0]?.toLowerCase();
    const query = args.join(" ").trim();

    if (!query) {
      return m.reply(
        `🎬 *Movie / Series*\n\n` +
          `▸ *.movie <title>* — exact title\n` +
          `▸ *.movie <title> <year>* — by year\n` +
          `▸ *.movie search <query>* — keyword search\n\n` +
          `Examples:\n.movie Inception\n.movie The Dark Knight 2008\n.movie search breaking bad\n\n_${randomQuote()}_`
      );
    }

    if (sub === "search") {
      const searchQuery = args.slice(1).join(" ").trim();
      if (!searchQuery) return m.reply("Usage: .movie search <keyword>");
      await m.reply("🔍 Searching…");
      let results;
      try {
        results = await searchMovies(searchQuery);
      } catch (e) {
        return m.reply(`❌ Search failed: ${e.message}`);
      }
      if (!results.length) return m.reply(`❌ Nothing for *"${searchQuery}"*`);
      const fullList = results
        .map((r, i) => `  ${i + 1}. *${r.Title}* (${r.Year}) — ${r.Type}`)
        .join("\n");
      return m.reply(
        `🎬 *Results for "${searchQuery}"*\n\n${fullList}\n\n_Type *.movie <title> <year>*_`
      );
    }

    const lastArg = args[args.length - 1];
    const year = /^\d{4}$/.test(lastArg) ? lastArg : "";
    const title = year ? args.slice(0, -1).join(" ").trim() : query;

    await m.reply("🔍 Looking up…");
    let result;
    try {
      result = await fetchMovie(title, year);
    } catch (e) {
      return m.reply(`❌ Lookup failed: ${e.message}`);
    }

    if (!result) {
      let fallback = [];
      try {
        fallback = await searchMovies(title);
      } catch {}
      if (fallback.length) {
        const suggestions = fallback
          .map((r, i) => `  ${i + 1}. *${r.Title}* (${r.Year}) — ${r.Type}`)
          .join("\n");
        return m.reply(
          `❌ *"${title}"* not found exactly.\n\n*Did you mean:*\n${suggestions}\n\n_Try *.movie search ${title}*_`
        );
      }
      return m.reply(`❌ *"${title}"* not found.\n_Try *.movie search ${title}*_`);
    }

    const { data } = result;
    const card = buildCard(data);
    const poster = data.Poster && data.Poster !== "N/A" ? data.Poster : null;
    if (poster) {
      try {
        await sock.sendMessage(m.chat, { image: { url: poster }, caption: card }, { quoted: m.raw });
        return;
      } catch {}
    }
    await m.reply(card);
  },
};
