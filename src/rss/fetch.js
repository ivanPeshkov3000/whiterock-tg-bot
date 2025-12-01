import Parser from "rss-parser";

const parser = new Parser();

export async function fetchFeeds() {
  const urls = process.env.RSS_FEEDS.split(",");
  const items = [];

  for (const url of urls) {
    try {
      const feed = await parser.parseURL(url.trim());
      items.push(...feed.items);
    } catch (err) {
      console.error("RSS error:", url, err.message);
    }
  }

  return items;
}