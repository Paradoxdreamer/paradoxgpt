module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const base = (process.env.BOT_API_URL || "").replace(/\/$/, "");
  if (!base) {
    res.status(503).json({
      error: "BOT_API_URL not configured on Vercel",
      status: "error",
    });
    return;
  }

  try {
    const headers = { Accept: "application/json" };
    if (process.env.PAIR_API_SECRET) {
      headers["X-Pair-Secret"] = process.env.PAIR_API_SECRET;
    }

    const r = await fetch(`${base}/api/status`, {
      headers,
      cache: "no-store",
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({
      error: "Bot host unreachable: " + e.message,
      status: "error",
    });
  }
};
