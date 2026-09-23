const {
  loadSettings,
  saveSettings,
  loadCategoryImages,
  saveCategoryImages,
} = require("../../lib/menuSettings");

module.exports = {
  name: "setmenu",
  category: "owner",
  description: "Edit menu name, bio, handles, pic, channel (owner)",
  ownerOnly: true,
  async execute({ m, args }) {
    const sub = (args[0] || "").toLowerCase();
    const rest = args.slice(1).join(" ").trim();

    if (!sub || sub === "help") {
      return m.reply(
        `*Menu editor*\n\n` +
          `.setmenu show\n` +
          `.setmenu name <bot name>\n` +
          `.setmenu bio <text>\n` +
          `.setmenu owner <owner display name>\n` +
          `.setmenu pic <image url>\n` +
          `.setmenu footer line1 | line2 | line3\n` +
          `.setmenu channel <channel url>\n` +
          `.setmenu channelname <name>\n` +
          `.setmenu handle <platform> <value>\n` +
          `  platforms: whatsapp telegram github instagram twitter youtube tiktok\n` +
          `.setmenu catimg <category> <image url>`
      );
    }

    if (sub === "show") {
      const s = await loadSettings();
      const imgs = await loadCategoryImages();
      return m.reply(
        `*Current menu settings*\n\n` +
          `Name: ${s.botName}\n` +
          `Owner: ${s.ownerName}\n` +
          `Bio: ${s.bio}\n` +
          `Pic: ${s.botPicUrl}\n` +
          `Channel: ${s.channel?.name || "—"} ${s.channel?.url || ""}\n` +
          `Handles:\n${JSON.stringify(s.handles, null, 2)}\n` +
          `Category images:\n${JSON.stringify(imgs, null, 2)}\n` +
          `Footer:\n${s.footer}`
      );
    }

    if (sub === "name") {
      if (!rest) return m.reply("Usage: .setmenu name ParadoxGPT");
      await saveSettings({ botName: rest });
      return m.reply(`Bot name set to: *${rest}*`);
    }

    if (sub === "bio") {
      if (!rest) return m.reply("Usage: .setmenu bio Your bio here");
      await saveSettings({ bio: rest });
      return m.reply("Bio updated.");
    }

    if (sub === "owner") {
      if (!rest) return m.reply("Usage: .setmenu owner Your Name");
      await saveSettings({ ownerName: rest });
      return m.reply(`Owner display name: *${rest}*`);
    }

    if (sub === "pic") {
      if (!rest || !/^https?:\/\//i.test(rest)) {
        return m.reply("Usage: .setmenu pic https://files.catbox.moe/....jpg");
      }
      await saveSettings({ botPicUrl: rest });
      return m.reply("Menu picture set.");
    }

    if (sub === "footer") {
      if (!rest) return m.reply("Usage: .setmenu footer line1 | line2 | line3");
      const footer = rest.split("|").map((s) => s.trim()).filter(Boolean).join("\n");
      await saveSettings({ footer });
      return m.reply("Footer updated.");
    }

    if (sub === "channel") {
      if (!rest) return m.reply("Usage: .setmenu channel https://whatsapp.com/channel/...");
      await saveSettings({ channel: { url: rest } });
      return m.reply("Channel URL saved.");
    }

    if (sub === "channelname") {
      if (!rest) return m.reply("Usage: .setmenu channelname My Channel");
      await saveSettings({ channel: { name: rest } });
      return m.reply(`Channel name: *${rest}*`);
    }

    if (sub === "handle") {
      const platform = (args[1] || "").toLowerCase();
      const value = args.slice(2).join(" ").trim();
      const allowed = ["whatsapp", "telegram", "github", "instagram", "twitter", "youtube", "tiktok"];
      if (!allowed.includes(platform) || !value) {
        return m.reply(`Usage: .setmenu handle <platform> <value>\nPlatforms: ${allowed.join(", ")}`);
      }
      await saveSettings({ handles: { [platform]: value } });
      return m.reply(`Handle *${platform}* → ${value}`);
    }

    if (sub === "catimg") {
      const cat = (args[1] || "").toLowerCase();
      const url = args.slice(2).join(" ").trim();
      if (!cat || !url) return m.reply("Usage: .setmenu catimg ai https://...");
      const imgs = await loadCategoryImages();
      imgs[cat] = url;
      await saveCategoryImages(imgs);
      return m.reply(`Category image *${cat}* saved.`);
    }

    return m.reply("Unknown option. Try .setmenu help");
  },
};
