import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, '_site');
const ignoredPrefixes = ['/admin/'];
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(full);
  }
}

walk(outputRoot);

const urls = new Set();
for (const file of files) {
  const rel = path.relative(outputRoot, file).split(path.sep).join('/');
  if (rel === 'index.html') urls.add('/');
  else if (rel.endsWith('/index.html')) urls.add(`/${rel.slice(0, -'index.html'.length)}`);
  else urls.add(`/${rel}`);
}

let errors = 0;
let warnings = 0;
const canonicals = new Map();
const titles = new Map();

function fail(message) {
  console.error(`ERROR ${message}`);
  errors++;
}

function warn(message) {
  console.warn(`WARN  ${message}`);
  warnings++;
}

function routeFor(file) {
  const rel = path.relative(outputRoot, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const route = routeFor(file);
  if (ignoredPrefixes.some((prefix) => route.startsWith(prefix))) continue;

  const html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1]?.trim();
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]?.trim();
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1]?.trim();

  if (!title) fail(`${route}: missing <title>`);
  if (!description) fail(`${route}: missing meta description`);
  if (!canonical) fail(`${route}: missing canonical`);
  if (!robots) fail(`${route}: missing robots meta`);

  if (canonical) {
    if (canonicals.has(canonical)) fail(`${route}: duplicate canonical also used by ${canonicals.get(canonical)} -> ${canonical}`);
    else canonicals.set(canonical, route);
  }

  if (title) {
    if (titles.has(title) && route !== '/404.html') warn(`${route}: duplicate title also used by ${titles.get(title)} -> ${title}`);
    else titles.set(title, route);
  }

  if (html.includes('Arama motorları için ayrı konu kümeleri')) {
    fail(`${route}: internal SEO copy leaked into rendered page`);
  }

  if (route.startsWith('/makaleler/') && route !== '/makaleler/') {
    if (!html.includes('"@type":"Article"')) fail(`${route}: Article structured data missing`);
    if (!html.includes('"datePublished"')) fail(`${route}: datePublished missing from Article schema`);
    if (!html.includes('"dateModified"')) fail(`${route}: dateModified missing from Article schema`);
    if (!html.includes('"@type":"BreadcrumbList"')) fail(`${route}: BreadcrumbList structured data missing`);
  }

  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = match[1].trim();
    if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean.startsWith('/')) continue;
    if (!urls.has(clean)) fail(`${route}: broken internal link -> ${clean}`);
  }
}

const sitemapPath = path.join(outputRoot, 'sitemap.xml');
const robotsPath = path.join(outputRoot, 'robots.txt');
if (!fs.existsSync(sitemapPath)) fail('/sitemap.xml: generated sitemap missing');
if (!fs.existsSync(robotsPath)) fail('/robots.txt: generated robots file missing');
if (fs.existsSync(robotsPath) && !fs.readFileSync(robotsPath, 'utf8').includes('Sitemap: https://ozanferhatsen.com.tr/sitemap.xml')) {
  fail('/robots.txt: sitemap directive missing or incorrect');
}

console.log(`Rendered SEO audit complete: ${files.filter((f) => f.endsWith('.html')).length} HTML page(s), ${errors} error(s), ${warnings} warning(s).`);
if (errors > 0) process.exit(1);
