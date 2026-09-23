const { loadChannels, saveChannels } = require("../commands/channel");
const config = require("../config");

const INTERVAL_MS = 6 * 60 * 60 * 1000;
let timer = null;

function startAutoPost(getSocket) {
  if (timer) return;
  timer = setInterval(async () => {
    try {
      const sock = getSocket();
      if (!sock) return;
      const data = await loadChannels();
      const now = Date.now();

      for (const [jid, ch] of Object.entries(data.channels || {})) {
        if (!ch.autoPost) continue;
        if (ch.lastPost && now - ch.lastPost < INTERVAL_MS - 60000) continue;

        const text =
          ch.template ||
          `*Auto post*\n\nScheduled update from ${config.botName}.\n_${new Date().toUTCString()}_`;

        await sock.sendMessage(jid, { text });
        ch.lastPost = now;
      }
      await saveChannels(data);
    } catch (err) {
      console.error("autopost error:", err.message);
    }
  }, 15 * 60 * 1000);

  console.log("Channel auto-post scheduler started");
}

module.exports = { startAutoPost };
