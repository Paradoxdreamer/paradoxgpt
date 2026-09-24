<p align="center">
  <img src="assets/gallery/IMG_7776.jpeg" width="420" alt="ParadoxGPT — Solar Core"/>
</p>

<h1 align="center">ParadoxGPT</h1>

<p align="center">
  <em>Crafted from silence and sunless skies.</em><br/>
  <sub>Personality-driven WhatsApp bot · Web pairing · AI · Music · Media · Fun</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/WhatsApp-Baileys-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Baileys"/>
  <img src="https://img.shields.io/badge/AI-OmegaTech%20%2B%20Qwen-7C3AED?style=for-the-badge" alt="AI"/>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT"/>
</p>

---

## What is this?

<p align="center">
  <img src="assets/gallery/IMG_7554.jpeg" width="200" alt="Portrait — the face of the bot"/>
</p>

<p align="center"><sub><b>Portrait</b> — the calm face behind the chaos. ParadoxGPT is a rebuilt WhatsApp bot: pairing codes instead of QR, modular command folders, AI chat, music engine, media downloaders, and a gothic menu you can restyle live.</sub></p>

| Feature | Detail |
|--------|--------|
| **Pairing** | Web dashboard — 8-digit codes, no QR required |
| **AI** | OmegaTech Qwen primary → GPT-4-mini fallback |
| **Music** | `.song` / `.play` / `.lyrics` / taste profile / Auto DJ |
| **Downloaders** | YouTube, TikTok, Instagram, direct media |
| **Fun** | Truth/dare, ship, 8ball, memes, waifu, fake tweets |
| **Menu** | Carousel + gothic footer + editable bio/handles |
| **Hot-reload** | Drop a `.js` in a category folder — live in seconds |
| **Docker** | Ready-made `Dockerfile` + compose |

---

## Quick start

<p align="center">
  <img src="assets/gallery/IMG_7538.jpeg" width="220" alt="Papers flying — setup in motion"/>
</p>

<p align="center"><sub><b>Conductor / papers</b> — setup is deliberate, not messy. Clone, env, install, start. Pair from the browser.</sub></p>

```bash
git clone https://github.com/Paradoxdreamer/paradoxgpt.git
cd paradoxgpt
cp .env.example .env
# set OWNER_NUMBER=234xxxxxxxxxx
npm install
# optional for full .play audio:
# pip install yt-dlp
npm start
```

1. Open **http://localhost:3000**
2. Enter your phone number
3. Copy the **8-digit pairing code**
4. WhatsApp → **Linked devices** → **Link with phone number**

```bash
docker compose up -d --build
```

---

## AI

<p align="center">
  <img src="assets/gallery/IMG_7776.jpeg" width="240" alt="Solar figure — AI core"/>
</p>

<p align="center"><sub><b>Solar core</b> — the mind of the bot. Ask anything; modes shift between normal and chaotic.</sub></p>

| Command | Description |
|---------|-------------|
| `.ask <text>` | Chat (Qwen → GPT-4-mini fallback) |
| `.mode normal\|chaotic` | Personality switch |
| `.roast [@user\|text]` | Generate a roast |

Mention the bot or end a message with `?` for a free-form AI reply.

---

## Music engine

<p align="center">
  <img src="assets/gallery/IMG_7528.jpeg" width="240" alt="The Fool — the playlist begins"/>
</p>

<p align="center"><sub><b>The Fool</b> — every playlist starts with a step into the unknown. Search Spotify/iTunes metadata, pull audio with yt-dlp, build a taste profile.</sub></p>

| Command | Description |
|---------|-------------|
| `.song <name>` | Metadata card + album art |
| `.play <name>` | Full audio download |
| `.play <name> --ptt` | Send as voice note |
| `.play --auto` | AI DJ mix (after a few plays) |
| `.lyrics <name>` | Fetch lyrics |
| `.queue` | Download queue status |
| `.history` | Your recent plays + taste |

Requires **`yt-dlp`** on the host for audio. Optional Spotify credentials improve search; otherwise iTunes is used.

---

## Media downloaders

<p align="center">
  <img src="assets/gallery/IMG_7548.jpeg" width="200" alt="Warrior — grab media"/>
</p>

<p align="center"><sub><b>Warrior</b> — take what you need from the feed. YouTube, TikTok, Instagram, stickers, view-once breaker.</sub></p>

| Command | Usage |
|---------|--------|
| `.play` / `.ytmp3` / `.ytmp4` | YouTube audio or video |
| `.tiktok <url>` | TikTok video |
| `.ig <url>` | Instagram post / reel |
| `.media <url>` | Direct image/video/audio URL |
| `.sticker` | Reply to image/video → sticker |
| `.toimg` | Reply to sticker → image |
| `.see` | Reply to view-once → reveal |
| `.qr <text>` | Generate QR image |

```text
.play lo-fi hip hop
.ytmp4 https://youtu.be/dQw4w9WgXcQ
.tiktok https://www.tiktok.com/@user/video/...
.ig https://www.instagram.com/reel/...
```

---

## Movies & tools

<p align="center">
  <img src="assets/gallery/IMG_7551.jpeg" width="220" alt="Throne — curated knowledge"/>
</p>

<p align="center"><sub><b>Throne</b> — sit with the archive. Movies, weather, search, translate, reminders.</sub></p>

| Command | Description |
|---------|-------------|
| `.movie <title>` | OMDB lookup + poster |
| `.movie search <q>` | Keyword search |
| `.series <title>` | TV series |
| `.search <query>` | Web search |
| `.news <topic>` | Headlines / related links |
| `.weather <city>` | Weather |
| `.translate <lang> <text>` | Translate |
| `.remind <time> <text>` | Reminder |
| `.poll Q \| A \| B` | Create poll |

---

## Fun

<p align="center">
  <img src="assets/gallery/IMG_7527.jpeg" width="220" alt="Roses — play & chaos"/>
</p>

<p align="center"><sub><b>Roses</b> — soft on the surface, thorns underneath. Truth, dare, ship, memes, and late-night chaos.</sub></p>

| Command | Description |
|---------|-------------|
| `.truth` / `.dare` | Truth or Dare |
| `.joke` | Random joke |
| `.quote` | Inspirational quote |
| `.emoji <key>` | Keyword → emoji |
| `.ship @a @b` | Love calculator |
| `.8ball <question>` | Magic 8-ball |
| `.meme` | Random Imgflip meme |
| `.waifu [category]` | Anime SFW image |
| `.tweet @user\|text` | Fake tweet card |

---

## Groups, auto & anti

<p align="center">
  <img src="assets/gallery/IMG_7529.jpeg" width="220" alt="Hood — group order"/>
</p>

<p align="center"><sub><b>Hood</b> — order in the shadows. Welcomes, anti-link, warns, admin tools.</sub></p>

**Group** — `.kick` `.promote` `.demote` `.hidetag` `.tagall` `.groupinfo` `.setname` `.setdesc` `.linkgc`

**Auto** — `.welcome on\|off` `.leave on\|off` `.setwelcome` `.setleave` `.channel set\|post\|list`

**Anti** — `.antilink on\|off` `.warn @user` `.resetwarn @user`

---

## Owner controls

<p align="center">
  <img src="assets/gallery/IMG_7526.jpeg" width="200" alt="Veil — owner only"/>
</p>

<p align="center"><sub><b>Veil</b> — reserved for the Paradox Master. Broadcasts, bans, menu identity, channel posts.</sub></p>

| Command | Description |
|---------|-------------|
| `.broadcast <text>` | Message all groups |
| `.ban` / `.unban` | Ban controls |
| `.listgc` / `.join` / `.leavegc` | Group management |
| `.setmenu …` | Edit name, bio, pic, handles, channel |

```text
.setmenu name ParadoxGPT
.setmenu bio Crafted from silence and sunless skies.
.setmenu pic assets/gallery/IMG_7776.jpeg
.setmenu channel https://whatsapp.com/channel/XXXX
.setmenu handle github https://github.com/Paradoxdreamer
.setmenu show
```

---

## Menu & gallery map

<p align="center">
  <img src="assets/gallery/IMG_7558.jpeg" width="180" alt="Rain — quiet menu"/>
  &nbsp;
  <img src="assets/gallery/IMG_7541.jpeg" width="180" alt="Oni — dark mode energy"/>
</p>

<p align="center"><sub><b>Rain</b> · <b>Oni</b> — the menu is atmosphere. `.menu` tries a category carousel; falls back to image + gothic footer. `.menu text` for the full list.</sub></p>

| Category | Image | Vibe |
|----------|-------|------|
| **general** | `IMG_7554` | Portrait — calm entry |
| **ai** | `IMG_7776` | Solar — the mind |
| **fun** | `IMG_7527` | Roses — play |
| **tools** | `IMG_7538` | Papers — utility |
| **media** | `IMG_7528` | Fool — feeds & files |
| **group** | `IMG_7551` | Throne — community |
| **auto** | `IMG_7527` | Roses — automation |
| **anti** | `IMG_7529` | Hood — defense |
| **owner** | `IMG_7526` | Veil — control |
| *extra* | `IMG_7558` · `IMG_7541` · `IMG_7548` | Rain · Oni · Warrior |

---

## Environment

```env
BOT_NAME=ParadoxGPT
OWNER_NUMBER=234xxxxxxxxxx
COMMAND_PREFIX=.
WEB_PORT=3000

OMEGA_PRIMARY_URL=https://omegatech-api.dixonomega.tech/api/ai/Qwen-Claude-Haiku
OMEGA_FALLBACK_URL=https://omegatech-api.dixonomega.tech/api/ai/Gpt-4-mini

# Optional
OMDB_API_KEY=4a3b711b
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

System: **Node 18+**, optional **`yt-dlp`** for `.play` audio.

---

## Architecture

```
src/
├── index.js                 entry + web + bot boot
├── config.js
├── ai/omega.js              Qwen → GPT-4-mini
├── bot/                     connection · handler · serializer
├── commands/
│   ├── ai/  anti/  auto/  fun/
│   ├── general/  group/  media/  owner/  tools/
├── lib/
│   ├── menuSettings.js      editable menu / handles
│   └── songEngine.js        music pipeline
├── services/
└── web/                     pairing dashboard
assets/gallery/              section art (this README)
data/                        runtime JSON
```

Hot-reload walks category folders every few seconds.

---

## License

MIT · [Paradoxdreamer](https://github.com/Paradoxdreamer)

<p align="center">
  <img src="assets/gallery/IMG_7776.jpeg" width="160" alt=""/>
  <img src="assets/gallery/IMG_7538.jpeg" width="160" alt=""/>
  <img src="assets/gallery/IMG_7548.jpeg" width="160" alt=""/>
</p>

<p align="center">
  <sub>Ask me anything, command me everything — but beware… even dreams can bite.</sub>
</p>
