/**
 * ParadoxGPT v2
 * Clean architecture · Web pairing codes · Personality
 */
const { startBot, getSocket } = require("./bot/connection");
const { loadCommands, startHotReload } = require("./bot/handler");
const { startWebServer } = require("./web/server");
const config = require("./config");
const fs = require("fs-extra");

async function main() {
  console.log(`
╔══════════════════════════════════════╗
║         ParadoxGPT v2.0              ║
║   Personality · Pairing · AI         ║
╚══════════════════════════════════════╝
`);

  await fs.ensureDir(config.dataDir);
  await fs.ensureDir(config.sessionDir);

  startWebServer();

  await loadCommands();
  startHotReload(5000);

  await startBot();

  try {
    const { startAutoPost } = require("./services/autopost");
    startAutoPost(getSocket);
  } catch (err) {
    console.warn("Autopost service not started:", err.message);
  }

  console.log(`Prefix: ${config.prefix}`);
  console.log(`Owners: ${config.lockedOwners.join(", ")} (locked)`);
  console.log("Ready. Open the web dashboard to link WhatsApp with a pairing code.\n");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
