const { downloadMediaMessage, getContentType } = require("@whiskeysockets/baileys");

module.exports = {
  name: "see",
  description: "Reveal view-once image/video (reply to it)",
  async execute({ sock, m }) {
    const quoted = m.quoted;
    if (!quoted) {
      return m.reply("Reply to a *view-once* image or video with .see");
    }

    const viewOnce =
      quoted.viewOnceMessage?.message ||
      quoted.viewOnceMessageV2?.message ||
      quoted.viewOnceMessageV2Extension?.message;

    if (!viewOnce) {
      return m.reply("That doesn't look like a view-once message. Reply to one.");
    }

    try {
      const type = getContentType(viewOnce);
      const buffer = await downloadMediaMessage(
        { message: viewOnce, key: m.key },
        "buffer",
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const payload = { [type]: buffer };
      if (viewOnce[type]?.caption) payload.caption = viewOnce[type].caption;

      await sock.sendMessage(m.chat, payload, { quoted: m.raw });
    } catch (err) {
      console.error("see error:", err);
      await m.reply("Failed to reveal the view-once media.");
    }
  },
};
