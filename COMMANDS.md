# Command layout

Commands are organized by category folders under `src/commands/`.
The loader walks **all subfolders** recursively and hot-reloads every ~5s.

```
src/commands/
├── ai/          ask, mode, roast
├── anti/        antilink, warn, resetwarn
├── auto/        welcome, leave, setwelcome, setleave, channel
├── general/     ping, menu, profile, afk
├── group/       kick, promote, demote, hidetag, tagall, groupinfo,
│                setname, setdesc, linkgc
├── media/       sticker, toimg, see, qr
├── owner/       broadcast, ban, unban, listgc, join, leavegc
└── tools/       search, news, weather, translate, remind, poll
```

| Folder | Role |
|--------|------|
| `auto/` | Automation (welcome/leave messages, channel posts) |
| `anti/` | Protection (antilink, warn system) |
| `owner/` | Owner-only controls |
| `group/` | Group admin tools |
| `media/` | Stickers, QR, view-once |
| `tools/` | Search, weather, translate, polls |
| `ai/` | Gemini/Omega personality commands |
| `general/` | Everyday utilities |

Add a new command by dropping a `.js` file in the right folder:

```js
module.exports = {
  name: "mycommand",
  // category is auto-inferred from folder name
  async execute({ sock, m, args }) { ... }
};
```
