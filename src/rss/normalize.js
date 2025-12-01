export function normalizeItem(item) {
  const content =
    item["content:encoded"] ||
    item.content ||
    item.summary ||
    item.description ||
    "";

  return {
    link: item.link,
    title: item.title?.trim() || "",
    content: content.replace(/<[^>]*>/g, "").trim()
  };
}