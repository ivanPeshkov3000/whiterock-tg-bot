import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

export async function postToTelegram(title, summary, link) {
  const text =
    `<b>${title}</b>\n\n` +
    `${summary}\n\n` +
    `<a href="${link}">Источник</a>`;

  await bot.sendMessage(process.env.TELEGRAM_CHANNEL_ID, text, {
    parse_mode: "HTML"
  });
}
