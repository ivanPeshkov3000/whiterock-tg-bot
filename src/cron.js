import cron from "node-cron";
import { fetchFeeds } from "./rss/fetch.js";
import { processRssItems } from "./rss/process.js";

cron.schedule("*/30 * * * *", async () => {
  console.log("Cron: checking RSS feeds...");
  const items = await fetchFeeds();
  await processRssItems(items);
});