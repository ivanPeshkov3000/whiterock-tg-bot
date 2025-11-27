import Parser from "rss-parser";
const parser = new Parser();

export async function fetchNews() {
  const urls = [
    "https://example.com/rss",   // подставь реальные региональные источники
    "https://example2.com/news/rss"
  ];

  let all = [];

  for (const url of urls) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.map(item => ({
        title: item.title,
        link: item.link,
        text: item.contentSnippet || item.content || item.title
      }));
      all.push(...items);
    } catch (e) {}
  }

  return all;
}
