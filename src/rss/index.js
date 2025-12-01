import { normalizeItem } from "./normalize.js";
import { isArticleExists, saveArticle } from "../db/queries.js";
import { aiSummarize } from "../ai/index.js";
import { postToTelegram } from "../bot/index.js";

export async function processRssItems(rawItems) {
  for (const item of rawItems) {
    const n = normalizeItem(item);

    if (!n.title || !n.link) continue;
    if (await isArticleExists(n.link)) continue;

    const summary = await aiSummarize(n.title, n.content);

    await saveArticle({
      link: n.link,
      title: n.title,
      content: n.content,
      summary
    });

    await postToTelegram(n.title, summary, n.link);
  }
}
