const engine = require("../../lib/songEngine");

module.exports = {
  name: "queue",
  category: "media",
  description: "Music download queue status",
  async execute({ m }) {
    const userId = m.sender.replace("@s.whatsapp.net", "");
    const qs = engine.getQueueStatus();
    const userJobs = engine.userJobCount.get(userId) || 0;
    const qList =
      engine.downloadQueue.map((j, i) => `  ${i + 1}. ${j.label}`).join("\n") || "  _empty_";
    await m.reply(
      `📥 *Download Queue*\n\n` +
        `Active: *${qs.active}/${engine.MAX_CONCURRENT}*\n` +
        `Waiting: *${qs.waiting}*\n` +
        `Your jobs: *${userJobs}/${engine.MAX_PER_USER}*\n\n` +
        `*Queue:*\n${qList}`
    );
  },
};
