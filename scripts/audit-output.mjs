import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, '_site');
const siteOrigin = 'https://ozanferhatsen.com.tr';
const ignoredPrefixes = ['/admin/'];
const allowedNoindexRoutes = new Set(['/404.html', '/gizlilik/']);
const maxReferencedImageBytes = 500 * 1024;
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
const indexableCanonicals = new Map();

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

function collectSchemaTypes(value, out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectSchemaTypes(item, out);
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  if (typeof value['@type'] === 'string') out.add(value['@type']);
  if (Array.isArray(value['@type'])) {
    for (const type of value['@type']) if (typeof type === 'string') out.add(type);
  }
  for (const child of Object.values(value)) collectSchemaTypes(child, out);
  return out;
}

function parseJsonLd(html, route) {
  const docs = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = match[1].trim();
    try {
      docs.push(JSON.parse(raw));
    } catch (error) {
      fail(`${route}: invalid JSON-LD -> ${error.message}`);
    }
  }
  return docs;
}

function localAssetPath(ref) {
  if (!ref) return null;
  let value = ref.trim().split(/\s+/)[0];
  if (!value) return null;
  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      if (url.origin !== siteOrigin) return null;
      value = url.pathname;
    }
  } catch {
    return null;
  }
  if (!value.startsWith('/')) return null;
  return value.split('?')[0].split('#')[0];
}

function checkReferencedImage(ref, route) {
  const assetPath = localAssetPath(ref);
  if (!assetPath || !/\.(?:png|jpe?g|webp|gif|avif)$/i.test(assetPath)) return;
  const diskPath = path.join(outputRoot, assetPath.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    fail(`${route}: referenced local image missing -> ${assetPath}`);
    return;
  }
  const bytes = fs.statSync(diskPath).size;
  if (bytes > maxReferencedImageBytes) {
    fail(`${route}: referenced image too large (${Math.round(bytes / 1024)} KB) -> ${assetPath}`);
  }
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

  const hasNoindex = Boolean(robots && /(?:^|,)\s*noindex\s*(?:,|$)/i.test(robots));
  if (hasNoindex && !allowedNoindexRoutes.has(route)) {
    fail(`${route}: unexpected noindex on public page`);
  }
  if (!hasNoindex && allowedNoindexRoutes.has(route)) {
    fail(`${route}: expected noindex is missing`);
  }

  if (canonical) {
    if (canonicals.has(canonical)) fail(`${route}: duplicate canonical also used by ${canonicals.get(canonical)} -> ${canonical}`);
    else canonicals.set(canonical, route);

    try {
      const canonicalUrl = new URL(canonical);
      if (canonicalUrl.origin !== siteOrigin) fail(`${route}: canonical points outside primary origin -> ${canonical}`);
      if (canonicalUrl.search || canonicalUrl.hash) fail(`${route}: canonical must not contain query/hash -> ${canonical}`);
      if (!hasNoindex) {
        const expectedCanonical = `${siteOrigin}${route}`;
        if (canonical !== expectedCanonical) fail(`${route}: canonical mismatch, expected ${expectedCanonical} -> ${canonical}`);
        indexableCanonicals.set(canonical, route);
      }
    } catch {
      fail(`${route}: canonical is not a valid URL -> ${canonical}`);
    }
  }

  if (title) {
    if (titles.has(title) && route !== '/404.html') warn(`${route}: duplicate title also used by ${titles.get(title)} -> ${title}`);
    else titles.set(title, route);
  }

  if (html.includes('Arama motorları için ayrı konu kümeleri')) {
    fail(`${route}: internal SEO copy leaked into rendered page`);
  }

  const schemaDocs = parseJsonLd(html, route);
  const schemaTypes = new Set();
  for (const doc of schemaDocs) collectSchemaTypes(doc, schemaTypes);
  for (const requiredType of ['Person', 'LegalService', 'WebSite']) {
    if (!schemaTypes.has(requiredType)) fail(`${route}: global ${requiredType} structured data missing`);
  }

  if (route.startsWith('/makaleler/') && route !== '/makaleler/') {
    if (!schemaTypes.has('Article')) fail(`${route}: Article structured data missing`);
    if (!schemaTypes.has('BreadcrumbList')) fail(`${route}: BreadcrumbList structured data missing`);
    if (!html.includes('"datePublished"')) fail(`${route}: datePublished missing from Article schema`);
    if (!html.includes('"dateModified"')) fail(`${route}: dateModified missing from Article schema`);
    if (canonical && !html.includes(`"@id":"${canonical}#article"`)) fail(`${route}: Article @id does not match canonical`);
  }

  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = match[1].trim();
    if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean.startsWith('/')) continue;
    if (!urls.has(clean)) fail(`${route}: broken internal link -> ${clean}`);
  }

  for (const match of html.matchAll(/<(?:img|source)\b[^>]*\b(?:src|srcset)=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(',')) checkReferencedImage(candidate.trim(), route);
  }
  for (const match of html.matchAll(/<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/gi)) {
    checkReferencedImage(match[1], route);
  }
}

const sitemapPath = path.join(outputRoot, 'sitemap.xml');
const robotsPath = path.join(outputRoot, 'robots.txt');
if (!fs.existsSync(sitemapPath)) fail('/sitemap.xml: generated sitemap missing');
if (!fs.existsSync(robotsPath)) fail('/robots.txt: generated robots file missing');

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1].trim());
  const uniqueSitemapUrls = new Set(sitemapUrls);
  if (uniqueSitemapUrls.size !== sitemapUrls.length) fail('/sitemap.xml: duplicate <loc> entries found');

  for (const [canonical, route] of indexableCanonicals) {
    if (!uniqueSitemapUrls.has(canonical)) fail(`/sitemap.xml: indexable page missing -> ${route}`);
  }

  for (const loc of uniqueSitemapUrls) {
    try {
      const url = new URL(loc);
      if (url.origin !== siteOrigin) fail(`/sitemap.xml: external URL found -> ${loc}`);
      if (allowedNoindexRoutes.has(url.pathname)) fail(`/sitemap.xml: noindex page included -> ${loc}`);
      if (!urls.has(url.pathname)) fail(`/sitemap.xml: URL does not exist in rendered output -> ${loc}`);
    } catch {
      fail(`/sitemap.xml: invalid URL -> ${loc}`);
    }
  }
}

if (fs.existsSync(robotsPath)) {
  const robotsText = fs.readFileSync(robotsPath, 'utf8');
  if (!robotsText.includes('Sitemap: https://ozanferhatsen.com.tr/sitemap.xml')) {
    fail('/robots.txt: sitemap directive missing or incorrect');
  }
  if (!robotsText.includes('Disallow: /admin/')) fail('/robots.txt: /admin/ should be blocked');
  if (/^Disallow:\s*\/$/mi.test(robotsText)) fail('/robots.txt: site-wide crawl block detected');
}

console.log(`Rendered SEO audit complete: ${files.filter((f) => f.endsWith('.html')).length} HTML page(s), ${errors} error(s), ${warnings} warning(s).`);
if (errors > 0) process.exit(1);
