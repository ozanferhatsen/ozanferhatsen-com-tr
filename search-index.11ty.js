function stripHtml(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function documentType(item) {
  const inputPath = String(item.inputPath || "");
  const url = String(item.url || "");

  if (inputPath.includes("/content/karar-haritalari/") || url.startsWith("/ictihat/karar-haritalari/")) {
    return "karar-haritasi";
  }
  if (url.startsWith("/ictihat/")) return "ictihat";
  if (url.startsWith("/makaleler/")) return "makale";
  return "sayfa";
}

export const data = {
  permalink: "/search-index.json",
  eleventyExcludeFromCollections: true
};

export default function render(data) {
  const excludedUrls = new Set([
    "/arama/",
    "/search-index.json",
    "/404.html",
    "/404/"
  ]);

  const documents = (data.collections?.all || [])
    .filter((item) => {
      if (!item?.url || !item?.data?.title) return false;
      if (item.data.draft || item.data.excludeFromSearch) return false;
      if (item.data.lang === "en" || item.url.startsWith("/en/")) return false;
      if (item.url.startsWith("/admin/")) return false;
      if (excludedUrls.has(item.url)) return false;
      return true;
    })
    .map((item) => {
      const legalTerms = Array.isArray(item.data.legal_terms)
        ? item.data.legal_terms
        : item.data.legal_terms
          ? [item.data.legal_terms]
          : [];

      return {
        id: item.url,
        url: item.url,
        title: String(item.data.title || ""),
        type: documentType(item),
        category: String(item.data.category || ""),
        summary: String(item.data.summary || item.data.description || ""),
        legal_terms: legalTerms.join(" "),
        text: stripHtml(item.templateContent || "")
      };
    });

  return JSON.stringify(documents);
}
