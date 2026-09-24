const path = require("path");
const fs = require("fs-extra");
const { serialize } = require("./serializer");
const config = require("../config");
const { askGemini } = require("../ai/omega");
const settings = require("../lib/botSettings");

const cooldowns = new Map();
const spamCounter = new Map();
const tempBans = new Map();

let commands = {};
const BAN_FILE = path.join(config.dataDir, "banList.json");

async function isPermanentlyBanned(jid) {
  try {
    const data = await fs.readJson(BAN_FILE).catch(() => ({ banned: [] }));
    return (data.banned || []).includes(jid);
  } catch {
    return false;
  }
}

async function loadCommands() {
  const root = path.join(__dirname, "../commands");
  await fs.ensureDir(root);

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const out = [];
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...(await walk(full)));
      else if (e.isFile() && e.name.endsWith(".js")) out.push(full);
    }
    return out;
  }

  const files = await walk(root);
  const loaded = {};

  for (const file of files) {
    try {
      delete require.cache[require.resolve(file)];
      const cmd = require(file);
      if (cmd?.name) {
        const cat = path.basename(path.dirname(file));
        if (cat !== "commands") cmd.category = cmd.category || cat;
        loaded[cmd.name] = cmd;
        const aliases = cmd.aliases || cmd.alias || [];
        const list = Array.isArray(aliases) ? aliases : [aliases];
        for (const a of list) {
          if (a && typeof a === "string") loaded[a.toLowerCase()] = cmd;
        }
      }
    } catch (err) {
      console.error(`Failed to load command ${path.relative(root, file)}:`, err.message);
    }
  }

  commands = loaded;
  const byCat = {};
  for (const c of Object.values(loaded)) {
    const k = c.category || "misc";
    byCat[k] = (byCat[k] || 0) + 1;
  }
  console.log(`Loaded ${Object.keys(commands).length} commands:`, byCat);
  return commands;
}

function isOwner(jid) {
  return settings.isOwner(jid);
}

function isTempBanned(sender) {
  const until = tempBans.get(sender);
  if (!until) return false;
  if (Date.now() > until) {
    tempBans.delete(sender);
    return false;
  }
  return true;
}

function isChatTrigger(m, sock) {
  const body = (m.body || "").trim();
  if (!body) return false;

  const botId = sock.user?.id?.split(":")[0] || "";
  const botNum = botId.replace(/\D/g, "");

  if (m.mentionedJid?.some((j) => j.includes(botId) || j.replace(/\D/g, "").endsWith(botNum))) {
    return true;
  }
  if (botNum && body.replace(/\D/g, "").includes(botNum)) return true;
  if (/\bparadoxgpt\b/i.test(body) || /\bparadox\b/i.test(body)) return true;
  if (body.endsWith("?") && body.length > 3 && body.length < 200) return true;
  return false;
}

function stripTriggerNoise(text) {
  return (
    text
      .replace(/@\d+/g, "")
      .replace(/\bparadoxgpt\b/gi, "")
      .replace(/\bparadox\b/gi, "")
      .trim() || text
  );
}

async function handleMessage(sock, rawMsg) {
  const m = serialize(rawMsg, sock);
  if (!m) return;

  if ((await isPermanentlyBanned(m.sender)) || isTempBanned(m.sender)) return;

  if (isOwner(m.sender) && m.body && !m.command) {
    try {
      if (await settings.isAutoMode()) await settings.pushStyleSample(m.body);
    } catch (_) {}
  }

  try {
    const afk = require("../commands/general/afk");
    if (typeof afk.checkAfkMention === "function") await afk.checkAfkMention(sock, m);
  } catch (_) {}

  const now = Date.now();
  const last = cooldowns.get(m.sender) || 0;
  if (now - last < config.cooldownMs) {
    const count = (spamCounter.get(m.sender) || 0) + 1;
    spamCounter.set(m.sender, count);
    if (count >= config.spamLimit) {
      tempBans.set(m.sender, now + config.banDurationMs);
      spamCounter.set(m.sender, 0);
      await m.reply(`🚫 @${m.sender.split("@")[0]} auto-muted for spamming.`, {
        mentions: [m.sender],
      });
    }
    return;
  }
  cooldowns.set(m.sender, now);
  spamCounter.set(m.sender, 0);

  const allowed = await settings.canUseBot(m.sender, sock);
  if (!allowed) {
    if (m.command) await m.reply("🔒 Bot is in *private* mode. Only owners can use it.");
    return;
  }

  if (m.isGroup && m.body) {
    try {
      const antilink = require("../commands/anti/antilink");
      if (typeof antilink.isAntiLinkEnabled === "function") {
        const enabled = await antilink.isAntiLinkEnabled(m.chat);
        if (enabled) {
          const linkRegex =
            /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(chat\.whatsapp\.com\/[^\s]+)/gi;
          if (linkRegex.test(m.body) && !isOwner(m.sender)) {
            await sock.sendMessage(m.chat, { delete: m.key });
            await m.reply("🔗 Link removed by ParadoxGPT anti-link.");
            return;
          }
        }
      }
    } catch (_) {}
  }

  if (m.command && commands[m.command]) {
    const cmd = commands[m.command];
    if (cmd.ownerOnly && !isOwner(m.sender)) {
      return m.reply("🚫 Only the Paradox Master can use this.");
    }
    if (cmd.groupOnly && !m.isGroup) {
      return m.reply("This command only works in groups.");
    }
    try {
      await cmd.execute({
        sock,
        m,
        args: m.args,
        commands,
        isOwner: isOwner(m.sender),
      });
    } catch (err) {
      console.error(`Command ${m.command} error:`, err);
      await m.reply("Something went wrong while executing that command.");
    }
    return;
  }

  if (!m.command && isChatTrigger(m, sock) && (m.body || "").length > 1) {
    const prompt = stripTriggerNoise(m.body);
    const style = await settings.getStylePrompt();
    const reply = await askGemini(prompt, style ? { systemOverride: style } : {});
    await m.reply(reply);
  }
}

function startHotReload(intervalMs = 4000) {
  setInterval(async () => {
    try {
      await loadCommands();
    } catch (err) {
      console.error("Hot-reload error:", err.message);
    }
  }, intervalMs);
  console.log(`Command hot-reload active (every ${intervalMs / 1000}s)`);
}

module.exports = {
  handleMessage,
  loadCommands,
  startHotReload,
  getCommands: () => commands,
};
