const express = require("express");
const path = require("path");
const { requestPairingCode, getStatus } = require("../bot/connection");
const config = require("../config");

function createWebServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/api/status", (req, res) => {
    res.json(getStatus());
  });

  app.post("/api/pair", async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      const result = await requestPairingCode(phone);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to generate pairing code" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, bot: config.botName });
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  return app;
}

function startWebServer() {
  const app = createWebServer();
  const server = app.listen(config.webPort, config.webHost, () => {
    console.log(`Web dashboard → http://localhost:${config.webPort}`);
    console.log(`   Use the dashboard to get a pairing code (no QR needed).`);
  });
  return server;
}

module.exports = { createWebServer, startWebServer };
