import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const articleDir = path.join(root, 'content', 'makaleler');
const files = fs.readdirSync(articleDir).filter((name) => name.endsWith('.md'));
const slugSet = new Set(files.map((name) => name.replace(/\.md$/, '')));
const requiredFields = ['title', 'date', 'updated', 'category', 'seo_title', 'description'];
const competitorDomains = ['lexpera.com.tr'];
const officialDomains = [
  'mevzuat.gov.tr',
  'resmigazete.gov.tr',
  'anayasa.gov.tr',
  'kararlarbilgibankasi.anayasa.gov.tr',
  'yargitay.gov.tr',
  'danistay.gov.tr',
  'ticaretsicil.gov.tr',
  'tkgm.gov.tr',
  'csb.gov.tr',
  'adalet.gov.tr'
];

const monthMap = {
  ocak: 1, şubat: 2, mart: 3, nisan: 4, mayıs: 5, haziran: 6,
  temmuz: 7, ağustos: 8, eylül: 9, ekim: 10, kasım: 11, aralık: 12
};

function parseFrontmatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { data: {}, body: text };
  const data = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[m[1]] = value;
  }
  return { data, body: text.slice(match[0].length) };
}

function asDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDate(out, year, month, day, raw) {
  const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
  if (!Number.isNaN(d.getTime())) out.push({ date: d, raw });
}

function extractFullDates(body) {
  const out = [];
  for (const m of body.matchAll(/\b(\d{1,2})[.\/-](\d{1,2})[.\/-](20\d{2})\b/g)) {
    addDate(out, m[3], m[2], m[1], m[0]);
  }
  for (const m of body.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)) {
    addDate(out, m[1], m[2], m[3], m[0]);
  }
  const months = Object.keys(monthMap).join('|');
  const textual = new RegExp(`\\b(\\d{1,2})\\s+(${months})\\s+(20\\d{2})\\b`, 'giu');
  for (const m of body.matchAll(textual)) {
    addDate(out, m[3], monthMap[m[2].toLocaleLowerCase('tr-TR')], m[1], m[0]);
  }
  return out;
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

let errors = 0;
let warnings = 0;

for (const name of files) {
  const fullPath = path.join(articleDir, name);
  const text = fs.readFileSync(fullPath, 'utf8');
  const { data, body } = parseFrontmatter(text);

  for (const field of requiredFields) {
    if (!data[field]) {
      console.error(`ERROR ${name}: missing frontmatter field ${field}`);
      errors++;
    }
  }

  const published = asDate(data.date);
  const modified = asDate(data.updated);
  if (!published) {
    console.error(`ERROR ${name}: invalid date '${data.date || ''}'`);
    errors++;
  }
  if (!modified) {
    console.error(`ERROR ${name}: invalid updated '${data.updated || ''}'`);
    errors++;
  }
  if (published && modified && modified < published) {
    console.error(`ERROR ${name}: updated date is earlier than published date`);
    errors++;
  }

  if (modified) {
    for (const found of extractFullDates(body)) {
      if (found.date.getTime() > modified.getTime() + 24 * 60 * 60 * 1000) {
        console.error(`ERROR ${name}: content cites ${found.raw}, later than updated=${data.updated}`);
        errors++;
      }
    }
  }

  for (const m of body.matchAll(/\]\(\/makaleler\/([^/)#?]+)\/?(?:#[^)]*)?\)/g)) {
    const slug = m[1];
    if (!slugSet.has(slug)) {
      console.error(`ERROR ${name}: broken internal article link -> ${slug}`);
      errors++;
    }
  }

  for (const m of body.matchAll(/https?:\/\/[^\s)>"]+/g)) {
    const url = m[0].replace(/[.,;]+$/, '');
    const host = hostOf(url);
    if (!host) continue;
    if (competitorDomains.some((d) => host === d || host.endsWith(`.${d}`))) {
      console.error(`ERROR ${name}: competitor/legal database link found -> ${url}`);
      errors++;
    } else if (!officialDomains.some((d) => host === d || host.endsWith(`.${d}`))) {
      console.warn(`WARN  ${name}: non-official external source -> ${url}`);
      warnings++;
    }
  }
}

const siteFiles = [
  '_includes/base.njk',
  'index.html',
  'sitemap.njk',
  'robots.txt'
].map((p) => path.join(root, p));

for (const file of siteFiles) {
  if (!fs.existsSync(file)) {
    console.error(`ERROR missing site file: ${path.relative(root, file)}`);
    errors++;
  }
}

const base = fs.readFileSync(path.join(root, '_includes', 'base.njk'), 'utf8');
if (!base.includes('rel="canonical"')) {
  console.error('ERROR base.njk: canonical tag missing');
  errors++;
}
if (!base.includes('meta name="robots"')) {
  console.error('ERROR base.njk: robots meta missing');
  errors++;
}
if (base.includes('/kisisel-veri-hukuku/') || base.includes('>KVKK<')) {
  console.error('ERROR base.njk: removed KVKK/personal-data practice link still present');
  errors++;
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.njk'), 'utf8');
if (sitemap.includes('/kvkk/') || sitemap.includes('/kisisel-veri-hukuku/')) {
  console.error('ERROR sitemap.njk: removed KVKK/personal-data route is still indexed');
  errors++;
}

console.log(`SEO audit complete: ${files.length} articles, ${errors} error(s), ${warnings} warning(s).`);
if (errors > 0) process.exit(1);
