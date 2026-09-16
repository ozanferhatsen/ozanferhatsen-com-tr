# CLOUDFLARE GÜVENLİK VE ANTI-SCRAPING KURALLARI SPESİFİKASYONU

Bu belge, `ozanferhatsen.com.tr` alan adı altındaki içtihat veri tabanının (30.000+ karar) botlar, scraper'lar ve kötü niyetli üçüncü şahıslarca çekilmesini engellemek için Cloudflare kontrol panelinde aktifleştirilecek güvenlik kurallarını içerir.

---

## 1. Cloudflare Bot Fight Mode ve WAF Kuralları

### A. Bot Fight Mode (Otomatik Bot Kalkanı)
* **Konum:** Cloudflare Dashboard -> `Security` -> `Bots` -> `Bot Fight Mode`
* **Aksiyon:** **AÇIK (ON)**
* **Görevi:** Bilinen arama motoru botları (Google, Bing) haricindeki tüm tespit edilmiş otomatik botları, headless tarayıcıları (Puppeteer, Playwright) ve Python scraping kütüphanelerini doğrudan engeller.

### B. Özel WAF Kuralı: Scraper Başlıklarının Engellenmesi (İkincil Savunma)
* **Kural Adı:** `Block Malicious Scraping User-Agents`
* **İfade (Expression):**
  ```text
  (http.user_agent contains "python-requests") or 
  (http.user_agent contains "aiohttp") or 
  (http.user_agent contains "scrapy") or 
  (http.user_agent contains "curl/") or 
  (http.user_agent contains "wget") or 
  (http.user_agent contains "postman")
  ```
* **Aksiyon:** **Block (HTTP 403)**

---

## 2. Çok Katmanlı Hız Sınırı (Multi-Tier Rate Limiting Kuralları)

* **Konum:** Cloudflare Dashboard -> `Security` -> `WAF` -> `Rate Limiting Rules`

### Kural 1: Anlık Hız Kalkanı (Burst Throttling)
* **Kural Adı:** `Decision API - Burst Limit`
* **Yol:** `URI Path starts with "/api/karar/"`
* **Kriter:** 10 saniye içinde aynı IP'den 3'ten fazla istek
* **Aksiyon:** **Managed Challenge (Cloudflare Turnstile)**
* **Süre:** 10 dakika

### Kural 2: Dakikalık Kota (Minute Cap)
* **Kural Adı:** `Decision API - Minute Cap`
* **Yol:** `URI Path starts with "/api/karar/"`
* **Kriter:** 1 dakika içinde aynı IP'den 5'ten fazla istek
* **Aksiyon:** **Block (HTTP 429 Too Many Requests)**
* **Süre:** 1 saat

### Kural 3: Saatlik ve Günlük Tavan (Worker Level Cap)
* `scripts/cloudflare-worker-api.js` içerisindeki KV sayaçları ile uygulanır:
  * Saatte 30 tam metin
  * Günde 50 tam metin

---

## 3. Cloudflare Turnstile Yapılandırması (Görünmez Bot Doğrulaması)

1. Cloudflare Dashboard -> `Turnstile` -> `Add Widget`
2. **Domain:** `ozanferhatsen.com.tr`
3. **Widget Mode:** `Managed` (Kullanıcı fareyi oynattığında veya tıkladığında otomatik doğrulanır, şüpheli durumlarda kutucuk çıkar)
4. Üretilen `Site Key` frontend'e, `Secret Key` ise Worker değişkenlerine (`env.TURNSTILE_SECRET_KEY`) eklenir.

---

## 4. Sıfır Sızıntı (Zero Bypass) Denetim Listesi

Canlıya çıkmadan önce şu 6 kuralın sağlandığı doğrulanmalıdır:
* [x] **Arama İndeksi:** `search-index.json` içerisinde tek bir tam metin kararı bulunmamalıdır (Yalnızca özet ve künye).
* [x] **Toplu Sayfalama:** `/ictihat/liste/` sayfalaması kapatılmış (`permalink: false`) ve sitemap'ten çıkarılmış olmalıdır.
* [x] **Sitemap İzolasyonu:** `sitemap.xml` içerisinde yalnızca editoryal vitrin sayfaları yer almalıdır.
* [x] **Statik Derleme:** `_site` çıktısında 10 sayfalık ham karar metinleri statik HTML olarak yer almamalıdır.
* [x] **Git Geçmişi:** Kamuya açık depoda `karar-fulltext` ham metinleri bulunmamalıdır.
* [x] **Drive Bağlantıları:** Kamuya açık sitede doğrudan Drive klasör bağlantısı paylaşılmamalıdır.
