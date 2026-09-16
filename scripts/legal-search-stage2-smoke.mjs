import fs from "node:fs";
import { parseDecisionMetadata } from "../lib/legal-search-utils.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parse(sample) {
  return parseDecisionMetadata(sample);
}

const hgk = parse({
  type: "ictihat",
  title: "Yargıtay HGK E. 2023/648 K. 2025/512 | Arsa Payı Davası",
  text: "Esas No: 2023/648 Karar No: 2025/512"
});
assert(hgk.court_code === "HGK", "HGK mahkeme kodu ayrıştırılamadı");
assert(hgk.esas === "2023/648", "HGK esas numarası ayrıştırılamadı");
assert(hgk.karar === "2025/512", "HGK karar numarası ayrıştırılamadı");
assert(hgk.decision_year === 2025, "HGK karar yılı ayrıştırılamadı");

const chamber = parse({
  type: "ictihat",
  title: "Yargıtay 6. HD E. 2025/2041 K. 2026/1191",
  text: "Esas No: 2025/2041 Karar No: 2026/1191"
});
assert(chamber.court === "Yargıtay", "Yargıtay mahkeme adı ayrıştırılamadı");
assert(chamber.chamber === "6. Hukuk Dairesi", "Hukuk Dairesi ayrıştırılamadı");
assert(chamber.court_code === "6. HD", "Hukuk Dairesi kodu ayrıştırılamadı");
assert(chamber.esas === "2025/2041" && chamber.karar === "2026/1191", "Daire E/K numarası ayrıştırılamadı");

const ibbgk = parse({
  type: "ictihat",
  title: "Yargıtay İBBGK E. 2024/1 K. 2025/2",
  text: ""
});
assert(ibbgk.court_code === "İBBGK", "İBBGK kodu ayrıştırılamadı");

const aym = parse({
  type: "ictihat",
  title: "Anayasa Mahkemesi kararı",
  text: ""
});
assert(aym.court_code === "AYM", "AYM kodu ayrıştırılamadı");

const articleWithCitation = parse({
  type: "makale",
  title: "Arsa Payı ve Üçüncü Kişinin İyiniyeti",
  text: "Yargıtay HGK E. 2023/648 K. 2025/512 sayılı kararında..."
});
assert(articleWithCitation.esas === null && articleWithCitation.karar === null, "Makale içindeki atıf yanlışlıkla ana künye olarak ayrıştırıldı");

const ontology = JSON.parse(fs.readFileSync("assets/legal-search-ontology.json", "utf8"));
assert(ontology.version === 1, "Hukuk ontolojisi sürümü bulunamadı");
assert(Array.isArray(ontology.symmetric) && ontology.symmetric.length >= 4, "Simetrik hukuk sözlüğü eksik");
assert(Array.isArray(ontology.one_way) && ontology.one_way.length >= 2, "Asimetrik hukuk sözlüğü eksik");
assert(Array.isArray(ontology.abbreviations) && ontology.abbreviations.some((item) => item.term === "DOP"), "DOP genişletmesi eksik");
assert(ontology.abbreviations.some((item) => item.term === "HGK"), "HGK genişletmesi eksik");
assert(ontology.abbreviations.some((item) => item.term === "İBBGK"), "İBBGK genişletmesi eksik");

const indexPath = "_site/search-index.json";
assert(fs.existsSync(indexPath), "Derlenmiş search-index.json bulunamadı");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
assert(Array.isArray(index) && index.length > 0, "Arama indeksi boş");

const hgkUrl = "/ictihat/yargitay-hukuk-genel-kurulu-2023-648-2025-512-arsa-payi-yikim-hukuki-yarar/";
const hgkRecord = index.find((record) => record.id === hgkUrl || record.url === hgkUrl);
assert(hgkRecord, "Bilinen HGK kararı arama indeksine girmedi");
assert(hgkRecord.esas === "2023/648", "Derlenmiş indekste HGK esas numarası yanlış");
assert(hgkRecord.karar === "2025/512", "Derlenmiş indekste HGK karar numarası yanlış");
assert(hgkRecord.court_code === "HGK", "Derlenmiş indekste HGK mahkeme kodu yanlış");
assert(
  Array.isArray(hgkRecord.decision_refs)
    ? hgkRecord.decision_refs.includes("2023/648")
    : String(hgkRecord.decision_refs || "").includes("2023/648"),
  "Derlenmiş indekste decision_refs eksik"
);

const chamberUrl = "/ictihat/yargitay-6-hukuk-dairesi-2025-2041-2026-1191-ucuncu-kisi-tapu/";
const chamberRecord = index.find((record) => record.id === chamberUrl || record.url === chamberUrl);
assert(chamberRecord, "Bilinen 6. HD kararı arama indeksine girmedi");
assert(chamberRecord.esas === "2025/2041" && chamberRecord.karar === "2026/1191", "Derlenmiş 6. HD künyesi yanlış");
assert(chamberRecord.court_code === "6. HD", "Derlenmiş 6. HD kodu yanlış");

// Thin index validations:
// 1. Her kayıt tekil bir dokümandır, URL içinde '#' bölüm çapası bulunmamalıdır.
const sectionRecord = index.find((record) => record.url && record.url.includes("#"));
assert(!sectionRecord, "Thin search indeksi bölüm/anchor kaydı içermemeli, belge düzeyinde olmalıdır");

// 2. search_version: 3 olmalı
assert(index.every((record) => record.search_version === 3), "Tüm kayıtlarda search_version: 3 olmalıdır");

// 3. Kesinlikle hiçbir kayıtta 'content' veya 'text' alanı olmamalıdır
const leakedRecord = index.find((record) => Object.hasOwn(record, "content") || Object.hasOwn(record, "text"));
assert(!leakedRecord, "GÜVENLİK İHLALİ: search-index.json içinde content veya text alanı bulundu!");

// 4. headings dizisi korunmalıdır
const recordWithHeadings = index.find((record) => Array.isArray(record.headings) && record.headings.length > 0);
assert(recordWithHeadings, "Belgelerdeki headings dizisi korunamadı");

// 5. Boyut kontrolü: 300 KB altında olmalıdır
const indexSizeBytes = fs.statSync(indexPath).size;
assert(indexSizeBytes < 300 * 1024, `Thin index boyutu 300 KB sınırını aştı: ${(indexSizeBytes / 1024).toFixed(1)} KB`);

console.log(`Legal Search Thin Index smoke: ${index.length} belge kaydı (${(indexSizeBytes / 1024).toFixed(1)} KB) başarıyla doğrulandı.`);
