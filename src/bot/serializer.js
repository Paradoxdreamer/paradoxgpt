/**
 * Normalize Baileys message into a clean object used by commands.
 */
function serialize(msg, sock) {
  if (!msg?.messages?.length) return null;

  const m = msg.messages[0];
  if (!m.message || m.key.fromMe) return null;

  const message =
    m.message.ephemeralMessage?.message ||
    m.message.viewOnceMessage?.message ||
    m.message.viewOnceMessageV2?.message ||
    m.message;

  const type = Object.keys(message || {})[0];
  const body =
    message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.imageMessage?.caption ||
    message?.videoMessage?.caption ||
    message?.buttonsResponseMessage?.selectedButtonId ||
    message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    "";

  const chat = m.key.remoteJid;
  const isGroup = chat?.endsWith("@g.us");
  const sender = isGroup ? m.key.participant || m.participant : chat;
  const pushName = m.pushName || "Unknown";

  const config = require("../config");
  const prefix = config.prefix;
  let command = null;
  let args = [];
  let text = body.trim();

  if (text.startsWith(prefix)) {
    const parts = text.slice(prefix.length).trim().split(/\s+/);
    command = parts.shift()?.toLowerCase() || null;
    args = parts;
    text = parts.join(" ");
  }

  const mentionedJid =
    message?.extendedTextMessage?.contextInfo?.mentionedJid ||
    (message?.extendedTextMessage?.contextInfo?.participant
      ? [message.extendedTextMessage.contextInfo.participant]
      : []);

  const quoted =
    message?.extendedTextMessage?.contextInfo?.quotedMessage || null;

  return {
    key: m.key,
    chat,
    from: chat,
    sender,
    pushName,
    isGroup,
    body,
    text,
    command,
    args,
    mentionedJid,
    quoted,
    type,
    message,
    raw: m,
    reply: async (content, options = {}) => {
      return sock.sendMessage(
        chat,
        typeof content === "string" ? { text: content } : content,
        { quoted: m, ...options }
      );
    },
    react: async (emoji) => {
      try {
        await sock.sendMessage(chat, {
          react: { text: emoji, key: m.key },
        });
      } catch (_) {}
    },
  };
}

module.exports = { serialize };
