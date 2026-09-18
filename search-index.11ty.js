import * as cheerio from "cheerio";
import {
  headingTextFromHtml,
  parseDecisionMetadata,
  resolveSearchArea
} from "./lib/legal-search-utils.js";

const GENERIC_HEADINGS = new Set([
  "bilgilendirme ve arama kilavuzu",
  "yargitay ilami resmi metni",
  "sonuc",
  "kisa cevap",
  "sik sorulan sorular",
  "i. yargilama sureci",
  "ii. uyusmazlik",
  "iii. gerekce",
  "iv. sonuc",
  "v. sonuc",
  "iii. on sorun",
  "iv. gerekce",
  "davaci istemi:",
  "davali cevabi:",
  "davalilar cevabi:",
  "ilk derece mahkemesi karari:",
  "mahkeme karari:",
  "ozel daire bozma karari:",
  "ozel daire onama karari:",
  "direnme karari:",
  "direnme kararinin temyizi:",
  "bolge adliye mahkemesi karari:",
  "ilk derece mahkemesinin birinci karari:",
  "ilk derece mahkemesinin ikinci karari:",
  "ozel dairenin birinci bozma karari:",
  "ozel dairenin ikinci bozma karari:"
]);

function isGenericHeading(h) {
  const norm = String(h || "")
    .toLowerCase()
    .trim()
    .replace(/[:—–-]$/, "")
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
  return (
    GENERIC_HEADINGS.has(norm) ||
    GENERIC_HEADINGS.has(norm + ":") ||
    /^(i|ii|iii|iv|v|vi)\.\s*(yargilama sureci|uyusmazlik|gerekce|sonuc|on sorun)$/.test(norm)
  );
}

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
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function documentType(item) {
  const inputPath = String(item.inputPath || "");
  const url = String(item.url || "");

  if (item.data?.type === "karar-corpus" || url.startsWith("/ictihat/karar/")) return "karar-corpus";
  if (inputPath.includes("/content/karar-haritalari/")) return "karar-haritasi";
  if (inputPath.includes("/content/makaleler/")) return "makale";

  if (
    url.startsWith("/ictihat/") &&
    url !== "/ictihat/" &&
    !url.startsWith("/ictihat/karar-haritalari/")
  ) {
    return "ictihat";
  }

  return null;
}

function stringList(value) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values
    .map((entry) => {
      if (typeof entry === "string" || typeof entry === "number") return String(entry).trim();
      if (entry && typeof entry === "object") return String(entry.label || entry.name || entry.title || "").trim();
      return "";
    })
    .filter(Boolean);
}

function resolveYear(item, decisionMetadata) {
  if (decisionMetadata?.decision_year) return decisionMetadata.decision_year;

  const explicit = item.data?.decision_year ?? item.data?.year;
  if (explicit !== undefined && explicit !== null && String(explicit).trim()) {
    const parsed = Number.parseInt(String(explicit), 10);
    return Number.isFinite(parsed) ? parsed : String(explicit).trim();
  }

  const sourceDate = item.data?.date || item.date;
  if (!sourceDate) return null;
  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) return null;
  return date.getFullYear();
}

function collectHeadings(html = "") {
  if (!html) return [];
  const $ = cheerio.load(html, null, false);
  const headings = $("h2, h3")
    .toArray()
    .map((heading) => headingTextFromHtml($(heading).html() || ""))
    .filter((h) => h && !isGenericHeading(h));
  return Array.from(new Set(headings)).slice(0, 16);
}

function buildThinRecord(item, type) {
  const data = item.data || {};
  const parentTitle = String(data.title || "").trim();
  const rawLegal = [
    ...(Array.isArray(data.legal_terms) ? data.legal_terms : [data.legal_terms]),
    data.keyword,
    data.keywords
  ];
  const legalTerms = stringList(rawLegal);
  const legalTermsSet = new Set(legalTerms.map((t) => t.toLowerCase().trim()));
  const topics = stringList(data.search_topics || data.topics).filter(
    (topic) => !legalTermsSet.has(topic.toLowerCase().trim())
  );

  const html = String(item.templateContent || "");
  const headings = collectHeadings(html);

  // Gövde metnini asla indekse basmıyoruz; yalnızca künye tespiti için ilk kısmı parse ediyoruz.
  const sourceText = type === "ictihat" ? stripHtml(html).slice(0, 7000) : "";
  const decisionMetadata = parseDecisionMetadata({
    data,
    title: parentTitle,
    text: sourceText,
    type
  });

  const courtTerms = Array.from(
    new Set([decisionMetadata.court_code, decisionMetadata.chamber, decisionMetadata.court].filter(Boolean))
  );

  const decisionRefs = Array.from(
    new Set([decisionMetadata.esas, decisionMetadata.karar].filter(Boolean))
  );

  const record = {
    id: item.url,
    title: parentTitle,
    url: item.url,
    type,
    area: resolveSearchArea(item),
    summary: String(data.summary || data.description || "").trim().slice(0, 220),
    search_version: 3
  };

  if (data.category) record.category = String(data.category).trim();
  if (legalTerms.length) record.legal_terms = legalTerms;
  if (topics.length) record.topics = topics;
  if (headings.length) record.headings = headings;

  if (decisionMetadata.court) record.court = decisionMetadata.court;
  if (decisionMetadata.chamber) record.chamber = decisionMetadata.chamber;
  if (decisionMetadata.court_code) record.court_code = decisionMetadata.court_code;
  if (courtTerms.length) record.court_terms = courtTerms;
  if (decisionMetadata.esas) record.esas = decisionMetadata.esas;
  if (decisionMetadata.karar) record.karar = decisionMetadata.karar;
  if (decisionRefs.length) record.decision_refs = decisionRefs;
  const year = resolveYear(item, decisionMetadata);
  if (year) record.year = year;

  return record;
}

export const data = {
  permalink: "/search-index.json",
  eleventyExcludeFromCollections: true
};

export default function render(data) {
  const records = [];
  const seenUrls = new Set();

  for (const item of data.collections?.all || []) {
    if (!item?.url || !item?.data?.title) continue;
    if (item.data.draft || item.data.excludeFromSearch) continue;
    if (item.data.lang === "en" || item.url.startsWith("/en/")) continue;
    if (item.url.startsWith("/admin/")) continue;

    const type = documentType(item);
    if (!type) continue;

    if (seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);

    records.push(buildThinRecord(item, type));
  }

  return JSON.stringify(records);
}
