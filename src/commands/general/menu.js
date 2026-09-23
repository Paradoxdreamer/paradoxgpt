const axios = require("axios");
const config = require("../../config");
const {
  loadSettings,
  loadCategoryImages,
  gothicFooter,
  handlesBlock,
} = require("../../lib/menuSettings");

const ORDER = ["general", "ai", "tools", "media", "group", "auto", "anti", "owner"];
const LABELS = {
  general: "General",
  ai: "AI",
  tools: "Tools",
  media: "Media",
  group: "Group",
  auto: "Auto",
  anti: "Anti",
  owner: "Owner",
};

async function fetchImageBuffer(url) {
  if (!url) return null;
  try {
    const { data } = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: { "User-Agent": "ParadoxGPT/2.0" },
    });
    return Buffer.from(data);
  } catch {
    return null;
  }
}

function buildCaption(settings, groups, prefix) {
  const p = prefix;
  const name = settings.botName || "ParadoxGPT";
  const owner = settings.ownerName || "Owner";
  const bio = settings.bio || "";
  const ver = settings.version || "2.0";

  let text = "✦ *" + name + "* ✦  `v" + ver + "`\n";
  text += "_" + bio + "_\n";
  text += "Owner: *" + owner + "*\n";
  text += "Prefix: `" + p + "`\n";
  text += "────────────────────\n";

  for (const cat of ORDER) {
    const names = groups[cat];
    if (!names || !names.length) continue;
    names.sort();
    text += "\n❖ *" + (LABELS[cat] || cat) + "*  `(" + cat + ")`\n";
    text += names.map((n) => p + n).join(" · ") + "\n";
  }

  for (const cat of Object.keys(groups).sort()) {
    if (ORDER.includes(cat)) continue;
    const names = groups[cat].sort();
    text += "\n❖ *" + cat + "*\n";
    text += names.map((n) => p + n).join(" · ") + "\n";
  }

  const handles = handlesBlock(settings);
  if (handles) {
    text += "\n────────────────────\n*Handles*\n" + handles + "\n";
  }

  if (settings.channel && settings.channel.url) {
    text += "\n📢 *Channel:* " + (settings.channel.name || "Join") + "\n" + settings.channel.url + "\n";
  }

  text += "\n" + gothicFooter(settings) + "\n";
  text += "\n_Modes: normal · chaotic_\n_.setmenu · edit name/bio/handles/pic_";

  return text.trim();
}

async function sendCarousel(sock, m, settings, groups, catImages) {
  const cards = [];
  const mainBuf = await fetchImageBuffer(settings.botPicUrl);
  if (mainBuf) {
    cards.push({
      image: mainBuf,
      title: settings.botName || "ParadoxGPT",
      body: settings.bio || "",
      footer: (settings.channel && settings.channel.url) || "ParadoxGPT",
    });
  }

  for (const cat of ORDER) {
    if (!groups[cat] || !groups[cat].length) continue;
    const imgUrl = catImages[cat] || settings.botPicUrl;
    const buf = await fetchImageBuffer(imgUrl);
    if (!buf) continue;
    const cmds = groups[cat].sort().map((n) => config.prefix + n).join(" · ");
    cards.push({
      image: buf,
      title: LABELS[cat] || cat,
      body: cmds.slice(0, 500),
      footer: "(" + cat + ")",
    });
  }

  if (cards.length < 2) return false;

  try {
    const baileys = require("@whiskeysockets/baileys");
    const proto = baileys.proto;
    const generateWAMessageFromContent = baileys.generateWAMessageFromContent;
    const prepareWAMessageMedia = baileys.prepareWAMessageMedia;

    const carouselCards = [];
    for (const card of cards.slice(0, 10)) {
      const media = await prepareWAMessageMedia(
        { image: card.image },
        { upload: sock.waUploadToServer }
      );

      const buttons = [];
      if (settings.channel && settings.channel.url) {
        buttons.push({
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "Join Channel",
            url: settings.channel.url,
          }),
        });
      }
      buttons.push({
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Full Menu",
          id: config.prefix + "menu text",
        }),
      });

      carouselCards.push({
        header: proto.Message.InteractiveMessage.Header.create({
          ...(media.imageMessage ? { imageMessage: media.imageMessage } : {}),
          title: card.title,
          hasMediaAttachment: true,
        }),
        body: proto.Message.InteractiveMessage.Body.create({
          text: card.body || " ",
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({
          text: card.footer || " ",
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons: buttons,
        }),
      });
    }

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: "✦ *" + settings.botName + "* — Command Gallery",
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: settings.bio || "ParadoxGPT",
              }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({
                cards: carouselCards,
              }),
            }),
          },
        },
      },
      { userJid: sock.user.id, quoted: m.raw }
    );

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    return true;
  } catch (err) {
    console.error("Carousel failed, using fallback:", err.message);
    return false;
  }
}

module.exports = {
  name: "menu",
  category: "general",
  description: "Cool menu with image, carousel and gothic footer",
  async execute({ sock, m, commands, args }) {
    const settings = await loadSettings();
    const catImages = await loadCategoryImages();
    const p = config.prefix;

    const groups = {};
    for (const cmd of Object.values(commands || {})) {
      if (!cmd || !cmd.name) continue;
      const cat = cmd.category || "misc";
      groups[cat] = groups[cat] || [];
      groups[cat].push(cmd.name);
    }

    const mode = (args[0] || "").toLowerCase();

    if (mode === "text") {
      return m.reply(buildCaption(settings, groups, p));
    }

    const ok = await sendCarousel(sock, m, settings, groups, catImages);
    if (ok) {
      let short = "✦ *" + settings.botName + "* menu loaded.\n";
      short += "Type `" + p + "menu text` for full list.\n";
      if (settings.channel && settings.channel.url) {
        short += "Channel: " + settings.channel.url;
      }
      await m.reply(short.trim());
      return;
    }

    const caption = buildCaption(settings, groups, p);
    const buf = await fetchImageBuffer(settings.botPicUrl);

    if (buf) {
      await sock.sendMessage(m.chat, { image: buf, caption: caption }, { quoted: m.raw });
    } else {
      await m.reply(caption);
    }
  },
};
