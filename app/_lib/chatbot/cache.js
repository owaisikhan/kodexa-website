import "server-only";

import { CHAT } from "@/app/_lib/chatbot/config";

// A semantic cache over answers.
//
// On a marketing site the same handful of questions arrive over and over
// ("do you build apps?", "how much?", "how long does a website take?"), each
// otherwise costing a retrieval call plus a generation call. Caching by
// meaning rather than by exact string is what catches the twentieth phrasing
// of the same question.
//
// In memory, per serverless instance, on purpose. The store's pipeline keeps
// its cache in pgvector because it runs against a long-lived server with real
// traffic; here a warm instance answers the repeat questions for free and a
// cold one simply does the work, which is the right trade for this size.

const THRESHOLD = Number(process.env.SEMANTIC_CACHE_THRESHOLD) || 0.92;
const MAX_ENTRIES = 200;
const TTL_MS = 60 * 60 * 1000;

const entries = [];

function cosine(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const mag = Math.sqrt(magA) * Math.sqrt(magB);
  return mag === 0 ? 0 : dot / mag;
}

/** The cached answer for a question close enough in meaning, or null. */
export function findCached(embedding) {
  const now = Date.now();

  let best = null;
  let bestScore = 0;

  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (now - entry.at > TTL_MS) {
      entries.splice(i, 1);
      continue;
    }
    const score = cosine(embedding, entry.embedding);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore >= THRESHOLD) {
    return { answer: best.answer, similarity: Number(bestScore.toFixed(4)) };
  }
  return null;
}

export function putCached(embedding, answer) {
  // A follow-up like "and that one?" embeds close to its neighbours while
  // meaning something entirely different depending on what came before.
  // Caching those would serve the wrong answer confidently, so only
  // self-contained questions are stored.
  if (answer.length < 20) return;

  entries.push({ embedding, answer, at: Date.now() });
  if (entries.length > MAX_ENTRIES) entries.shift();
}

export const CACHE_THRESHOLD = THRESHOLD;
export const CACHE_DIMENSIONS = CHAT.embeddingDimensions;
