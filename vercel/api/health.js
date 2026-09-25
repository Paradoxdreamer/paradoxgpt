module.exports = async function handler(req, res) {
  const base = (process.env.BOT_API_URL || "").replace(/\/$/, "");
  if (!base) {
    res.status(503).json({ ok: false, error: "BOT_API_URL missing" });
    return;
  }
  try {
    const r = await fetch(`${base}/api/health`, { cache: "no-store" });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
};
