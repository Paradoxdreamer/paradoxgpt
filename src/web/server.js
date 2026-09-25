const express = require("express");
const path = require("path");
const { requestPairingCode, getStatus } = require("../bot/connection");
const config = require("../config");

function applyCors(req, res, next) {
  const origins = config.corsOrigins || ["*"];
  const origin = req.headers.origin;
  const allowAll = origins.includes("*");

  if (allowAll) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else if (origin && origins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Pair-Secret"
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
}

function requirePairSecret(req, res, next) {
  const secret = config.pairApiSecret;
  if (!secret) return next();

  const header =
    req.headers["x-pair-secret"] ||
    (req.headers.authorization || "").replace(/^Bearer\s+/i, "");

  if (header !== secret) {
    return res.status(401).json({ error: "Unauthorized — invalid API secret" });
  }
  next();
}

function createWebServer() {
  const app = express();

  app.use(applyCors);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/api/health", (req, res) => {
    const st = getStatus();
    res.json({
      ok: true,
      bot: config.botName,
      online: st.status === "open" || !!st.registered,
      status: st.status,
    });
  });

  app.get("/api/status", requirePairSecret, (req, res) => {
    res.json(getStatus());
  });

  app.post("/api/pair", requirePairSecret, async (req, res) => {
    try {
      const { phone } = req.body || {};
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }
      const result = await requestPairingCode(phone);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: err.message || "Failed to generate pairing code",
      });
    }
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  return app;
}

function startWebServer() {
  const app = createWebServer();
  const server = app.listen(config.webPort, config.webHost, () => {
    console.log(`Bot API + dashboard → http://localhost:${config.webPort}`);
    console.log(`CORS: ${(config.corsOrigins || ["*"]).join(", ")}`);
    console.log(
      config.pairApiSecret
        ? "Pair API secret: ENABLED"
        : "Pair API secret: off (set PAIR_API_SECRET to lock)"
    );
  });
  return server;
}

module.exports = { createWebServer, startWebServer };
