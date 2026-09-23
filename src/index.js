/**
 * ParadoxGPT v2
 * Clean architecture - Web pairing codes - Gemini personality
 */
const { startBot } = require("./bot/connection");
const { loadCommands, startHotReload } = require("./bot/handler");
const { startWebServer } = require("./web/server");
const config = require("./config");
const fs = require("fs-extra");

async function main() {
  console.log("ParadoxGPT v2.0 - Personality · Pairing · Gemini");

  await fs.ensureDir(config.dataDir);
  await fs.ensureDir(config.sessionDir);

  startWebServer();
  await loadCommands();
  startHotReload(5000);
  await startBot();

  console.log(`Prefix: ${config.prefix}`);
  console.log(`Owner : ${config.ownerNumber || "(not set)"}`);
  console.log("Ready. Open the web dashboard to link WhatsApp with a pairing code.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
