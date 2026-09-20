import { readdir, readFile, mkdir, rm, stat } from "node:fs/promises";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";

const SITE_DIR = path.resolve("_site");
const ARTICLE_DIR = path.join(SITE_DIR, "makaleler");
const PDF_DIR = path.join(SITE_DIR, "pdf");
const PORT = Number(process.env.PDF_PREVIEW_PORT || 4173);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

function findChrome() {
  const explicit = process.env.CHROME_BIN;
  const candidates = [
    explicit,
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.startsWith("/")) {
      const probe = spawnSync("test", ["-x", candidate]);
      if (probe.status === 0) return candidate;
      continue;
    }
    const probe = spawnSync("which", [candidate], { encoding: "utf8" });
    if (probe.status === 0 && probe.stdout.trim()) return probe.stdout.trim();
  }
  throw new Error("Chrome/Chromium bulunamadı. PDF üretimi için CHROME_BIN tanımlayın.");
}

async function waitForServer(url, attempts = 50) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  throw new Error("Yerel önizleme sunucusu başlatılamadı.");
}

function runChrome(chrome, url, outputPath) {
  const args = [
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--hide-scrollbars",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=1800",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outputPath}`,
    url
  ];

  const result = spawnSync(chrome, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`Chrome PDF üretiminde hata verdi: ${url}`);
  }
}

async function main() {
  const chrome = findChrome();
  const htmlFiles = (await walk(ARTICLE_DIR)).filter((file) => file.endsWith("index.html"));
  const articles = [];

  for (const htmlPath of htmlFiles) {
    const html = await readFile(htmlPath, "utf8");
    const match = html.match(/data-pdf-slug="([^"]+)"/i);
    if (!match) continue;

    const slug = match[1].trim();
    if (!slug) continue;

    const relativeDir = path.relative(SITE_DIR, path.dirname(htmlPath)).split(path.sep).join("/");
    articles.push({ slug, relativeDir });
  }

  const unique = new Map();
  for (const article of articles) unique.set(article.slug, article);

  await rm(PDF_DIR, { recursive: true, force: true });
  await mkdir(PDF_DIR, { recursive: true });

  const server = spawn(
    "python3",
    ["-m", "http.server", String(PORT), "--bind", "127.0.0.1", "--directory", SITE_DIR],
    { stdio: "ignore" }
  );

  try {
    await waitForServer(`http://127.0.0.1:${PORT}/`);

    let completed = 0;
    for (const article of unique.values()) {
      const url = `http://127.0.0.1:${PORT}/${article.relativeDir}/?pdf=1`;
      const outputPath = path.join(PDF_DIR, `${article.slug}.pdf`);
      runChrome(chrome, url, outputPath);

      const info = await stat(outputPath);
      if (info.size < 1500) {
        throw new Error(`PDF beklenenden küçük üretildi: ${article.slug}.pdf`);
      }

      completed++;
      process.stdout.write(`PDF ${completed}/${unique.size}: ${article.slug}.pdf\n`);
    }

    if (completed === 0) throw new Error("PDF üretilecek makale bulunamadı.");
    process.stdout.write(`Toplam ${completed} makale PDF'i üretildi.\n`);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
