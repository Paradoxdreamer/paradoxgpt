const QRCode = require("qrcode");

module.exports = {
  name: "qr",
  description: "Generate a QR code from text",
  async execute({ sock, m, args }) {
    const text = args.join(" ").trim();
    if (!text) return m.reply("Usage: .qr <text or url>");
    try {
      const buffer = await QRCode.toBuffer(text, {
        type: "png",
        width: 400,
        margin: 2,
        errorCorrectionLevel: "M",
      });
      await sock.sendMessage(
        m.chat,
        { image: buffer, caption: `QR for:\n${text.slice(0, 200)}` },
        { quoted: m.raw }
      );
    } catch (err) {
      await m.reply("QR generation failed: " + err.message);
    }
  },
};
