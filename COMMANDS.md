# ParadoxGPT — Command Reference

Prefix: `.` (configurable via `COMMAND_PREFIX`)

## General
| Command | Description |
|---------|-------------|
| `.menu` | Gothic menu carousel / category list |
| `.menu text` | Full text menu |
| `.ping` | Latency check |
| `.profile [@user]` | User profile card |
| `.afk [reason]` | Set AFK status |

## AI
| Command | Description |
|---------|-------------|
| `.ask <text>` | Chat (Qwen → GPT-4-mini) |
| `.mode normal\|chaotic` | Personality mode |
| `.roast [@user\|text]` | Generate a roast |

## Fun
| Command | Description |
|---------|-------------|
| `.truth` | Random truth question |
| `.dare` | Random dare |
| `.joke` | Random joke |
| `.quote` | Inspirational quote |
| `.emoji <key>` | Keyword → emoji |
| `.ship @a @b` | Love calculator |
| `.8ball <q>` | Magic 8-ball |
| `.meme` | Random meme image |
| `.waifu [cat]` | Anime SFW image |
| `.tweet @user\|text` | Fake tweet card |

## Media
| Command | Description |
|---------|-------------|
| `.song <name>` | Metadata + album art |
| `.play <name>` | Full audio (`--ptt` for voice note) |
| `.lyrics <name>` | Lyrics |
| `.queue` | Download queue |
| `.history` | Recent plays + taste |
| `.ytmp3 <url\|q>` | YouTube audio |
| `.ytmp4 <url\|q>` | YouTube video |
| `.tiktok <url>` | TikTok download |
| `.ig <url>` | Instagram download |
| `.media <url>` | Direct media URL |
| `.sticker` | Reply → sticker |
| `.toimg` | Sticker → image |
| `.see` | View-once breaker |
| `.qr <text>` | QR code image |

## Tools
| Command | Description |
|---------|-------------|
| `.movie <title>` | OMDB movie card |
| `.movie search <q>` | Keyword search |
| `.series <title>` | TV series |
| `.search <q>` | Web search |
| `.news <topic>` | News links |
| `.weather <city>` | Weather |
| `.translate <lang> <text>` | Translate |
| `.remind <time> <text>` | Reminder |
| `.poll Q \| A \| B` | Create poll |

## Group (admin)
| Command | Description |
|---------|-------------|
| `.kick @user` | Remove member |
| `.promote @user` | Make admin |
| `.demote @user` | Remove admin |
| `.hidetag <text>` | Silent mention all |
| `.tagall [text]` | Mention all |
| `.groupinfo` | Group details |
| `.setname <n>` | Rename group |
| `.setdesc <t>` | Set description |
| `.linkgc` | Invite link |

## Auto
| Command | Description |
|---------|-------------|
| `.welcome on\|off` | Welcome messages |
| `.leave on\|off` | Leave messages |
| `.setwelcome <t>` | Custom welcome |
| `.setleave <t>` | Custom leave |
| `.channel set\|post\|list` | Channel autopost |

## Anti
| Command | Description |
|---------|-------------|
| `.antilink on\|off` | Delete links |
| `.warn @user` | Warn member |
| `.resetwarn @user` | Clear warns |

## Owner
| Command | Description |
|---------|-------------|
| `.broadcast <text>` | All groups |
| `.ban` / `.unban` | Ban controls |
| `.listgc` | List groups |
| `.join <link>` | Join group |
| `.leavegc` | Leave current |
| `.setmenu …` | Edit bot identity / menu |
