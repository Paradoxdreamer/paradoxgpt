"use strict";

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { exec } = require("child_process");
const config = require("../config");

let ytsr = null;
try { ytsr = require("ytsr"); } catch { console.warn("[SONG] ytsr not installed — npm i ytsr"); }

let ytdlpOk = null;
(async () => {
  try {
    await new Promise((res, rej) => exec("yt-dlp --version", { timeout: 5000 }, (e) => (e ? rej(e) : res())));
    ytdlpOk = true;
    console.log("[SONG] yt-dlp detected");
  } catch {
    ytdlpOk = false;
    console.warn("[SONG] yt-dlp not installed — pip install yt-dlp");
  }
})();

async function safeGet(url, options = {}, retries = 1) {
  try {
    return await axios.get(url, { timeout: 12000, ...options });
  } catch (e) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 800));
      return safeGet(url, options, retries - 1);
    }
    throw e;
  }
}

const metaCache = new Map();
const ytCache = new Map();
const lyricsCache = new Map();
const CACHE_TTL = 30 * 60 * 1000;
const CACHE_MAX = 300;
const searchCooldowns = new Map();
const downloadCooldowns = new Map();
const SEARCH_CD_MS = 5000;
const DOWNLOAD_CD_MS = 10000;

function isSearchOnCooldown(userId) {
  const last = searchCooldowns.get(userId) || 0;
  if (Date.now() - last < SEARCH_CD_MS) return true;
  searchCooldowns.set(userId, Date.now());
  return false;
}

function canDownload(userId) {
  const last = downloadCooldowns.get(userId) || 0;
  if (Date.now() - last < DOWNLOAD_CD_MS) return false;
  downloadCooldowns.set(userId, Date.now());
  return true;
}

function getCached(map, key) {
  const entry = map.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { map.delete(key); return null; }
  return entry.data;
}

function setCache(map, key, data) {
  if (map.size >= CACHE_MAX) {
    let oldestKey = null, oldestTs = Infinity;
    for (const [k, v] of map) if (v.ts < oldestTs) { oldestTs = v.ts; oldestKey = k; }
    if (oldestKey) map.delete(oldestKey);
  }
  map.set(key, { data, ts: Date.now() });
}

const STOP_WORDS = new Set(["the","a","an","and","or","of","in","on","by","ft","feat","featuring","with","official","audio","video","music","lyrics","lyric","hd","4k","mv","ver","version","extended","remastered"]);

function normalizeCacheKey(query, knownArtist = "") {
  let q = query.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
  if (knownArtist) {
    for (const w of knownArtist.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/)) {
      if (w.length > 2) q = q.replace(new RegExp(`\\b${w}\\b`, "g"), "");
    }
  }
  q = q.split(/\s+/).filter((w) => w.length > 1 && !STOP_WORDS.has(w)).join(" ").trim();
  return q || query.toLowerCase().trim();
}

let spotifyToken = null;
let spotifyTokenExp = 0;

async function getSpotifyToken() {
  if (spotifyToken && Date.now() < spotifyTokenExp) return spotifyToken;
  const { clientId, clientSecret } = config.spotify || {};
  if (!clientId || !clientSecret) return null;
  try {
    const body = new URLSearchParams({ grant_type: "client_credentials" });
    const { data } = await axios.post("https://accounts.spotify.com/api/token", body.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      timeout: 8000,
    });
    spotifyToken = data.access_token;
    spotifyTokenExp = Date.now() + (data.expires_in - 60) * 1000;
    return spotifyToken;
  } catch (e) {
    console.warn("[SONG] Spotify token:", e.message);
    return null;
  }
}

async function searchSpotifyMulti(query, limit = 5) {
  const token = await getSpotifyToken();
  if (!token) return [];
  try {
    const { data } = await safeGet(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return (data.tracks?.items || []).map((t) => ({
      name: t.name,
      artist: t.artists?.map((a) => a.name).join(", ") || "Unknown",
      album: t.album?.name || "Unknown Album",
      image: t.album?.images?.[0]?.url || null,
      duration_ms: t.duration_ms || 0,
      link: t.external_urls?.spotify || null,
      popularity: t.popularity || 0,
      releaseDate: t.album?.release_date || null,
      genre: null,
      source: "Spotify",
    }));
  } catch (e) {
    console.warn("[SONG] Spotify search:", e.message);
    return [];
  }
}

async function searchItunesMulti(query, limit = 5) {
  try {
    const { data } = await safeGet(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=${limit}`);
    return (data.results || []).map((it) => ({
      name: it.trackName || "Unknown",
      artist: it.artistName || "Unknown",
      album: it.collectionName || "Unknown Album",
      image: it.artworkUrl100?.replace("100x100bb", "600x600bb") || null,
      duration_ms: it.trackTimeMillis || 0,
      link: it.trackViewUrl || null,
      popularity: null,
      releaseDate: it.releaseDate || null,
      genre: it.primaryGenreName || null,
      source: "iTunes",
    }));
  } catch (e) {
    console.warn("[SONG] iTunes:", e.message);
    return [];
  }
}

const REMIX_PATTERNS = /\b(remix|rmx|bootleg|flip|edit|mashup|rework)\b/i;
const LIVE_PATTERNS = /\b(live|concert|tour|at\s|session|unplugged|acoustic)\b/i;
const COVER_PATTERNS = /\b(cover|tribute|karaoke|instrumental|in the style)\b/i;
const OFFICIAL_PATTERNS = /\b(official\s?(audio|video|music\svideo|mv|lyric))\b/i;

function scoreTrack(track, rawQuery, normalizedQuery) {
  const name = track.name.toLowerCase();
  const artist = track.artist.toLowerCase();
  const combined = `${name} ${artist}`;
  const q = normalizedQuery;
  const qRaw = rawQuery.toLowerCase();
  let score = 0;
  if (name === q) score += 100;
  else if (name.startsWith(q)) score += 70;
  else if (name.includes(q)) score += 50;
  const qWords = q.split(/\s+/).filter(Boolean);
  score += (qWords.filter((w) => combined.includes(w)).length / Math.max(qWords.length, 1)) * 40;
  if (qRaw.includes(artist)) score += 30;
  else {
    const artistWords = artist.split(/[\s,]+/).filter((w) => w.length > 2);
    if (artistWords.some((w) => qRaw.includes(w))) score += 15;
  }
  if (track.popularity) score += track.popularity * 0.08;
  if (REMIX_PATTERNS.test(name) && !REMIX_PATTERNS.test(qRaw)) score -= 40;
  if (LIVE_PATTERNS.test(name) && !LIVE_PATTERNS.test(qRaw)) score -= 35;
  if (COVER_PATTERNS.test(name) && !COVER_PATTERNS.test(qRaw)) score -= 50;
  if (OFFICIAL_PATTERNS.test(qRaw) && OFFICIAL_PATTERNS.test(name)) score += 20;
  if (!/[(\[\-]/.test(track.name)) score += 10;
  return Math.max(0, score);
}

function rankTracks(tracks, rawQuery) {
  const normQ = normalizeCacheKey(rawQuery);
  return tracks.map((t) => ({ track: t, score: scoreTrack(t, rawQuery, normQ) })).sort((a, b) => b.score - a.score);
}

const CONFIDENCE_THRESHOLD = 55;

function durationToMs(str) {
  if (!str) return 0;
  const parts = str.split(":").map(Number);
  if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
  if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  return 0;
}

async function searchYouTube(query) {
  if (!ytsr) return null;
  try {
    const results = await ytsr(query, { limit: 10 });
    const video = results.items.find((v) => v.type === "video" && !v.isLive && v.duration && durationToMs(v.duration) <= 10 * 60 * 1000);
    if (!video) return null;
    return { id: video.id, title: video.title, url: video.url, duration: video.duration, channel: video.author?.name || "Unknown" };
  } catch (e) {
    console.warn("[SONG] YT:", e.message);
    return null;
  }
}

const MAX_CONCURRENT = 3;
const MAX_PER_USER = 2;
let activeDownloads = 0;
const downloadQueue = [];
const userJobCount = new Map();

function getQueueStatus() {
  return { active: activeDownloads, waiting: downloadQueue.length, slots: MAX_CONCURRENT - activeDownloads };
}

function enqueueDownload(userId, label, jobFn) {
  return new Promise((resolve, reject) => {
    if (!canDownload(userId)) return reject(new Error(`_Slow down. Wait ${DOWNLOAD_CD_MS / 1000}s._`));
    const userCount = userJobCount.get(userId) || 0;
    if (userCount >= MAX_PER_USER) return reject(new Error(`_You already have ${MAX_PER_USER} downloads queued._`));
    userJobCount.set(userId, userCount + 1);
    downloadQueue.push({ userId, label, jobFn, resolve, reject });
    drainQueue();
  });
}

function drainQueue() {
  while (activeDownloads < MAX_CONCURRENT && downloadQueue.length > 0) {
    const { userId, jobFn, resolve, reject } = downloadQueue.shift();
    activeDownloads++;
    jobFn().then(resolve).catch(reject).finally(() => {
      activeDownloads--;
      userJobCount.set(userId, Math.max(0, (userJobCount.get(userId) || 1) - 1));
      drainQueue();
    });
  }
}

function tmpFile(ext) {
  return path.join(os.tmpdir(), `paradox_song_${crypto.randomBytes(6).toString("hex")}.${ext}`);
}

function cleanup(...files) {
  for (const f of files) {
    try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch {}
  }
}

function shell(cmd, timeoutMs = 90000) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: timeoutMs }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr?.trim() || err.message));
      else resolve(stdout);
    });
  });
}

async function downloadAudio(youtubeUrl) {
  const outBase = tmpFile("out");
  const mp3Path = `${outBase}.mp3`;
  const cmd = ["yt-dlp", `"${youtubeUrl}"`, "-x", "--audio-format mp3", "--audio-quality 5", '--match-filter "duration < 600"', `--output "${outBase}.%(ext)s"`, "--no-playlist", "--quiet", "--no-warnings"].join(" ");
  await shell(cmd, 90000);
  if (!fs.existsSync(mp3Path)) throw new Error("Audio file not created");
  const { size } = fs.statSync(mp3Path);
  if (size > 64 * 1024 * 1024) { cleanup(mp3Path); throw new Error("File too large (>64MB)"); }
  return mp3Path;
}

const tasteProfiles = new Map();
const MAX_HISTORY = 50;
const PROFILE_TTL = 7 * 24 * 60 * 60 * 1000;

function getProfile(userId) {
  if (!tasteProfiles.has(userId)) tasteProfiles.set(userId, { plays: [], genreFreq: {}, artistFreq: {} });
  return tasteProfiles.get(userId);
}

function recordPlay(userId, track) {
  const profile = getProfile(userId);
  const entry = { name: track.name, artist: track.artist, genre: track.genre || "Unknown", ts: Date.now(), hour: new Date().getHours() };
  profile.plays.unshift(entry);
  if (profile.plays.length > MAX_HISTORY) profile.plays.pop();
  const g = entry.genre;
  const a = entry.artist.split(",")[0].trim();
  profile.genreFreq[g] = (profile.genreFreq[g] || 0) + 1;
  profile.artistFreq[a] = (profile.artistFreq[a] || 0) + 1;
}

async function resolveTrack(query) {
  const normKey = normalizeCacheKey(query);
  const cached = getCached(metaCache, normKey);
  if (cached) return { track: cached, confident: true, allRanked: null, fromCache: true };
  let results = await searchSpotifyMulti(query, 5);
  if (!results.length) results = await searchItunesMulti(query, 5);
  if (!results.length) return null;
  const ranked = rankTracks(results, query);
  const best = ranked[0];
  setCache(metaCache, normKey, best.track);
  return { track: best.track, score: best.score, confident: best.score >= CONFIDENCE_THRESHOLD, allRanked: ranked, fromCache: false };
}

async function resolveVideo(track) {
  const key = normalizeCacheKey(`${track.name} ${track.artist}`);
  const cached = getCached(ytCache, key);
  if (cached) return cached;
  const video = await searchYouTube(`${track.name} ${track.artist} official audio`);
  if (video) setCache(ytCache, key, video);
  return video;
}

async function fetchLyrics(artist, title) {
  const key = normalizeCacheKey(`${artist} ${title}`);
  const cached = getCached(lyricsCache, key);
  if (cached) return cached;
  try {
    const { data } = await safeGet(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    const lyrics = data.lyrics?.trim();
    if (!lyrics) return null;
    setCache(lyricsCache, key, lyrics);
    return lyrics;
  } catch { return null; }
}

function formatDuration(ms) {
  if (!ms) return "—";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(raw) {
  if (!raw) return "Unknown";
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return raw; }
}

function popularityBar(score) {
  if (score == null) return null;
  const fires = Math.min(5, Math.ceil(Math.min(score, 100) / 20));
  return `${"🔥".repeat(fires)}${"·".repeat(5 - fires)} (${score}/100)`;
}

function buildCard(track, video, mode = "song") {
  const pop = popularityBar(track.popularity);
  let card = `🎵 *${track.name}*\n\n`;
  card += `👤 *Artist:* ${track.artist}\n`;
  card += `💿 *Album:* ${track.album}\n`;
  card += `⏱️ *Duration:* ${formatDuration(track.duration_ms)}\n`;
  card += `📅 *Released:* ${formatDate(track.releaseDate)}\n`;
  if (pop) card += `⭐ *Popularity:* ${pop}\n`;
  if (track.genre) card += `🎼 *Genre:* ${track.genre}\n`;
  card += `📡 *Source:* ${track.source}\n`;
  if (video) card += `📺 *Via:* ${video.channel} (${video.duration})\n`;
  if (track.link) card += `\n🔗 ${track.link}\n`;
  if (mode === "song") {
    card += `\n_A fragment of the song… enough to pull you in._`;
    card += `\n_Type *.play ${track.name}* to hear it all._`;
  } else {
    card += `\n_Some songs don't ask permission. They just take over._`;
  }
  return card;
}

async function sendCard(sock, m, track, video, mode) {
  const card = buildCard(track, video, mode);
  if (track.image) {
    try {
      await sock.sendMessage(m.chat, { image: { url: track.image }, caption: card }, { quoted: m.raw });
      return;
    } catch {}
  }
  await m.reply(card);
}

async function sendAudioDownload(sock, m, track, video, userId, ptt = false) {
  if (!video) {
    await m.reply(`⚠️ *No YouTube match for "${track.name}"*`);
    return;
  }
  if (!ytdlpOk) {
    await m.reply(`⚠️ *Audio engine offline* (yt-dlp not installed)\n🔗 ${video.url}`);
    return;
  }
  const qs = getQueueStatus();
  await m.reply(qs.waiting > 0 ? `⏳ _${qs.waiting} download(s) ahead of you…_` : `⏳ _Pulling the audio…_`);
  let audioPath = null;
  try {
    audioPath = await enqueueDownload(userId, track.name, () => downloadAudio(video.url));
    await sock.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: "audio/mpeg", ptt }, { quoted: m.raw });
    recordPlay(userId, track);
  } catch (e) {
    await m.reply(`❌ *Download failed:* ${e.message}\n🔗 ${video.url}`);
  } finally {
    if (audioPath) cleanup(audioPath);
  }
}

setInterval(() => {
  const now = Date.now();
  for (const map of [metaCache, ytCache, lyricsCache]) {
    for (const [k, v] of map) if (now - v.ts > CACHE_TTL) map.delete(k);
  }
  for (const [k, v] of searchCooldowns) if (now - v > SEARCH_CD_MS * 10) searchCooldowns.delete(k);
  for (const [k, v] of downloadCooldowns) if (now - v > DOWNLOAD_CD_MS * 10) downloadCooldowns.delete(k);
  for (const [k, v] of tasteProfiles) {
    const lastPlay = v.plays?.[0]?.ts || 0;
    if (!v.plays.length || now - lastPlay > PROFILE_TTL) tasteProfiles.delete(k);
  }
}, 5 * 60 * 1000);

module.exports = {
  resolveTrack,
  resolveVideo,
  fetchLyrics,
  sendCard,
  sendAudioDownload,
  recordPlay,
  getProfile,
  getQueueStatus,
  userJobCount,
  isSearchOnCooldown,
  downloadQueue,
  MAX_PER_USER,
  MAX_CONCURRENT,
  SEARCH_CD_MS,
  ytdlpOk: () => ytdlpOk,
};
