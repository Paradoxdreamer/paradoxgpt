const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "s",
  description: "Convert image/video to sticker",
  async execute({ sock, m }) {
    const msg = m.quoted || m.message;
    const type = Object.keys(msg || {}).find((k) =>
      ["imageMessage", "videoMessage"].includes(k)
    );
    if (!type && !m.quoted) {
      return m.reply("Send or reply to an image/video with .s");
    }
    try {
      const buffer = await downloadMediaMessage(
        m.quoted ? { message: m.quoted, key: m.key } : m.raw,
        "buffer",
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );
      await sock.sendMessage(m.chat, { sticker: buffer }, { quoted: m.raw });
    } catch (err) {
      await m.reply("Sticker failed: " + err.message);
    }
  },
};
