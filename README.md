# ParadoxGPT v2

A clean, modern rebuild of ParadoxGPT — personality-driven WhatsApp AI bot.

**No QR codes.** Connect with an **8-digit pairing code** from the web dashboard.

Stack: [Baileys](https://github.com/WhiskeySockets/Baileys) · Google Gemini · Express

---

## Features

- Web pairing dashboard (phone number → pairing code)
- Dual personality: `normal` / `chaotic`
- Gemini AI replies (mention bot or end with `?`)
- Modular commands + **hot-reload** (edit commands without restart)
- Anti-spam, permanent ban, warn system
- Welcome / leave messages
- Anti-link
- View-once breaker (`.see`)
- Sticker converter, tagall, roast, profile, etc.
- Docker-ready

---

## Quick Start

### 1. Configure

```bash
cp .env.example .env
```

Edit `.env`:

```env
BOT_NAME=ParadoxGPT
OWNER_NUMBER=2348012345678
GEMINI_API_KEY=your_key_here
WEB_PORT=3000
COMMAND_PREFIX=.
```

### 2. Run (Node)

```bash
npm install
npm start
```

Open **http://localhost:3000**

### 3. Or run with Docker

```bash
docker compose up -d --build
```

Dashboard still at **http://localhost:3000**

### 4. Link WhatsApp

1. Enter phone number (country code + number, no `+`)
2. Generate code
3. Phone → WhatsApp → Linked Devices → **Link with phone number instead**
4. Type the code → connected

---

## Commands

| Command | Description |
|---------|-------------|
| `.menu` | Show commands |
| `.ping` | Latency |
| `.mode` | `normal` / `chaotic` |
| `.ask` | Ask Gemini |
| `.roast @user` | AI roast |
| `.s` | Reply to media → sticker |
| `.see` | Reveal view-once media |
| `.tagall` | Mention everyone |
| `.profile` | View profile / XP |
| `.welcome on/off` | Toggle welcome |
| `.setwelcome` | Custom welcome (`@user` required) |
| `.leave on/off` | Toggle leave |
| `.setleave` | Custom leave |
| `.antilink on/off` | Auto-delete links |
| `.warn @user` | Warn (3 → ban) |
| `.resetwarn @user` | Reset warns (owner) |
| `.ban` / `.unban` | Ban system (owner) |

---

## Project Structure

```
paradoxgpt/
├── src/
│   ├── index.js
│   ├── config.js
│   ├── bot/          # connection, handler, serializer
│   ├── ai/           # Gemini + modes
│   ├── commands/     # one file per command (hot-reloaded)
│   └── web/          # pairing dashboard
├── data/             # session + JSON stores
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## Hot-reload

Commands in `src/commands/` are reloaded every 5 seconds.  
Edit a command file → save → it is picked up automatically (no restart needed for command logic).

---

## Docker notes

- Session and data persist in `./data`
- Put secrets only in `.env` (never commit it)
- Rebuild after dependency changes: `docker compose up -d --build`

---

## License

MIT

**ParadoxGPT v2** — pairing-code first, clean architecture, ready to extend.
