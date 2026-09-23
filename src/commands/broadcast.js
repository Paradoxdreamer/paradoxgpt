/**
 * Owner-only: broadcast a message to all groups the bot is in.
 * Usage: .broadcast Hello everyone
 *        .broadcast (reply to a message)
 */
module.exports = {
  name: "broadcast",
  description: "Send a message to all groups (owner)",
  ownerOnly: true,
  async execute({ sock, m, args }) {
    let text = args.join(" ").trim();

    if (!text && m.quoted) {
      text =
        m.quoted.conversation ||
        m.quoted.extendedTextMessage?.text ||
        m.quoted.imageMessage?.caption ||
        "";
    }

    if (!text) {
      return m.reply("Usage: .broadcast <message>\nOr reply to a message with .broadcast");
    }

    await m.reply("Broadcasting…");

    let groups = [];
    try {
      const all = await sock.groupFetchAllParticipating();
      groups = Object.values(all || {});
    } catch (err) {
      return m.reply("Failed to fetch groups: " + err.message);
    }

    let ok = 0;
    let fail = 0;
    const payload = {
      text: `Broadcast\n\n${text}\n\n_— ${require("../config").botName}_`,
    };

    for (const g of groups) {
      try {
        await sock.sendMessage(g.id, payload);
        ok++;
        await new Promise((r) => setTimeout(r, 600));
      } catch {
        fail++;
      }
    }

    await m.reply(`Broadcast done.\nSent: ${ok}\nFailed: ${fail}\nGroups: ${groups.length}`);
  },
};
