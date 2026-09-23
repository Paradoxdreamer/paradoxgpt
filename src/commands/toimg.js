const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "toimg",
  description: "Convert sticker to image (reply to sticker)",
  async execute({ sock, m }) {
    const quoted = m.quoted;
    if (!quoted?.stickerMessage) {
      return m.reply("Reply to a *sticker* with .toimg");
    }
    try {
      const buffer = await downloadMediaMessage(
        { message: quoted, key: m.key },
        "buffer",
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );
      await sock.sendMessage(
        m.chat,
        { image: buffer, caption: "Sticker → Image" },
        { quoted: m.raw }
      );
    } catch (err) {
      await m.reply("Conversion failed: " + err.message);
    }
  },
};
