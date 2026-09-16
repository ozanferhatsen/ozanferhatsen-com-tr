/**
 * OFS Legal Steganographic Dynamic Watermark Service
 * 
 * Veri bitleri: \u200B (0) ve \u200C (1)
 * Çerçeve Sınırları: \u200D\u2060\u200D (Başlangıç) ve \u2060\u200D\u2060 (Bitiş)
 * Veri akışı içinde \u200D ve \u2060 yer almadığından sınır çakışması (delimiter collision) imkansızdır.
 */

import crypto from "crypto";

const BIT_0 = "\u200B"; // 0
const BIT_1 = "\u200C"; // 1

const FRAME_START = "\u200D\u2060\u200D";
const FRAME_END   = "\u2060\u200D\u2060";

export function generateWatermarkSeed({ sessionId, ipHash, decisionId, timestamp = Date.now() }) {
  const raw = `${sessionId}:${ipHash}:${decisionId}:${timestamp}`;
  const sig = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);
  return `OFS-${timestamp}-${sig}`;
}

function encodeStringToZw(str) {
  const bytes = Buffer.from(str, "utf8");
  let zw = "";
  for (const b of bytes) {
    for (let i = 7; i >= 0; i--) {
      zw += ((b >> i) & 1) ? BIT_1 : BIT_0;
    }
  }
  return zw;
}

function decodeZwToString(zw) {
  const bytes = [];
  let currentByte = 0;
  let bitCount = 0;

  for (const char of zw) {
    if (char === BIT_0 || char === BIT_1) {
      currentByte = (currentByte << 1) | (char === BIT_1 ? 1 : 0);
      bitCount++;
      if (bitCount === 8) {
        bytes.push(currentByte);
        currentByte = 0;
        bitCount = 0;
      }
    }
  }

  return Buffer.from(bytes).toString("utf8");
}

export function injectWatermark(text, payload) {
  if (!text || typeof text !== "string") return text;
  
  const encodedPayload = FRAME_START + encodeStringToZw(payload) + FRAME_END;
  
  const paragraphs = text.split("\n\n");
  if (paragraphs.length <= 2) {
    return paragraphs[0] + encodedPayload + (paragraphs[1] ? "\n\n" + paragraphs[1] : "");
  }

  paragraphs[1] += encodedPayload;
  if (paragraphs.length > 4) {
    paragraphs[paragraphs.length - 2] += encodedPayload;
  }

  return paragraphs.join("\n\n");
}

export function extractWatermarks(text) {
  if (!text || typeof text !== "string") return [];
  
  const results = [];
  let startIndex = 0;

  while ((startIndex = text.indexOf(FRAME_START, startIndex)) !== -1) {
    const endIndex = text.indexOf(FRAME_END, startIndex + FRAME_START.length);
    if (endIndex === -1) break;

    const zwChunk = text.slice(startIndex + FRAME_START.length, endIndex);
    try {
      const decoded = decodeZwToString(zwChunk);
      if (decoded.startsWith("OFS-")) {
        results.push(decoded);
      }
    } catch {
      // Ayrıştırma hatası
    }
    startIndex = endIndex + FRAME_END.length;
  }

  return [...new Set(results)];
}
