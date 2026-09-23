const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "s",
  description: "Convert image/video to sticker (reply to media)",
  async execute({ sock, m }) {
    const quoted = m.quoted;
    if (!quoted || (!quoted.imageMessage && !quoted.videoMessage)) {
      return m.reply("Reply to an image or short video with .s");
    }

    try {
      const buffer = await downloadMediaMessage(
        { message: quoted, key: m.key },
        "buffer",
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      await sock.sendMessage(m.chat, { sticker: buffer }, { quoted: m.raw });
    } catch (err) {
      console.error("Sticker error:", err);
      await m.reply("Failed to create sticker.");
    }
  },
};
