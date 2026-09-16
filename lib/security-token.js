/**
 * OFS Ephemeral Signed Token Service
 * 
 * Karar tam metni çağrılarının botlar tarafından sınırsız tekrarlanmasını
 * önlemek için 60 saniye geçerli, HMAC-SHA256 imzalı kısa ömürlü
 * güvenlik belirteçleri üretir ve doğrular.
 */

import crypto from "crypto";

const DEFAULT_SECRET = process.env.OFS_TOKEN_SECRET || "ofs-legal-sec-default-signing-key-2026";
const TOKEN_TTL_MS = 60 * 1000; // 60 saniye

/**
 * Tek kullanımlık / kısa ömürlü token üretir.
 */
export function createEphemeralToken({ decisionId, sessionId, secret = DEFAULT_SECRET }) {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${decisionId}:${sessionId}:${timestamp}:${nonce}`;
  
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
    
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

/**
 * Gelen token'ın imzasını, süresini ve karar kimliğini doğrular.
 */
export function verifyEphemeralToken(rawToken, expectedDecisionId, { secret = DEFAULT_SECRET, maxAgeMs = TOKEN_TTL_MS } = {}) {
  if (!rawToken || typeof rawToken !== "string") {
    return { valid: false, reason: "TOKEN_MISSING" };
  }

  const parts = rawToken.split(".");
  if (parts.length !== 2) {
    return { valid: false, reason: "MALFORMED_TOKEN" };
  }

  const [encodedPayload, clientSignature] = parts;
  let payloadStr = "";
  try {
    payloadStr = Buffer.from(encodedPayload, "base64url").toString("utf8");
  } catch {
    return { valid: false, reason: "INVALID_BASE64" };
  }

  const [decisionId, sessionId, timestampStr, nonce] = payloadStr.split(":");
  const timestamp = Number(timestampStr);

  if (!decisionId || !timestamp) {
    return { valid: false, reason: "INVALID_PAYLOAD_STRUCTURE" };
  }

  // Karar ID eşleşmesi kontrolü
  if (expectedDecisionId && decisionId !== expectedDecisionId) {
    return { valid: false, reason: "DECISION_MISMATCH" };
  }

  // Zaman aşımı kontrolü
  const age = Date.now() - timestamp;
  if (age < -5000 || age > maxAgeMs) {
    return { valid: false, reason: "TOKEN_EXPIRED", age };
  }

  // HMAC imza doğrulaması
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(clientSignature), Buffer.from(expectedSignature))) {
    return { valid: false, reason: "SIGNATURE_INVALID" };
  }

  return {
    valid: true,
    decisionId,
    sessionId,
    timestamp,
    nonce
  };
}
