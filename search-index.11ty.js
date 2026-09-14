import * as cheerio from "cheerio";
import {
  createHeadingIdAllocator,
  headingTextFromHtml,
  resolveSearchArea
} from "./lib/legal-search-utils.js";

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

function resolveYear(item, type) {
  const explicit = item.data?.decision_year ?? item.data?.year;
  if (explicit !== undefined && explicit !== null && String(explicit).trim()) {
    const parsed = Number.parseInt(String(explicit), 10);
    return Number.isFinite(parsed) ? parsed : String(explicit).trim();
  }

  const sourceDate = item.data?.date || item.date;
  if (!sourceDate) return null;
  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) return null;

  // Until the dedicated künye parser is introduced, this is the publication year
  // for articles/maps and the Eleventy item year for precedents without explicit metadata.
  return date.getFullYear();
}

function isSectionHeading(node) {
  if (!node || node.type !== "tag") return false;
  const name = String(node.name || "").toLowerCase();
  return name === "h2" || name === "h3";
}

function nextNodeWithinScope(node, scope) {
  if (!node) return null;
  if (node.children && node.children.length) return node.children[0];

  let cursor = node;
  while (cursor && cursor !== scope) {
    if (cursor.next) return cursor.next;
    cursor = cursor.parent;
  }
  return null;
}

function firstNodeAfterSubtree(node, scope) {
  let cursor = node;
  while (cursor && cursor !== scope) {
    if (cursor.next) return cursor.next;
    cursor = cursor.parent;
  }
  return null;
}

function collectSectionText(heading, scope) {
  const parts = [];
  let cursor = firstNodeAfterSubtree(heading, scope);

  while (cursor) {
    if (isSectionHeading(cursor)) break;
    if (cursor.type === "text" && cursor.data) parts.push(cursor.data);
    cursor = nextNodeWithinScope(cursor, scope);
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function sectionScope($, heading) {
  return $(heading).closest("article").get(0) ||
    $(heading).closest("section").get(0) ||
    $.root().get(0);
}

function commonRecordData(item, type) {
  const data = item.data || {};
  const parentTitle = String(data.title || "").trim();
  const legalTerms = stringList(data.legal_terms);
  const topics = stringList(data.search_topics || data.topics);

  return {
    parentId: item.url,
    parentUrl: item.url,
    parentTitle,
    type,
    area: resolveSearchArea(item),
    topics,
    court: data.court ? String(data.court).trim() : null,
    chamber: data.chamber ? String(data.chamber).trim() : null,
    esas: data.esas ? String(data.esas).trim() : null,
    karar: data.karar ? String(data.karar).trim() : null,
    year: resolveYear(item, type),
    category: String(data.category || ""),
    summary: String(data.summary || data.description || ""),
    legal_terms: legalTerms.join(" "),
    search_version: 2
  };
}

function documentRecord(item, type, content) {
  const common = commonRecordData(item, type);
  return {
    id: item.url,
    ...common,
    sectionId: null,
    sectionTitle: common.parentTitle,
    sectionLevel: "h1",
    url: item.url,
    title: common.parentTitle,
    content,
    text: content
  };
}

function sectionRecords(item, type) {
  const html = String(item.templateContent || "");
  const $ = cheerio.load(html, null, false);
  const headings = $("h2, h3").toArray();
  const common = commonRecordData(item, type);

  if (!headings.length) return [documentRecord(item, type, stripHtml(html))];

  const allocateId = createHeadingIdAllocator();

  return headings.map((heading) => {
    const $heading = $(heading);
    const sectionTitle = headingTextFromHtml($heading.html() || "") || common.parentTitle;
    const explicitId = String($heading.attr("id") || "").trim();
    const sectionId = allocateId(sectionTitle, explicitId);
    const level = String(heading.name || "h2").toLowerCase();
    const scope = sectionScope($, heading);
    const content = collectSectionText(heading, scope);
    const title = sectionTitle === common.parentTitle
      ? common.parentTitle
      : `${common.parentTitle} — ${sectionTitle}`;

    return {
      id: `${item.url}#${sectionId}`,
      ...common,
      sectionId,
      sectionTitle,
      sectionLevel: level,
      url: `${item.url}#${sectionId}`,
      title,
      content,
      text: content
    };
  });
}

export const data = {
  permalink: "/search-index.json",
  eleventyExcludeFromCollections: true
};

export default function render(data) {
  const records = [];

  for (const item of data.collections?.all || []) {
    if (!item?.url || !item?.data?.title) continue;
    if (item.data.draft || item.data.excludeFromSearch) continue;
    if (item.data.lang === "en" || item.url.startsWith("/en/")) continue;
    if (item.url.startsWith("/admin/")) continue;

    const type = documentType(item);
    if (!type) continue;

    records.push(...sectionRecords(item, type));
  }

  return JSON.stringify(records);
}
