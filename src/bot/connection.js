const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const path = require("path");
const fs = require("fs-extra");
const config = require("../config");
const { handleMessage } = require("./handler");

let sock = null;
let pairingCode = null;
let connectionStatus = "disconnected";
let lastQR = null;

const logger = pino({ level: "silent" });

async function startBot() {
  await fs.ensureDir(config.sessionDir);

  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: [config.botName, "Chrome", "2.0.0"],
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    markOnlineOnConnect: true,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      lastQR = qr;
      connectionStatus = "connecting";
      console.log("QR available (fallback). Prefer pairing code via web dashboard.");
    }

    if (connection === "open") {
      connectionStatus = "open";
      pairingCode = null;
      lastQR = null;
      console.log(`${config.botName} connected as ${sock.user?.id}`);
    }

    if (connection === "close") {
      connectionStatus = "close";
      const statusCode = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output?.statusCode
        : 0;

      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(`Connection closed (code: ${statusCode}). Reconnect: ${shouldReconnect}`);

      if (shouldReconnect) {
        setTimeout(() => startBot(), 3000);
      } else {
        console.log("Logged out. Delete session folder and pair again.");
        try {
          await fs.emptyDir(config.sessionDir);
        } catch {}
      }
    }
  });

  sock.ev.on("messages.upsert", async (msg) => {
    try {
      await handleMessage(sock, msg);
    } catch (err) {
      console.error("Message handler error:", err);
    }
  });

  sock.ev.on("group-participants.update", async (update) => {
    try {
      const { id, participants, action } = update;
      if (!id || !participants?.length) return;

      if (action === "add") {
        const welcome = require("../commands/welcome");
        const data = await welcome.loadWelcome();
        if (data.enabled?.[id]) {
          const template =
            data.messages?.[id] || "Welcome @user to the group!";
          for (const user of participants) {
            const text = template.replace(/@user/gi, `@${user.split("@")[0]}`);
            await sock.sendMessage(id, { text, mentions: [user] });
          }
        }
      }

      if (action === "remove") {
        const leave = require("../commands/leave");
        const data = await leave.loadLeave();
        if (data.enabled?.[id]) {
          const template =
            data.messages?.[id] || "Goodbye @user.";
          for (const user of participants) {
            const text = template.replace(/@user/gi, `@${user.split("@")[0]}`);
            await sock.sendMessage(id, { text, mentions: [user] });
          }
        }
      }
    } catch (err) {
      console.error("group-participants.update error:", err.message);
    }
  });

  return sock;
}

async function requestPairingCode(phoneNumber) {
  if (!sock) throw new Error("Bot not started yet");

  const cleaned = phoneNumber.replace(/\D/g, "");
  if (cleaned.length < 10 || cleaned.length > 15) {
    throw new Error("Invalid phone number. Use country code + number (no + or spaces).");
  }

  if (sock.authState.creds.registered) {
    return { alreadyConnected: true, message: "Bot is already linked to a WhatsApp account." };
  }

  try {
    const code = await sock.requestPairingCode(cleaned);
    pairingCode = code;
    connectionStatus = "connecting";
    console.log(`Pairing code generated for ${cleaned}: ${code}`);
    return { code, phone: cleaned };
  } catch (err) {
    console.error("Pairing code error:", err);
    throw new Error(err.message || "Failed to generate pairing code");
  }
}

function getStatus() {
  return {
    status: connectionStatus,
    pairingCode,
    user: sock?.user || null,
    registered: !!sock?.authState?.creds?.registered,
  };
}

function getSocket() {
  return sock;
}

module.exports = {
  startBot,
  requestPairingCode,
  getStatus,
  getSocket,
};
