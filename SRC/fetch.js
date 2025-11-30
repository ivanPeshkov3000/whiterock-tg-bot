const Parser = require('rss-parser');
const parser = new Parser();
const { RSS_FEEDS } = require('./config');
const { normalizeItem } = require('./normalizer');
const { classify } = require('./classifier');
const { summarizeWithAI, summarizeLocal } = require('./summarizer');
const db = require('./db');
const { hashString } = require('./utils');
const { postToTelegram } = require('./poster');

async function processFeedUrl(url, aiEnabled) {
  try {
    const feed = await parser.parseURL(url);
    console.log(`Feed: ${feed.title} — items: ${feed.items.length}`);
    for (const raw of feed.items) {
      const normalized = normalizeItem(raw);
      const guidHash = hashString(normalized.guid || normalized.link || normalized.title);

      if (db.hasGuid(guidHash)) {
        // уже публиковали
        continue;
      }

      // классификация
      const cls = await classify(normalized, aiEnabled ? {} : null);

      // фильтрация по релевантности (пример: если не про регион/Белую Скалу — пропускаем)
      const isRelevant = isRelevantByCategory(cls, normalized);
      if (!isRelevant) {
        // можно логировать
        console.log('Not relevant:', normalized.title);
        db.savePost({ guid: guidHash, link: normalized.link, title: normalized.title, published_at: normalized.published_at });
        continue;
      }

      // суммаризация (с AI, если включен)
      const summary = aiEnabled ? await summarizeWithAI(normalized) : await summarizeLocal(normalized.text, 500);

      // пост в Telegram
      try {
        await postToTelegram({ title: normalized.title, summary, link: normalized.link, category: cls.category });
        console.log('Posted:', normalized.title);
      } catch (e) {
        console.error('Posting failed for', normalized.link, e);
      }

      // сохраняем как опубликованное (даже если не постили — чтобы не пытаться снова)
      db.savePost({ guid: guidHash, link: normalized.link, title: normalized.title, published_at: normalized.published_at });
    }
  } catch (e) {
    console.error('Error processing feed', url, e);
  }
}

function isRelevantByCategory(cls, item) {
  // Простое правило: либо явно про Белую Скалу, либо относится к геологии/туризму/истории AND содержит "крым" или "Белая" в тексте/заголовке
  const t = ((item.title || '') + ' ' + (item.text || '')).toLowerCase();
  if (cls.category === 'belayaSkala') return true;
  if (['geology','history','tourism'].includes(cls.category)) {
    return t.includes('крым') || t.includes('белая') || t.includes('ак-кая') || t.includes('аккая') || t.includes('белая скала');
  }
  return false;
}

module.exports = { processFeedUrl };

  return all;
}
