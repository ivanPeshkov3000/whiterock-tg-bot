import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function processArticle(text) {
  const prompt = `
Сократи и оформи текст для телеграм-канала про Белую Скалу.
Стиль: ясный, информативный, 400–800 символов.

Текст:
${text}
  `;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return res.choices[0].message.content.trim();
                           }
