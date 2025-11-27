import axios from "axios";
import * as cheerio from "cheerio";

export async function getImageForArticle(article) {
  try {
    const html = await axios.get(article.link, { timeout: 5000 });
    const $ = cheerio.load(html.data);

    const img = $("img").first().attr("src");
    if (img) return img[0] === "/" ? article.link + img : img;
  } catch (e) {}

  // fallback: нейтральная фотография Белой Скалы
  return "https://upload.wikimedia.org/wikipedia/commons/7/7d/Aq_Qaya_White_Cliff.jpg";
}
