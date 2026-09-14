import nunjucks from "nunjucks";
import {
  addMissingSearchHeadingIds,
  createHeadingIdAllocator,
  headingTextFromHtml
} from "./lib/legal-search-utils.js";

const categoryUrls = {
  "İmar Hukuku": "/imar-hukuku/",
  "Kentsel Dönüşüm": "/kentsel-donusum-hukuku/",
  "Kentsel Dönüşüm Hukuku": "/kentsel-donusum-hukuku/",
  "İnşaat Hukuku": "/insaat-hukuku/",
  "Gayrimenkul Hukuku": "/gayrimenkul-hukuku/",
  "Kira Hukuku": "/kira-hukuku/",
  "Bilişim Hukuku": "/bilisim-hukuku/"
};

const sourceAttributions = [
  [/^Şenol Saltık,/, "Av. Şenol Saltık,"],
  [/^Filiz Berberoğlu,/, "Hâkim Filiz Berberoğlu Yenipınar,"],
  [/^Filiz Berberoğlu Yenipınar,/, "Hâkim Filiz Berberoğlu Yenipınar,"],
  [/^Nergis Durmazgezer,/, "Av. Nergiz Durmazgezer,"],
  [/^Nergiz Durmazgezer,/, "Av. Nergiz Durmazgezer,"],
  [/^Erol Köktürk,/, "Prof. Dr. Erol Köktürk,"],
  [/^Ahmet Büyükduman,/, "Dr. Ahmet Büyükduman,"],
  [/^Oğuz Sancakdar,/, "Prof. Dr. Oğuz Sancakdar,"],
  [/^Ali Rıza İlgezdi,/, "Av. Ali Rıza İlgezdi,"]
];

const READING_WORDS_PER_MINUTE = 180;

function visibleWordCount(value = "") {
  const text = String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

function dateKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function legalToc(value = "") {
  const html = String(value || "");

  // Elle hazırlanmış bir içindekiler bloğu varsa ikinci bir TOC üretme.
  if (/<(?:nav|div|details)\b[^>]*class=["'][^"']*\btoc\b/i.test(html)) return [];

  const allocateId = createHeadingIdAllocator();
  const items = [];

  html.replace(
    /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (full, level, attrs, innerHtml) => {
      const text = headingTextFromHtml(innerHtml);
      if (!text) return full;

      const idMatch = String(attrs).match(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const explicitId = idMatch ? (idMatch[1] || idMatch[2] || idMatch[3] || "") : "";
      const id = allocateId(text, explicitId);

      items.push({ level: Number(level), id, text });
      return full;
    }
  );

  return items;
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("llms.txt");

  eleventyConfig.addFilter("dateTR", (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Istanbul"
    }).format(date);
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString();
  });

  eleventyConfig.addFilter("sitemapDate", (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  });

  eleventyConfig.addFilter("precedentMeta", (title, data) => {
    if (data && typeof data === "object") {
      if (data.daire && (data.esas_no || data.karar_no)) {
        const daireRaw = String(data.daire).trim();
        const court = daireRaw.toLowerCase().startsWith("yargıtay")
          ? daireRaw
          : `Yargıtay ${daireRaw}`;
        const idParts = [];
        if (data.esas_no) idParts.push(`E. ${String(data.esas_no).trim()}`);
        if (data.karar_no) idParts.push(`K. ${String(data.karar_no).trim()}`);
        const identifier = idParts.join(" ");
        const name = [court, identifier].filter(Boolean).join(" ");
        return {
          court,
          identifier,
          name
        };
      }
      if (data.mahkeme) {
        const court = String(data.mahkeme).trim();
        const idParts = [];
        if (data.esas_no) idParts.push(`E. ${String(data.esas_no).trim()}`);
        if (data.karar_no) idParts.push(`K. ${String(data.karar_no).trim()}`);
        const identifier = idParts.join(" ");
        const name = [court, identifier].filter(Boolean).join(" ");
        return {
          court,
          identifier,
          name
        };
      }
    }

    const rawTitle = typeof title === "string" ? title.trim() : "";
    if (!rawTitle) return { court: "", identifier: "", name: "" };

    const beforePipe = rawTitle.split("|")[0].trim();
    let court = "";
    let identifier = "";

    if (/^AYM\b/i.test(beforePipe) || /Anayasa Mahkemesi/i.test(beforePipe)) {
      court = "Anayasa Mahkemesi";
      const bMatch = beforePipe.match(/B\.\s*No:?\s*([0-9/]+)/i);
      identifier = bMatch ? `B. No: ${bMatch[1]}` : "";
    } else if (/İBBGK/i.test(beforePipe) || /İçtihatları Birleştirme/i.test(beforePipe)) {
      court = "Yargıtay İçtihatları Birleştirme Büyük Genel Kurulu";
      const ekMatch = beforePipe.match(/E\.\s*([0-9/()\-]+)\s*K\.\s*([0-9/()\-]+)/i);
      identifier = ekMatch ? `E. ${ekMatch[1]} K. ${ekMatch[2]}` : "";
    } else if (/HGK\b|Hukuk Genel Kurulu/i.test(beforePipe)) {
      court = "Yargıtay Hukuk Genel Kurulu";
      const ekMatch = beforePipe.match(/E\.\s*([0-9/()\-]+)\s*K\.\s*([0-9/()\-]+)/i);
      identifier = ekMatch ? `E. ${ekMatch[1]} K. ${ekMatch[2]}` : "";
    } else {
      const hdMatch = beforePipe.match(/(\d+)\.\s*(?:HD|Hukuk Dairesi)/i);
      if (hdMatch) {
        court = `Yargıtay ${hdMatch[1]}. Hukuk Dairesi`;
        const ekMatch = beforePipe.match(/E\.\s*([0-9/()\-]+)\s*K\.\s*([0-9/()\-]+)/i);
        identifier = ekMatch ? `E. ${ekMatch[1]} K. ${ekMatch[2]}` : "";
      }
    }

    const name = [court, identifier].filter(Boolean).join(" ");
    return { court, identifier, name };
  });

  eleventyConfig.addFilter("sameDate", (value, other) => dateKey(value) === dateKey(other));

  eleventyConfig.addFilter("json", (value) => {
    const serialized = JSON.stringify(value)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");
    return nunjucks.runtime.markSafe(serialized);
  });

  eleventyConfig.addFilter("sourceAttribution", (value) => {
    if (!value) return "";
    for (const [pattern, replacement] of sourceAttributions) {
      if (pattern.test(value)) return value.replace(pattern, replacement);
    }
    return value;
  });

  eleventyConfig.addFilter("wordCount", (value) => visibleWordCount(value));

  eleventyConfig.addFilter("readingTime", (value) => {
    const words = visibleWordCount(value);
    return Math.max(1, Math.round(words / READING_WORDS_PER_MINUTE));
  });

  eleventyConfig.addFilter("legalToc", (value) => legalToc(value));

  eleventyConfig.addFilter("byCategory", (items = [], category) =>
    items.filter((item) => item.data && item.data.category === category)
  );

  eleventyConfig.addFilter("relatedByCategory", (items = [], category, currentUrl, count = 3) =>
    items
      .filter((item) => item.data && item.data.category === category && item.url !== currentUrl)
      .slice(0, count)
  );

  eleventyConfig.addFilter("categoryUrl", (category) => categoryUrls[category] || "/makaleler/");

  eleventyConfig.addFilter("limit", (items = [], count = 6) => items.slice(0, count));

  eleventyConfig.addFilter("sortByDate", (items = []) =>
    [...items].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  );

  eleventyConfig.addCollection("makaleler", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./content/makaleler/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => new Date(b.data.date || 0) - new Date(a.data.date || 0))
  );

  eleventyConfig.addCollection("kararHaritalari", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./content/karar-haritalari/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => new Date(b.data.date || 0) - new Date(a.data.date || 0))
  );

  eleventyConfig.addCollection("vitrinMakaleler", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./content/makaleler/*.md")
      .filter((item) => !item.data.draft && item.data.category !== "Bilişim Hukuku")
      .sort((a, b) => new Date(b.data.date || 0) - new Date(a.data.date || 0))
  );

  // Legacy precedent pages contain editorial taxonomy labels hard-coded next to the
  // künye. Normalize only those exact labels; the court decision text itself is not
  // altered.
  eleventyConfig.addTransform("legalTerminology", (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    let result = content
      .replaceAll("İçtihat · Gayrimenkul &amp; Taşınmaz Hukuku", "İçtihat · Gayrimenkul Hukuku")
      .replaceAll("İçtihat · İmar &amp; Mülkiyet", "İçtihat · İmar Hukuku ve Mülkiyet Hakkı");

    const isPrecedentDetailPage = outputPath.includes("/ictihat/") &&
      !outputPath.endsWith("/ictihat/index.html") &&
      !outputPath.includes("/karar-haritalari/");

    if (isPrecedentDetailPage) {
      result = result.replace(
        /(<aside\b[^>]*class=["'][^"']*\bprecedent-summary\b[^"']*["'][^>]*>[\s\S]*?<div\b[^>]*class=["']eyebrow["']>)[\s\n]*Karar Özeti[\s\n]*(<\/div>)/gi,
        "$1Editoryal Karar Özeti$2"
      );
    }
    return result;
  });

  // Search v2 uses the same deterministic slug allocator as the search-index build.
  // Existing explicit IDs are preserved; only missing H2/H3 IDs are injected.
  eleventyConfig.addTransform("searchHeadingAnchors", (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return addMissingSearchHeadingIds(content);
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
}
