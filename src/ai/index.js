
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function aiSummarize(title, content) {
  const prompt = `
Ты summarizer новостей про Белую Скалу в Крыму.

Заголовок: ${title}
Текст: ${content}

Сделай краткое резюме 2–3 предложениями.
  `;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return res.choices[0].message.content.trim();
}