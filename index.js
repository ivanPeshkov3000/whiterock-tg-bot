import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import { fetchNews } from "./fetch.js";
import { processArticle } from "./process.js";
import { getImageForArticle } from "./image.js";
import posted from "./posted.json" assert { type: "json" };
import fs from "fs";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
const channelId = process.env.CHANNEL_ID;

// Функция публикации
async function publish() {
  const news = await fetchNews();

  for (const item of news) {
    if (posted[item.link]) continue;

    const text = await processArticle(item.text);
    const image = await getImageForArticle(item);

    await bot.sendPhoto(channelId, image, { caption: text });

    posted[item.link] = true;
    fs.writeFileSync("src/posted.json", JSON.stringify(posted, null, 2));
  }
}

// Cron: каждые 30 минут
cron.schedule("*/30 * * * *", () => {
  publish().catch(console.error);
});

// Ручной запуск по команде (если хочешь оставить)
bot.onText(/\/scan/, async (msg) => {
  if (msg.chat.id.toString() !== channelId) return;
  await publish();
});
