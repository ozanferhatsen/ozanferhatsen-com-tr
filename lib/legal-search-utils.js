const AREA_ALIASES = new Map([
  ["gayrimenkul", "gayrimenkul"],
  ["gayrimenkul hukuku", "gayrimenkul"],
  ["imar", "imar"],
  ["imar hukuku", "imar"],
  ["insaat", "insaat"],
  ["inşaat", "insaat"],
  ["inşaat hukuku", "insaat"],
  ["kentsel donusum", "kentsel-donusum"],
  ["kentsel dönüşüm", "kentsel-donusum"],
  ["kentsel dönüşüm hukuku", "kentsel-donusum"],
  ["bilisim", "bilisim"],
  ["bilişim", "bilisim"],
  ["bilişim hukuku", "bilisim"],
  ["kira", "kira"],
  ["kira hukuku", "kira"],
  ["other", "other"],
  ["diger", "other"],
  ["diğer", "other"]
]);

const CATEGORY_AREAS = new Map([
  ["gayrimenkul hukuku", "gayrimenkul"],
  ["imar hukuku", "imar"],
  ["inşaat hukuku", "insaat"],
  ["kentsel dönüşüm", "kentsel-donusum"],
  ["kentsel dönüşüm hukuku", "kentsel-donusum"],
  ["bilişim hukuku", "bilisim"],
  ["kira hukuku", "kira"]
]);

function normalizeLabel(value = "") {
  return String(value).normalize("NFC").trim().toLocaleLowerCase("tr-TR");
}

export function normalizeSearchArea(value) {
  if (!value) return null;
  return AREA_ALIASES.get(normalizeLabel(value)) || null;
}

export function resolveSearchArea(item = {}) {
  const data = item.data || {};
  const explicit = normalizeSearchArea(data.search_area || data.area);
  if (explicit) return explicit;

  const category = CATEGORY_AREAS.get(normalizeLabel(data.category));
  if (category) return category;

  const path = `${item.inputPath || ""} ${item.url || ""}`.toLocaleLowerCase("tr-TR");
  if (path.includes("/bilisim-hukuku/")) return "bilisim";
  if (path.includes("/imar-hukuku/")) return "imar";
  if (path.includes("/insaat-hukuku/") || path.includes("/inşaat-hukuku/")) return "insaat";
  if (path.includes("/kentsel-donusum-hukuku/") || path.includes("/kentsel-dönüşüm-hukuku/")) return "kentsel-donusum";
  if (path.includes("/gayrimenkul-hukuku/")) return "gayrimenkul";
  if (path.includes("/kira-hukuku/")) return "kira";

  return "other";
}

export function headingTextFromHtml(value = "") {
  return String(value)
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

export function slugifySearchHeading(value = "") {
  return String(value)
    .normalize("NFC")
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[’'`]/g, "")
    .replace(/&/g, " ve ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function createHeadingIdAllocator() {
  const used = new Set();

  return function allocateHeadingId(text, explicitId = "") {
    const preserved = String(explicitId || "").trim();
    if (preserved) {
      used.add(preserved);
      return preserved;
    }

    const base = slugifySearchHeading(text) || "bolum";
    let candidate = base;
    let suffix = 2;

    while (used.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    used.add(candidate);
    return candidate;
  };
}

export function addMissingSearchHeadingIds(html = "") {
  const allocateId = createHeadingIdAllocator();

  return String(html).replace(
    /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (full, level, attrs, innerHtml) => {
      const idMatch = String(attrs).match(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const explicitId = idMatch ? (idMatch[1] || idMatch[2] || idMatch[3] || "") : "";
      const headingText = headingTextFromHtml(innerHtml);
      const id = allocateId(headingText, explicitId);

      if (explicitId || !id) return full;
      return `<h${level}${attrs} id="${id}">${innerHtml}</h${level}>`;
    }
  );
}
