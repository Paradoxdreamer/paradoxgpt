<p align="center">
  <img src="assets/animations/solar-core.gif" width="520" alt="ParadoxGPT — Solar Core"/>
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
<p align="center">
  <img src="assets/animations/flow-line.gif" width="620" alt="Paradox flow"/>
</p>

⸻

What is this?

<p align="center">
  <img src="assets/gallery/IMG_7554.jpeg" width="200" alt="Portrait — the face of the bot"/>
</p>
<p align="center">
  <sub>
    <b>Portrait</b> — the calm face behind the chaos.
    ParadoxGPT is a rebuilt WhatsApp bot: pairing codes instead of QR,
    modular command folders, AI chat, music engine, media downloaders,
    and a gothic menu you can restyle live.
  </sub>
</p>
<table>
<tr>
<th>Feature</th>
<th>Detail</th>
</tr>
<tr>
<td><b>Pairing</b></td>
<td>Web dashboard — 8-digit codes, no QR required</td>
</tr>
<tr>
<td><b>AI</b></td>
<td>OmegaTech Qwen primary → GPT-4-mini fallback</td>
</tr>
<tr>
<td><b>Music</b></td>
<td><code>.song</code> / <code>.play</code> / <code>.lyrics</code> / taste profile / Auto DJ</td>
</tr>
<tr>
<td><b>Downloaders</b></td>
<td>YouTube, TikTok, Instagram, direct media</td>
</tr>
<tr>
<td><b>Fun</b></td>
<td>Truth/dare, ship, 8ball, memes, waifu, fake tweets</td>
</tr>
<tr>
<td><b>Menu</b></td>
<td>Carousel + gothic footer + editable bio/handles</td>
</tr>
<tr>
<td><b>Hot-reload</b></td>
<td>Drop a <code>.js</code> in a category folder — live in seconds</td>
</tr>
<tr>
<td><b>Docker</b></td>
<td>Ready-made <code>Dockerfile</code> + compose</td>
</tr>
</table>
<p align="center">
  <img src="assets/animations/sigil.gif" width="110" alt="Paradox sigil"/>
</p>

⸻

Quick start

<p align="center">
  <img src="assets/gallery/IMG_7538.jpeg" width="220" alt="Papers flying — setup in motion"/>
</p>
<p align="center">
  <sub>
    <b>Conductor / papers</b> — setup is deliberate, not messy.
    Clone, env, install, start. Pair from the browser.
  </sub>
</p>
git clone https://github.com/Paradoxdreamer/paradoxgpt.git
cd paradoxgpt
cp .env.example .env
# Configure your environment
# OWNER_NUMBER=234xxxxxxxxxx
npm install
npm start

Pair

1. Open http://localhost:3000
2. Enter your phone number
3. Copy the 8-digit pairing code
4. WhatsApp → Linked devices → Link with phone number

Docker

docker compose up -d --build
<p align="center">
  <img src="assets/animations/flow-line.gif" width="500" alt="Flow"/>
</p>

⸻

AI

<p align="center">
  <img src="assets/animations/ai-orbit.gif" width="360" alt="ParadoxGPT AI Core"/>
</p>
<p align="center">
  <img src="assets/gallery/IMG_7776.jpeg" width="240" alt="Solar figure — AI core"/>
</p>
<p align="center">
  <sub>
    <b>Solar core</b> — the mind of the bot.
    Ask anything; modes shift between normal and chaotic.
  </sub>
</p>

Command	Description
.ask <text>	Chat — Qwen → GPT-4-mini fallback
.mode normal|chaotic	Personality switch
.roast [@user|text]	Generate a roast

Mention the bot or end a message with ? for a free-form AI reply.

<p align="center">
  <img src="assets/animations/sigil.gif" width="90" alt="AI sigil"/>
</p>

⸻

Music engine

<p align="center">
  <img src="assets/animations/waveform.gif" width="620" alt="Animated music waveform"/>
</p>
<p align="center">
  <img src="assets/gallery/IMG_7528.jpeg" width="240" alt="The Fool — the playlist begins"/>
</p>
<p align="center">
  <sub>
    <b>The Fool</b> — every playlist starts with a step into the unknown.
    Search Spotify/iTunes metadata, pull audio with yt-dlp, build a taste profile.
  </sub>
</p>

Command	Description
.song <name>	Metadata card + album art
.play <name>	Full audio download
.play <name> --ptt	Send as voice note
.play --auto	AI DJ mix
.lyrics <name>	Fetch lyrics
.queue	Download queue status
.history	Recent plays + taste

Requires yt-dlp on the host for audio.

Optional Spotify credentials improve search; otherwise iTunes is used.

⸻

Media downloaders

<p align="center">
  <img src="assets/gallery/IMG_7548.jpeg" width="200" alt="Warrior — grab media"/>
</p>
<p align="center">
  <sub>
    <b>Warrior</b> — take what you need from the feed.
    YouTube, TikTok, Instagram, stickers, view-once breaker.
  </sub>
</p>
<p align="center">
  <img src="assets/animations/media-stream.gif" width="560" alt="Media stream"/>
</p>

Command	Usage
.play / .ytmp3 / .ytmp4	YouTube audio or video
.tiktok <url>	TikTok video
.ig <url>	Instagram post / reel
.media <url>	Direct image/video/audio URL
.sticker	Reply to image/video → sticker
.toimg	Reply to sticker → image
.see	Reply to view-once → reveal
.qr <text>	Generate QR image

.play lo-fi hip hop
.ytmp4 https://youtu.be/dQw4w9WgXcQ
.tiktok https://www.tiktok.com/@user/video/...
.ig https://www.instagram.com/reel/...

⸻

Movies & tools

<p align="center">
  <img src="assets/gallery/IMG_7551.jpeg" width="220" alt="Throne — curated knowledge"/>
</p>
<p align="center">
  <sub>
    <b>Throne</b> — sit with the archive.
    Movies, weather, search, translate, reminders.
  </sub>
</p>
<table>
<tr>
<th>Command</th>
<th>Description</th>
</tr>
<tr><td><code>.movie &lt;title&gt;</code></td><td>OMDB lookup + poster</td></tr>
<tr><td><code>.movie search &lt;q&gt;</code></td><td>Keyword search</td></tr>
<tr><td><code>.series &lt;title&gt;</code></td><td>TV series</td></tr>
<tr><td><code>.search &lt;query&gt;</code></td><td>Web search</td></tr>
<tr><td><code>.news &lt;topic&gt;</code></td><td>Headlines / related links</td></tr>
<tr><td><code>.weather &lt;city&gt;</code></td><td>Weather</td></tr>
<tr><td><code>.translate &lt;lang&gt; &lt;text&gt;</code></td><td>Translate</td></tr>
<tr><td><code>.remind &lt;time&gt; &lt;text&gt;</code></td><td>Reminder</td></tr>
<tr><td><code>.poll Q | A | B</code></td><td>Create poll</td></tr>
</table>

⸻

Fun

<p align="center">
  <img src="assets/gallery/IMG_7527.jpeg" width="220" alt="Roses — play & chaos"/>
</p>
<p align="center">
  <sub>
    <b>Roses</b> — soft on the surface, thorns underneath.
    Truth, dare, ship, memes, and late-night chaos.
  </sub>
</p>

Command	Description
.truth / .dare	Truth or Dare
.joke	Random joke
.quote	Inspirational quote
.emoji <key>	Keyword → emoji
.ship @a @b	Love calculator
.8ball <question>	Magic 8-ball
.meme	Random Imgflip meme
.waifu [category]	Anime SFW image
.tweet @user|text	Fake tweet card

<p align="center">
  <img src="assets/animations/flow-line.gif" width="420" alt="Paradox flow"/>
</p>

⸻

Groups, auto & anti

<p align="center">
  <img src="assets/gallery/IMG_7529.jpeg" width="220" alt="Hood — group order"/>
</p>
<p align="center">
  <sub>
    <b>Hood</b> — order in the shadows.
    Welcomes, anti-link, warnings, and admin tools.
  </sub>
</p>

Group

.kick
.promote
.demote
.hidetag
.tagall
.groupinfo
.setname
.setdesc
.linkgc

Auto

.welcome on|off
.leave on|off
.setwelcome
.setleave
.channel set|post|list

Anti

.antilink on|off
.warn @user
.resetwarn @user

⸻

Owner controls

<p align="center">
  <img src="assets/gallery/IMG_7526.jpeg" width="200" alt="Veil — owner only"/>
</p>
<p align="center">
  <sub>
    <b>Veil</b> — reserved for the Paradox Master.
    Broadcasts, bans, menu identity, channel posts.
  </sub>
</p>

Command	Description
.broadcast <text>	Message all groups
.ban / .unban	Ban controls
.listgc / .join / .leavegc	Group management
.setmenu …	Edit name, bio, pic, handles, channel

.setmenu name ParadoxGPT
.setmenu bio Crafted from silence and sunless skies.
.setmenu pic assets/gallery/IMG_7776.jpeg
.setmenu channel https://whatsapp.com/channel/XXXX
.setmenu handle github https://github.com/Paradoxdreamer
.setmenu show

⸻

Menu & gallery map

<p align="center">
  <img src="assets/gallery/IMG_7558.jpeg" width="180" alt="Rain — quiet menu"/>
  &nbsp;
  <img src="assets/gallery/IMG_7541.jpeg" width="180" alt="Oni — dark mode energy"/>
</p>
<p align="center">
  <sub>
    <b>Rain</b> · <b>Oni</b> — the menu is atmosphere.
    <code>.menu</code> tries a category carousel; falls back to image + gothic footer.
    <code>.menu text</code> for the full list.
  </sub>
</p>

Category	Image	Vibe
general	IMG_7554	Portrait — calm entry
ai	IMG_7776	Solar — the mind
fun	IMG_7527	Roses — play
tools	IMG_7538	Papers — utility
media	IMG_7528	Fool — feeds & files
group	IMG_7551	Throne — community
auto	IMG_7527	Roses — automation
anti	IMG_7529	Hood — defense
owner	IMG_7526	Veil — control
extra	IMG_7558 · IMG_7541 · IMG_7548	Rain · Oni · Warrior

⸻

Environment

BOT_NAME=ParadoxGPT
OWNER_NUMBER=234xxxxxxxxxx
COMMAND_PREFIX=.
WEB_PORT=3000
OMEGA_PRIMARY_URL=https://omegatech-api.dixonomega.tech/api/ai/Qwen-Claude-Haiku
OMEGA_FALLBACK_URL=https://omegatech-api.dixonomega.tech/api/ai/Gpt-4-mini
# Optional
OMDB_API_KEY=your_omdb_api_key
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

System: Node 18+, optional yt-dlp for .play audio.

⸻

Architecture

<p align="center">
  <img src="assets/animations/architecture-flow.gif" width="700" alt="ParadoxGPT architecture flow"/>
</p>
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
assets/
├── gallery/                 section artwork
└── animations/              README motion system
data/                        runtime JSON

Hot-reload walks category folders every few seconds.

<p align="center">
  <img src="assets/animations/flow-line.gif" width="620" alt="System flow"/>
</p>

⸻

License

<p align="center">
  <img src="assets/gallery/IMG_7776.jpeg" width="190" alt="Paradox — Solar Core"/>
</p>
<p align="center">
  <img src="assets/animations/paradox-sigil.gif" width="620" alt="Paradox animated sigil"/>
</p>
<p align="center">
  <strong>PARADOX · DREAMS INTO SYSTEMS</strong><br/>
  <sub>Software Engineer · Builder · Systems Thinker · Perpetual Experiment</sub>
</p>
<p align="center">
  <i>
    “Ask me anything. Command me everything.<br/>
    Just remember — even dreams can bite.”
  </i>
</p>
<p align="center">
  <a href="https://github.com/Paradoxdreamer">GitHub</a>
  ·
  <a href="https://github.com/Paradoxdreamer?tab=repositories">Projects</a>
  ·
  <a href="https://github.com/Paradoxdreamer?tab=stars">Stars</a>
</p>
<p align="center">
  <img src="assets/animations/flow-line.gif" width="460" alt="Paradox flow"/>
</p>
<p align="center">
  <sub>MIT Licensed · © Paradoxdreamer</sub><br/>
  <sub>Built with curiosity. Refined through failure. Shipped anyway.</sub>
</p>