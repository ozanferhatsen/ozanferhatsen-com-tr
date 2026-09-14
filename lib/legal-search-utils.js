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

export function foldLegalSearchText(value = "") {
  return String(value)
    .normalize("NFC")
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
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

export function normalizeDecisionNumber(value = "") {
  const match = String(value).match(/(\d{4})\s*\/\s*(\d+(?:[-/]\d+)*)/);
  if (!match) return null;
  return `${match[1]}/${match[2].replace(/\s+/g, "")}`;
}

function extractLabeledDecisionNumber(text, label) {
  const source = String(text || "");
  const prefix = label === "esas"
    ? /(?:\bEsas(?:\s+No(?:su)?)?|\bE)\s*[\.,:]?\s*(\d{4}\s*\/\s*\d+(?:[-/]\d+)*)/iu
    : /(?:\bKarar(?:\s+No(?:su)?)?|\bK)\s*[\.,:]?\s*(\d{4}\s*\/\s*\d+(?:[-/]\d+)*)/iu;
  const suffix = label === "esas"
    ? /(\d{4}\s*\/\s*\d+(?:[-/]\d+)*)\s*E\s*\.?/iu
    : /(\d{4}\s*\/\s*\d+(?:[-/]\d+)*)\s*K\s*\.?/iu;

  const match = source.match(prefix) || source.match(suffix);
  return match ? normalizeDecisionNumber(match[1]) : null;
}

function courtDescriptor(text, data = {}) {
  const explicitCourt = String(data.court || "").trim();
  const explicitChamber = String(data.chamber || "").trim();
  const source = `${explicitCourt} ${explicitChamber} ${text || ""}`;
  const folded = foldLegalSearchText(source);

  const chamberMatch = folded.match(/(?:yargitay\s+)?(\d{1,2})\s*\.?\s*(?:hukuk\s+dairesi|hd)\b/);
  if (chamberMatch) {
    const chamberNumber = chamberMatch[1];
    return {
      court: explicitCourt || "Yargıtay",
      chamber: explicitChamber || `${chamberNumber}. Hukuk Dairesi`,
      court_code: `${chamberNumber}. HD`
    };
  }

  if (/\b(?:hgk|hukuk genel kurulu)\b/.test(folded)) {
    return {
      court: explicitCourt || "Yargıtay Hukuk Genel Kurulu",
      chamber: explicitChamber || null,
      court_code: "HGK"
    };
  }

  if (/\b(?:ibbgk|ictihatlari birlestirme buyuk genel kurulu)\b/.test(folded)) {
    return {
      court: explicitCourt || "Yargıtay İçtihatları Birleştirme Büyük Genel Kurulu",
      chamber: explicitChamber || null,
      court_code: "İBBGK"
    };
  }

  if (/\b(?:aym|anayasa mahkemesi)\b/.test(folded)) {
    return {
      court: explicitCourt || "Anayasa Mahkemesi",
      chamber: explicitChamber || null,
      court_code: "AYM"
    };
  }

  if (folded.includes("yargitay")) {
    return {
      court: explicitCourt || "Yargıtay",
      chamber: explicitChamber || null,
      court_code: "Yargıtay"
    };
  }

  return {
    court: explicitCourt || null,
    chamber: explicitChamber || null,
    court_code: null
  };
}

export function parseDecisionMetadata({ data = {}, title = "", text = "", type = "" } = {}) {
  const explicitEsas = normalizeDecisionNumber(data.esas || data.esas_no || data.docket_number || "");
  const explicitKarar = normalizeDecisionNumber(data.karar || data.karar_no || data.decision_number || "");

  // Makale ve Karar Haritaları çok sayıda karar atfı içerebildiği için gövde metninden
  // tek bir "asıl karar" türetilmez. Otomatik künye çıkarımı yalnız içtihat sayfalarında yapılır.
  const mayInferFromBody = type === "ictihat";
  const source = mayInferFromBody ? `${title}\n${String(text || "").slice(0, 7000)}` : String(title || "");

  const esas = explicitEsas || (mayInferFromBody ? extractLabeledDecisionNumber(source, "esas") : null);
  const karar = explicitKarar || (mayInferFromBody ? extractLabeledDecisionNumber(source, "karar") : null);

  // Mahkeme/daire tespitinde gövde atıflarının asıl kararı ezmesini önlemek için
  // başlık birincil kaynaktır. Başlık bilgi vermiyorsa yalnız gövdenin ilk kısmına düşülür.
  let descriptor = courtDescriptor(String(title || ""), data);
  if (!descriptor.court_code && mayInferFromBody) {
    descriptor = courtDescriptor(String(text || "").slice(0, 1600), data);
  }

  const explicitYear = data.decision_year ?? data.year;
  let decisionYear = null;
  if (explicitYear !== undefined && explicitYear !== null && String(explicitYear).trim()) {
    const parsed = Number.parseInt(String(explicitYear), 10);
    decisionYear = Number.isFinite(parsed) ? parsed : null;
  }
  if (!decisionYear && karar) {
    const parsed = Number.parseInt(karar.slice(0, 4), 10);
    if (Number.isFinite(parsed)) decisionYear = parsed;
  }

  const decisionRefs = [];
  if (esas) decisionRefs.push(esas, `E ${esas}`, `Esas ${esas}`);
  if (karar) decisionRefs.push(karar, `K ${karar}`, `Karar ${karar}`);

  const courtTerms = [descriptor.court, descriptor.chamber, descriptor.court_code]
    .filter(Boolean)
    .join(" ");

  return {
    court: descriptor.court,
    chamber: descriptor.chamber,
    court_code: descriptor.court_code,
    esas,
    karar,
    decision_year: decisionYear,
    decision_refs: Array.from(new Set(decisionRefs)).join(" "),
    court_terms: courtTerms
  };
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
