import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const articleDir = path.join(root, "content", "makaleler");
const files = fs.readdirSync(articleDir).filter((name) => name.endsWith(".md"));
const errors = [];

function readFrontmatter(source) {
  if (!source.startsWith("---\n")) return { raw: "", body: source, values: {} };
  const end = source.indexOf("\n---", 4);
  if (end === -1) return { raw: "", body: source, values: {} };
  const raw = source.slice(4, end);
  const body = source.slice(end + 4);
  const values = {};
  for (const key of ["title", "date", "updated", "summary", "description"]) {
    const match = raw.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
    if (match) values[key] = match[1].trim().replace(/^['\"]|['\"]$/g, "");
  }
  return { raw, body, values };
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function gitDate(relativePath) {
  try {
    const value = execFileSync("git", ["log", "-1", "--format=%cI", "--", relativePath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return parseDate(value);
  } catch {
    return null;
  }
}

function latestDateInBody(body) {
  const candidates = [];
  const add = (year, month, day) => {
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (!Number.isNaN(date.getTime())) candidates.push(date);
  };

  for (const match of body.matchAll(/\b(\d{1,2})[.\/]([01]?\d)[.\/](20\d{2})\b/g)) {
    add(match[3], match[2], match[1]);
  }
  for (const match of body.matchAll(/\b(20\d{2})-([01]\d)-([0-3]\d)\b/g)) {
    add(match[1], match[2], match[3]);
  }

  return candidates.sort((a, b) => b - a)[0] || null;
}

for (const file of files) {
  const relativePath = path.posix.join("content", "makaleler", file);
  const source = fs.readFileSync(path.join(articleDir, file), "utf8");
  const { raw, body, values } = readFrontmatter(source);

  if (!raw) {
    errors.push(`${relativePath}: frontmatter bulunamadı.`);
    continue;
  }

  for (const key of ["title", "date", "summary", "description"]) {
    if (!new RegExp(`^${key}:`, "m").test(raw)) errors.push(`${relativePath}: ${key} alanı eksik.`);
  }

  const published = parseDate(values.date);
  const explicitUpdated = parseDate(values.updated);
  const committed = gitDate(relativePath);
  const effectiveUpdated = [published, explicitUpdated, committed].filter(Boolean).sort((a, b) => b - a)[0] || null;
  const latestBodyDate = latestDateInBody(body);

  if (!published) errors.push(`${relativePath}: yayın tarihi geçerli değil.`);
  if (explicitUpdated && published && explicitUpdated < published) {
    errors.push(`${relativePath}: Son Güncelleme, Yayın Tarihinden eski.`);
  }
  if (latestBodyDate && effectiveUpdated && latestBodyDate > effectiveUpdated) {
    errors.push(
      `${relativePath}: içerikte ${latestBodyDate.toISOString().slice(0, 10)} tarihi var fakat etkin Son Güncelleme ${effectiveUpdated.toISOString().slice(0, 10)}.`
    );
  }
}

if (errors.length) {
  console.error("\nİçerik/SEO tarih denetimi başarısız:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`İçerik/SEO tarih denetimi başarılı: ${files.length} makale kontrol edildi.`);
