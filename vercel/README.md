# ParadoxGPT — Vercel Dashboard

Static pairing UI on Vercel. The **bot process stays on a VPS/Railway**; this site only proxies status + pairing requests.

## Setup

1. Deploy the **bot** somewhere always-on (`npm start` or Docker). Note its public URL, e.g. `https://bot.yourdomain.com`.

2. On the bot host `.env`:
   ```env
   PAIR_API_SECRET=long-random-string
   CORS_ORIGINS=https://your-dashboard.vercel.app
   WEB_PORT=3000
   ```

3. Deploy this `vercel/` folder to Vercel (Root Directory = `vercel`).

4. Vercel env vars:
   - `BOT_API_URL` = `https://bot.yourdomain.com`
   - `PAIR_API_SECRET` = same secret as the bot

5. Open the Vercel URL → Online/Offline → generate pairing code.

## Flow

```
Browser → Vercel /api/status|/api/pair → BOT_API_URL/api/* → Baileys
```
