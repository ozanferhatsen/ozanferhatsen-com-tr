import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "_site");
const errors = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function has(pattern, text) {
  return pattern.test(text);
}

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (relative.startsWith("admin/")) continue;

  const html = fs.readFileSync(file, "utf8");
  if (!has(/<title>[^<]+<\/title>/i, html)) errors.push(`${relative}: title eksik.`);
  if (!has(/<meta\s+name="description"\s+content="[^"]+"/i, html)) errors.push(`${relative}: meta description eksik.`);
  if (!has(/<meta\s+name="robots"\s+content="[^"]+"/i, html)) errors.push(`${relative}: robots meta eksik.`);
  if (!has(/<link\s+rel="canonical"\s+href="https:\/\/ozanferhatsen\.com\.tr\/[^"]*"/i, html)) errors.push(`${relative}: canonical eksik veya hatalı.`);

  const jsonLdBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (!jsonLdBlocks.length) errors.push(`${relative}: JSON-LD bulunamadı.`);
  for (const [, block] of jsonLdBlocks) {
    try {
      JSON.parse(block.trim());
    } catch (error) {
      errors.push(`${relative}: JSON-LD geçersiz (${error.message}).`);
    }
  }

  if (relative.startsWith("makaleler/")) {
    for (const marker of ['"@type":"Article"', '"@type":"BreadcrumbList"', '"datePublished"', '"dateModified"']) {
      if (!html.includes(marker)) errors.push(`${relative}: ${marker} structured data içinde yok.`);
    }
    if (!html.includes("Son güncelleme:")) errors.push(`${relative}: görünür Son güncelleme bilgisi yok.`);
  }
}

const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const marker of ['"@type":"Person"', '"@type":"LegalService"', '"@type":"WebSite"']) {
  if (!homepage.includes(marker)) errors.push(`index.html: ${marker} structured data içinde yok.`);
}
if (homepage.includes("Kişisel Veri Hukuku")) {
  errors.push("index.html: kaldırılması gereken Kişisel Veri Hukuku çalışma alanı hâlâ görünüyor.");
}

const sitemapPath = path.join(root, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  errors.push("sitemap.xml oluşturulmadı.");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!locs.length) errors.push("sitemap.xml URL içermiyor.");
  if (new Set(locs).size !== locs.length) errors.push("sitemap.xml tekrar eden URL içeriyor.");
  if (locs.some((url) => url.includes("/kisisel-veri-hukuku/"))) errors.push("Noindex Kişisel Veri Hukuku sayfası sitemap içinde.");
}

if (errors.length) {
  console.error("\nÜretilen site SEO denetimi başarısız:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Üretilen site SEO denetimi başarılı: ${htmlFiles.length} HTML dosyası kontrol edildi.`);
