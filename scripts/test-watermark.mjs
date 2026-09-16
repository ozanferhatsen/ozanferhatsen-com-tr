import assert from "assert";
import { generateWatermarkSeed, injectWatermark, extractWatermarks } from "../lib/watermark-service.js";
import { createEphemeralToken, verifyEphemeralToken } from "../lib/security-token.js";

console.log("=== 1. Filigran Steganografi Testi Başlıyor ===");

const sampleLegalText = `T.C. YARGITAY HUKUK GENEL KURULU
ESAS NO: 2023/648 KARAR NO: 2025/512

DAVA VE UYUŞMAZLIK:
Davacı vekili dava dilekçesinde özetle; müvekkilinin dava konusu taşınmazda 1 nolu bağımsız bölüm maliki olduğunu, 6306 sayılı Kanun kapsamında yapının riskli olarak tespit edildiğini ve binanın yıkıldığını, ancak kat mülkiyeti kurulurken arsa paylarının bağımsız bölümlerin gerçek değerlerine göre dağıtılmadığını belirterek arsa payının düzeltilmesini talep etmiştir.

HUKUKİ DEĞERLENDİRME:
634 sayılı Kat Mülkiyeti Kanunu'nun 3. maddesi uyarınca arsa payları bağımsız bölümlerin konum, büyüklük ve niteliklerine göre tahsis edilmelidir. Dava sırasında binanın kentsel dönüşüm kapsamında yıkılmış olması, arsa payı oranlarının arsa halindeki mülkiyet payını doğrudan belirleyecek olması sebebiyle davacının hukuki yararını ortadan kaldırmaz.

SONUÇ:
Hukuk Genel Kurulunca direnme kararının bozulmasına oybirliğiyle karar verilmiştir.`;

const seed = generateWatermarkSeed({
  sessionId: "sess_test_123456",
  ipHash: "a1b2c3d4e5f6",
  decisionId: "yhgk-2023-648",
  timestamp: 1789578000000
});

console.log("Üretilen Tohum:", seed);
assert(seed.startsWith("OFS-1789578000000-"), "Tohum formatı hatalı");

// Filigran gömme
const watermarkedText = injectWatermark(sampleLegalText, seed);

// Gözle görünen karakter sayısı değişmemeli (tüm görünmez karakterler filtrelendiğinde)
const cleanOriginal = sampleLegalText.replace(/\s+/g, " ").trim();
const cleanWatermarked = watermarkedText.replace(/[\u200B-\u200D\u2060\uFEFF]/g, "").replace(/\s+/g, " ").trim();
assert.strictEqual(cleanOriginal, cleanWatermarked, "Metnin görünür içeriği bozulmuş!");
console.log("✓ Görünür metin bütünlüğü korundu.");

// Filigran çıkarma
const extracted = extractWatermarks(watermarkedText);
console.log("Çıkarılan Filigranlar:", extracted);
assert.strictEqual(extracted.length, 1, "Filigran tespit edilemedi");
assert.strictEqual(extracted[0], seed, "Çıkarılan filigran orijinal tohum ile eşleşmedi");
console.log("✓ Adli delil filigranı başarıyla çıkarıldı ve doğrulandı.");

console.log("\n=== 2. Kısa Ömürlü Güvenlik Token Testi Başlıyor ===");

// Geçerli token
const token = createEphemeralToken({
  decisionId: "yhgk-2023-648",
  sessionId: "sess_user_999"
});

console.log("Oluşturulan Token:", token.slice(0, 35) + "...");
const verifyValid = verifyEphemeralToken(token, "yhgk-2023-648");
assert.strictEqual(verifyValid.valid, true, "Geçerli token onaylanmadı!");
console.log("✓ Geçerli token başarıyla doğrulandı.");

// Yanlış karar ID denemesi (Bypass testi)
const verifyWrongDecision = verifyEphemeralToken(token, "baska-bir-karar-id");
assert.strictEqual(verifyWrongDecision.valid, false, "Karar ID uyuşmazlığı yakalanmadı!");
assert.strictEqual(verifyWrongDecision.reason, "DECISION_MISMATCH");
console.log("✓ Farklı karar ID ile sahte çağrı engellendi.");

// Kurcalanmış token (Tampering testi)
const tamperedToken = token.slice(0, -4) + "X9Z1";
const verifyTampered = verifyEphemeralToken(tamperedToken, "yhgk-2023-648");
assert.strictEqual(verifyTampered.valid, false, "Kurcalanmış imza yakalanmadı!");
assert.strictEqual(verifyTampered.reason, "SIGNATURE_INVALID");
console.log("✓ İmzası bozulmuş token engellendi.");

// Süresi dolmuş token (Expired testi)
const verifyExpired = verifyEphemeralToken(token, "yhgk-2023-648", { maxAgeMs: -1000 });
assert.strictEqual(verifyExpired.valid, false, "Süresi dolmuş token yakalanmadı!");
assert.strictEqual(verifyExpired.reason, "TOKEN_EXPIRED");
console.log("✓ Süresi dolan token zaman aşımına uğratıldı.");

console.log("\n=== TÜM ADLİ VE GÜVENLİK TESTLERİ BAŞARIYLA GEÇTİ ===");
