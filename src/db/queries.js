import { db } from "./drizzle.js";
import { articles } from "./schema.js";
import { eq } from "drizzle-orm";

export async function isArticleExists(link) {
  const r = await db.select().from(articles).where(eq(articles.link, link));
  return r.length > 0;
}

export async function saveArticle(data) {
  return db.insert(articles).values(data);
}