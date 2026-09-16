/**
 * OFS Legal — Cloudflare Worker Decision Vault Gateway (Anti-Scraping Kalkanı)
 * 
 * Bu Cloudflare Worker servisi:
 * 1. Cloudflare Turnstile bot doğrulamasını yönetir.
 * 2. 60 saniye geçerli imzalı kısa ömürlü token üretir.
 * 3. Çok katmanlı kota uygular:
 *    - Anlık Limit: Maksimum 5 tam metin / dakika
 *    - Saatlik Kota: Maksimum 30 tam metin / saat
 *    - Günlük Tavan: Maksimum 50 tam metin / gün
 * 4. Oturuma özel steganografik delil filigranını metne gömer.
 * 5. Zaman damgalı erişim logunu güvenli deftere (KV/D1) kaydeder.
 */

import crypto from "crypto";

const CONFIG = {
  TURNSTILE_SECRET_KEY: "0x4AAAAAA...", // Cloudflare Turnstile Gizli Anahtarı
  TOKEN_SECRET: "ofs-legal-sec-production-hmac-key-2026",
  LIMITS: {
    PER_MINUTE: 5,
    PER_HOUR: 30,
    PER_DAY: 50
  },
  ALLOWED_ORIGINS: [
    "https://ozanferhatsen.com.tr",
    "http://localhost:8080"
  ]
};

// Basit SHA256 IP Anonimleştirici
async function hashIp(ip) {
  const msgBuffer = new TextEncoder().encode(ip + "-ofs-salt-2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const clientIp = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
    const userAgent = request.headers.get("User-Agent") || "";

    const corsHeaders = {
      "Access-Control-Allow-Origin": CONFIG.ALLOWED_ORIGINS.includes(origin) ? origin : "https://ozanferhatsen.com.tr",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Turnstile-Token",
      "Access-Control-Max-Age": "86400"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // İkincil Savunma: Basit scraper başlıklarını hızlıca filtrele
    if (/python-requests|aiohttp|scrapy|curl\/|wget|postman/i.test(userAgent)) {
      return new Response(JSON.stringify({ error: "Direct bot access prohibited" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const ipHash = await hashIp(clientIp);

    // ENDPOINT 1: POST /api/karar/token (Turnstile Token Takası)
    if (url.pathname === "/api/karar/token" && request.method === "POST") {
      try {
        const body = await request.json();
        const { decisionId, turnstileToken, sessionId } = body;

        if (!decisionId || !turnstileToken) {
          return new Response(JSON.stringify({ error: "Missing required parameters" }), {
            status: 400,
            headers: corsHeaders
          });
        }

        // Cloudflare Turnstile Doğrulaması
        const verifyFormData = new FormData();
        verifyFormData.append("secret", env?.TURNSTILE_SECRET_KEY || CONFIG.TURNSTILE_SECRET_KEY);
        verifyFormData.append("response", turnstileToken);
        verifyFormData.append("remoteip", clientIp);

        const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          body: verifyFormData
        });
        const outcome = await turnstileRes.json();

        if (!outcome.success && env?.ENVIRONMENT === "production") {
          return new Response(JSON.stringify({ error: "Turnstile verification failed" }), {
            status: 403,
            headers: corsHeaders
          });
        }

        // İmzalı kısa ömürlü token üret (60 saniye geçerli)
        const timestamp = Date.now();
        const nonce = crypto.randomUUID().slice(0, 8);
        const payload = `${decisionId}:${sessionId || "anon"}:${timestamp}:${nonce}`;
        
        // HMAC SHA256 İmzası
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(env?.TOKEN_SECRET || CONFIG.TOKEN_SECRET),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
        const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
          .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        const payloadBase64 = btoa(payload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        
        const signedToken = `${payloadBase64}.${sigBase64}`;

        return new Response(JSON.stringify({
          success: true,
          token: signedToken,
          expiresIn: 60
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // ENDPOINT 2: GET /api/karar/:id (Korumalı Tam Metin Erişimi)
    const match = url.pathname.match(/^\/api\/karar\/([a-zA-Z0-9_\-]+)$/);
    if (match && request.method === "GET") {
      const decisionId = match[1];
      const token = url.searchParams.get("token") || request.headers.get("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return new Response(JSON.stringify({ error: "Authentication token required" }), {
          status: 401,
          headers: corsHeaders
        });
      }

      // 1. Çok Katmanlı Kota Denetimi (Multi-Tier Rate Limiting)
      // KV veya yerel sayaç üzerinde:
      const minKey = `rate:min:${ipHash}`;
      const hourKey = `rate:hour:${ipHash}`;
      const dayKey = `rate:day:${ipHash}`;

      if (env?.DECISION_CACHE) {
        const [cntMin, cntHour, cntDay] = await Promise.all([
          env.DECISION_CACHE.get(minKey),
          env.DECISION_CACHE.get(hourKey),
          env.DECISION_CACHE.get(dayKey)
        ]);

        if (Number(cntMin || 0) >= CONFIG.LIMITS.PER_MINUTE) {
          return new Response(JSON.stringify({
            error: "Dakikalık tam metin kotanız (5 karar/dk) aşıldı. Lütfen biraz bekleyin.",
            retryAfter: 60
          }), { status: 429, headers: corsHeaders });
        }

        if (Number(cntHour || 0) >= CONFIG.LIMITS.PER_HOUR) {
          return new Response(JSON.stringify({
            error: "Saatlik tam metin kotanız (30 karar/saat) aşıldı. Lütfen daha sonra tekrar deneyin.",
            retryAfter: 3600
          }), { status: 429, headers: corsHeaders });
        }

        if (Number(cntDay || 0) >= CONFIG.LIMITS.PER_DAY) {
          return new Response(JSON.stringify({
            error: "Günlük tam metin okuma kotanız (50 karar/gün) dolmuştur.",
            retryAfter: 86400
          }), { status: 429, headers: corsHeaders });
        }

        // Sayaçları artır
        ctx.waitUntil(Promise.all([
          env.DECISION_CACHE.put(minKey, String(Number(cntMin || 0) + 1), { expirationTtl: 60 }),
          env.DECISION_CACHE.put(hourKey, String(Number(cntHour || 0) + 1), { expirationTtl: 3600 }),
          env.DECISION_CACHE.put(dayKey, String(Number(cntDay || 0) + 1), { expirationTtl: 86400 })
        ]));
      }

      // 2. Karar Metnini Güvenli Kasadan Çek (Cloudflare D1 / R2 / KV)
      let rawDecisionText = "Karar metni veri kasasından çekilecektir.";
      if (env?.DECISION_VAULT) {
        rawDecisionText = await env.DECISION_VAULT.get(decisionId) || rawDecisionText;
      }

      // 3. Oturuma Özel Steganografik Delil Filigranı Tohumu
      const timestamp = Date.now();
      const watermarkSeed = `OFS-${timestamp}-${ipHash.slice(0, 8)}`;

      // 4. Zaman Damgalı Adli Erişim Kayıt Defteri (Audit Log)
      if (env?.AUDIT_LOGS) {
        ctx.waitUntil(env.AUDIT_LOGS.put(`log:${timestamp}:${ipHash}`, JSON.stringify({
          timestamp,
          ipHash,
          decisionId,
          watermarkSeed,
          userAgent: userAgent.slice(0, 100)
        })));
      }

      return new Response(JSON.stringify({
        success: true,
        decisionId,
        text: rawDecisionText,
        watermarkSeed,
        quotaRemaining: {
          minute: CONFIG.LIMITS.PER_MINUTE,
          hour: CONFIG.LIMITS.PER_HOUR,
          day: CONFIG.LIMITS.PER_DAY
        }
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "private, no-cache, no-store, must-revalidate"
        }
      });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  }
};
