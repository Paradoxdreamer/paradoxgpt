const path = require("path");
const fs = require("fs-extra");
const { serialize } = require("./serializer");
const config = require("../config");
const { askGemini } = require("../ai/gemini");

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
  const dir = path.join(__dirname, "../commands");
  await fs.ensureDir(dir);
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".js"));

  const loaded = {};
  for (const file of files) {
    try {
      delete require.cache[require.resolve(path.join(dir, file))];
      const cmd = require(path.join(dir, file));
      if (cmd?.name) {
        loaded[cmd.name] = cmd;
      }
    } catch (err) {
      console.error(`Failed to load command ${file}:`, err.message);
    }
  }
  commands = loaded;
  console.log(`Loaded ${Object.keys(commands).length} commands`);
  return commands;
}

function isOwner(jid) {
  if (!config.ownerNumber) return false;
  const num = jid.replace(/\D/g, "");
  return num.endsWith(config.ownerNumber) || num === config.ownerNumber;
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

async function handleMessage(sock, rawMsg) {
  const m = serialize(rawMsg, sock);
  if (!m) return;

  if (await isPermanentlyBanned(m.sender) || isTempBanned(m.sender)) return;

  try {
    const afk = require("../commands/afk");
    if (typeof afk.checkAfkMention === "function") {
      await afk.checkAfkMention(sock, m);
    }
  } catch (_) {}

  const now = Date.now();
  const last = cooldowns.get(m.sender) || 0;
  if (now - last < config.cooldownMs) {
    const count = (spamCounter.get(m.sender) || 0) + 1;
    spamCounter.set(m.sender, count);
    if (count >= config.spamLimit) {
      tempBans.set(m.sender, now + config.banDurationMs);
      spamCounter.set(m.sender, 0);
      await m.reply(`@${m.sender.split("@")[0]} auto-muted for spamming.`, {
        mentions: [m.sender],
      });
    }
    return;
  }
  cooldowns.set(m.sender, now);
  spamCounter.set(m.sender, 0);

  if (m.isGroup && m.body) {
    try {
      const antilink = require("../commands/antilink");
      if (typeof antilink.isAntiLinkEnabled === "function") {
        const enabled = await antilink.isAntiLinkEnabled(m.chat);
        if (enabled) {
          const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(chat\.whatsapp\.com\/[^\s]+)/gi;
          if (linkRegex.test(m.body) && !isOwner(m.sender)) {
            await sock.sendMessage(m.chat, { delete: m.key });
            await m.reply("Link removed by ParadoxGPT anti-link.");
            return;
          }
        }
      }
    } catch (_) {}
  }

  if (m.command && commands[m.command]) {
    const cmd = commands[m.command];

    if (cmd.ownerOnly && !isOwner(m.sender)) {
      return m.reply("Only the Paradox Master can use this.");
    }

    if (cmd.groupOnly && !m.isGroup) {
      return m.reply("This command only works in groups.");
    }

    try {
      await cmd.execute({ sock, m, args: m.args, commands, isOwner: isOwner(m.sender) });
    } catch (err) {
      console.error(`Command ${m.command} error:`, err);
      await m.reply("Something went wrong while executing that command.");
    }
    return;
  }

  const mentionedBot = m.mentionedJid?.some((j) => j.includes(sock.user?.id?.split(":")[0]));
  const isQuestion = m.body.trim().endsWith("?");

  if ((mentionedBot || isQuestion) && m.body.length > 2) {
    const reply = await askGemini(m.body);
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
