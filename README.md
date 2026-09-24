<p align="center">
  <img src="assets/gallery/IMG_7776.jpeg" width="480" alt="ParadoxGPT"/>
</p>

<h1 align="center">ParadoxGPT</h1>

<p align="center">
  <em>Crafted from silence and sunless skies.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/WhatsApp-Baileys-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Baileys"/>
  <img src="https://img.shields.io/badge/AI-OmegaTech%20%2B%20Qwen-7C3AED?style=for-the-badge" alt="AI"/>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT"/>
</p>

<p align="center">
  Personality-driven WhatsApp bot · Web pairing · Modular commands · Media downloaders · Gothic menu
</p>

---

<p align="center">
  <img src="assets/gallery/IMG_7554.jpeg" width="140" alt=""/>
  <img src="assets/gallery/IMG_7529.jpeg" width="140" alt=""/>
  <img src="assets/gallery/IMG_7528.jpeg" width="140" alt=""/>
  <img src="assets/gallery/IMG_7538.jpeg" width="140" alt=""/>
</p>
<p align="center">
  <img src="assets/gallery/IMG_7551.jpeg" width="140" alt=""/>
  <img src="assets/gallery/IMG_7527.jpeg" width="140" alt=""/>
  <img src="assets/gallery/IMG_7526.jpeg" width="140" alt=""/>
  <img src="assets/gallery/IMG_7558.jpeg" width="140" alt=""/>
</p>
<p align="center">
  <img src="assets/gallery/IMG_7541.jpeg" width="140" alt=""/>
  <img src="assets/gallery/IMG_7548.jpeg" width="140" alt=""/>
  <img src="assets/gallery/IMG_7776.jpeg" width="140" alt=""/>
</p>

---

## Overview

| Feature | Detail |
|--------|--------|
| **Pairing** | Web dashboard pairing codes (no QR required) |
| **AI** | OmegaTech Qwen primary → GPT-4-mini fallback |
| **Downloaders** | YouTube (play / mp3 / mp4), TikTok, Instagram, generic media |
| **Commands** | Category folders with hot-reload |
| **Menu** | Image carousel, gothic footer, editable bio / handles / channel |
| **Docker** | `Dockerfile` + `docker-compose.yml` |

---

## Quick start

```bash
git clone https://github.com/Paradoxdreamer/paradoxgpt.git
cd paradoxgpt
cp .env.example .env
# set OWNER_NUMBER=234xxxxxxxxxx
npm install
npm start
```

Open **http://localhost:3000** → enter your number → **8-digit pairing code** → WhatsApp → Linked devices → Link with phone number.

```bash
docker compose up -d --build
```

---

## Download commands

Prefix defaults to `.`

| Command | Usage | Description |
|---------|--------|-------------|
| `.play` | `.play never gonna give you up` | Search YouTube → send MP3 |
| `.play` | `.play <youtube-url>` | YouTube URL → MP3 |
| `.ytmp3` | `.ytmp3 https://youtube.com/watch?v=...` | YouTube → MP3 |
| `.ytmp4` | `.ytmp4 https://youtube.com/watch?v=...` | YouTube → MP4 video |
| `.tiktok` | `.tiktok https://www.tiktok.com/@user/video/...` | TikTok video (no watermark when available) |
| `.ig` | `.ig https://www.instagram.com/p/...` | Instagram post / reel (photo or video) |
| `.media` | `.media <url>` | Direct image/video/audio URL, or hints for social |
| `.sticker` | reply to image/video | Convert media to sticker |
| `.toimg` | reply to sticker | Sticker → image |
| `.see` | reply to view-once | Reveal view-once image/video |
| `.qr` | `.qr text here` | Generate QR code image |

### Examples

```text
.play lo-fi hip hop radio
.ytmp3 https://youtu.be/dQw4w9WgXcQ
.ytmp4 https://www.youtube.com/watch?v=dQw4w9WgXcQ
.tiktok https://www.tiktok.com/@user/video/1234567890
.ig https://www.instagram.com/reel/XXXX/
.media https://example.com/clip.mp4
```

> Download APIs are third-party and can go down or rate-limit. If one fails, retry later or use another command.

---

## Full command list

### AI
| Command | Description |
|---------|-------------|
| `.ask <text>` | Chat with OmegaTech AI (Qwen → GPT-4-mini) |
| `.mode normal\|chaotic` | Switch AI personality |
| `.roast [@user\|text]` | Generate a roast |

### Media & download
| Command | Description |
|---------|-------------|
| `.play` | YouTube search / audio download |
| `.ytmp3` | YouTube → MP3 |
| `.ytmp4` | YouTube → MP4 |
| `.tiktok` | TikTok download |
| `.ig` | Instagram download |
| `.media` | Generic / direct media URL |
| `.sticker` | Image/video → sticker |
| `.toimg` | Sticker → image |
| `.see` | Break view-once |
| `.qr` | Text → QR image |

### Tools
| Command | Description |
|---------|-------------|
| `.search <query>` | Web search |
| `.news <topic>` | News / related topics |
| `.weather <city>` | Weather |
| `.translate <lang> <text>` | Translate |
| `.remind <time> <text>` | Reminder |
| `.poll Q \| A \| B` | Create poll |

### General
| Command | Description |
|---------|-------------|
| `.menu` | Cool menu (carousel / image + gothic footer) |
| `.menu text` | Full text command list |
| `.ping` | Latency check |
| `.profile` | XP / level profile |
| `.afk [reason]` | AFK status |

### Group
| Command | Description |
|---------|-------------|
| `.kick @user` | Remove member |
| `.promote @user` | Make admin |
| `.demote @user` | Remove admin |
| `.hidetag <text>` | Mention all (hidden) |
| `.tagall <text>` | Tag everyone |
| `.groupinfo` | Group details |
| `.setname <name>` | Rename group |
| `.setdesc <text>` | Set description |
| `.linkgc` | Invite link |

### Auto
| Command | Description |
|---------|-------------|
| `.welcome on\|off` | Toggle welcome |
| `.leave on\|off` | Toggle leave |
| `.setwelcome <text>` | Custom welcome |
| `.setleave <text>` | Custom leave |
| `.channel set\|post\|list\|autopost` | Channel posts |

### Anti
| Command | Description |
|---------|-------------|
| `.antilink on\|off` | Block invite links |
| `.warn @user` | Warn member |
| `.resetwarn @user` | Clear warns |

### Owner
| Command | Description |
|---------|-------------|
| `.broadcast <text>` | Message all groups |
| `.ban` / `.unban` | Ban controls |
| `.listgc` | List groups |
| `.join <link>` | Join group |
| `.leavegc` | Leave current group |
| `.setmenu …` | Edit menu name/bio/pic/handles/channel |

---

## Cool menu

```text
.setmenu name ParadoxGPT
.setmenu bio Crafted from silence and sunless skies.
.setmenu pic assets/gallery/IMG_7776.jpeg
.setmenu channel https://whatsapp.com/channel/XXXX
.setmenu handle github https://github.com/Paradoxdreamer
.setmenu catimg ai assets/gallery/IMG_7776.jpeg
.setmenu show
```

### Gallery → category

| Category | Image |
|----------|-------|
| general | `IMG_7554.jpeg` |
| ai | `IMG_7776.jpeg` |
| tools | `IMG_7538.jpeg` |
| media | `IMG_7528.jpeg` |
| group | `IMG_7551.jpeg` |
| auto | `IMG_7527.jpeg` |
| anti | `IMG_7529.jpeg` |
| owner | `IMG_7526.jpeg` |
| extra | `IMG_7558.jpeg` · `IMG_7541.jpeg` · `IMG_7548.jpeg` |

---

<p align="center">
  <img src="assets/gallery/IMG_7551.jpeg" width="160" alt=""/>
  <img src="assets/gallery/IMG_7527.jpeg" width="160" alt=""/>
  <img src="assets/gallery/IMG_7526.jpeg" width="160" alt=""/>
  <img src="assets/gallery/IMG_7548.jpeg" width="160" alt=""/>
</p>

## Environment

```env
BOT_NAME=ParadoxGPT
OWNER_NUMBER=234xxxxxxxxxx
OMEGA_PRIMARY_URL=https://omegatech-api.dixonomega.tech/api/ai/Qwen-Claude-Haiku
OMEGA_FALLBACK_URL=https://omegatech-api.dixonomega.tech/api/ai/Gpt-4-mini
WEB_PORT=3000
COMMAND_PREFIX=.
```

---

## Architecture

```
src/
├── index.js
├── config.js
├── ai/omega.js
├── bot/                  connection · handler · serializer
├── commands/
│   ├── ai/
│   ├── anti/
│   ├── auto/
│   ├── general/
│   ├── group/
│   ├── media/            sticker · toimg · see · qr · play · ytmp3 · ytmp4 · tiktok · ig · media
│   ├── owner/
│   └── tools/
├── lib/menuSettings.js
├── services/
└── web/                  pairing dashboard
assets/gallery/           full art set
data/
```

---

## License

MIT · [Paradoxdreamer](https://github.com/Paradoxdreamer)

<p align="center">
  <img src="assets/gallery/IMG_7538.jpeg" width="220" alt=""/>
  <img src="assets/gallery/IMG_7541.jpeg" width="220" alt=""/>
</p>

<p align="center">
  <sub>Ask me anything, command me everything — but beware… even dreams can bite.</sub>
</p>
