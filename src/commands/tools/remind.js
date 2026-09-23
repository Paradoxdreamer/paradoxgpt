const timers = new Map();

function parseDuration(str) {
  const m = /^(\d+)\s*(s|m|h|sec|min|mins|hour|hours)?$/i.exec(str.trim());
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const u = (m[2] || "m").toLowerCase();
  if (u.startsWith("s")) return n * 1000;
  if (u.startsWith("h")) return n * 3600 * 1000;
  return n * 60 * 1000;
}

module.exports = {
  name: "remind",
  description: "Set a reminder (.remind 10m message)",
  async execute({ sock, m, args }) {
    if (args.length < 2) {
      return m.reply("Usage: .remind <time> <message>\nExamples: .remind 5m check oven");
    }
    const ms = parseDuration(args[0]);
    if (!ms || ms < 5000 || ms > 24 * 3600 * 1000) {
      return m.reply("Time must be between 5s and 24h. Use: 30s, 10m, 2h");
    }
    const message = args.slice(1).join(" ");
    const when = new Date(Date.now() + ms).toLocaleTimeString();
    await m.reply(`Reminder set for *${args[0]}* (around ${when}).`);
    const key = `${m.chat}:${Date.now()}`;
    const t = setTimeout(async () => {
      timers.delete(key);
      try {
        await sock.sendMessage(m.chat, {
          text: `*Reminder*\n@${m.sender.split("@")[0]}\n\n${message}`,
          mentions: [m.sender],
        });
      } catch {}
    }, ms);
    timers.set(key, t);
  },
};
