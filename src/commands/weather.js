const axios = require("axios");

module.exports = {
  name: "weather",
  description: "Current weather for a city",
  async execute({ m, args }) {
    const city = args.join(" ").trim();
    if (!city) return m.reply("Usage: .weather <city>");

    try {
      const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
      const { data } = await axios.get(url, {
        timeout: 12000,
        headers: { "User-Agent": "ParadoxGPT" },
      });

      const cur = data.current_condition?.[0];
      const area = data.nearest_area?.[0];
      if (!cur) return m.reply("No weather data found.");

      const place = [
        area?.areaName?.[0]?.value,
        area?.region?.[0]?.value,
        area?.country?.[0]?.value,
      ]
        .filter(Boolean)
        .join(", ");

      const text = `*Weather — ${place || city}*\n\n*Condition:* ${cur.weatherDesc?.[0]?.value || "—"}\n*Temp:* ${cur.temp_C}°C (feels ${cur.FeelsLikeC}°C)\n*Humidity:* ${cur.humidity}%\n*Wind:* ${cur.windspeedKmph} km/h ${cur.winddir16Point || ""}\n*Precip:* ${cur.precipMM} mm\n*UV index:* ${cur.uvIndex}`;

      await m.reply(text);
    } catch (err) {
      await m.reply("Weather lookup failed. Check the city name.");
    }
  },
};
