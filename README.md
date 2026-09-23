# ParadoxGPT v2

Personality-driven WhatsApp AI bot with **web pairing codes** (no QR), Gemini, hot-reload, and advanced tools.

**Repo:** https://github.com/Paradoxdreamer/paradoxgpt

## Quick start

```bash
git clone https://github.com/Paradoxdreamer/paradoxgpt.git
cd paradoxgpt
cp .env.example .env
# set OWNER_NUMBER and GEMINI_API_KEY
npm install && npm start
# open http://localhost:3000 for pairing code
```

Docker: `docker compose up -d --build`

## Advanced commands

### Broadcast & channels (owner)
| Command | Description |
|---------|-------------|
| `.broadcast <msg>` | Send to all groups |
| `.channel set [jid]` | Set default channel/group |
| `.channel post <msg>` | Post once to default channel |
| `.channel autopost on/off` | Toggle scheduled auto-posts |
| `.channel list` | List saved channels |
| `.listgc` | List all groups |
| `.join <invite-link>` | Join a group |
| `.leavegc` | Leave current/specified group |

### Web & utilities
| Command | Description |
|---------|-------------|
| `.search <query>` | DuckDuckGo web search |
| `.news <topic>` | Topic / news links |
| `.weather <city>` | Live weather (wttr.in) |
| `.translate <lang> <text>` | Translate (MyMemory) |
| `.qr <text>` | Generate QR code image |
| `.remind 10m <msg>` | In-chat reminder |
| `.poll Q \| A \| B \| C` | WhatsApp poll |

### Group admin (bot must be admin)
| Command | Description |
|---------|-------------|
| `.hidetag <msg>` | Mention all silently |
| `.tagall` | Mention all |
| `.groupinfo` | Group metadata |
| `.linkgc` | Invite link |
| `.kick @user` | Remove member |
| `.promote` / `.demote` | Admin controls |
| `.setname` / `.setdesc` | Edit group |
| `.antilink on/off` | Auto-delete links |
| `.warn` / `.welcome` / `.leave` | Moderation |

### Media & AI
| Command | Description |
|---------|-------------|
| `.s` | Media → sticker |
| `.toimg` | Sticker → image |
| `.see` | Reveal view-once |
| `.ask` / `.roast` / `.mode` | Gemini |
| `.afk [reason]` | AFK + auto-notify |

Hot-reload is on: edit files in `src/commands/` and they load within ~5s.

## License

MIT
