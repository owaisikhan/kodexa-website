import "server-only";

import { CHAT } from "@/app/_lib/chatbot/config";

// Cheap checks that run before any paid call.

const hits = new Map();

/**
 * Per-IP rate limit, in memory.
 *
 * Every message costs real money, and the widget is on a public page that ads
 * point at. In memory means per serverless instance rather than global, which
 * is the honest tradeoff for a marketing site: it stops a bored visitor
 * hammering the box without standing up Redis to do it.
 */
export function rateLimit(ip) {
  const now = Date.now();
  const { windowMs, max } = CHAT.rateLimit;

  const record = hits.get(ip);
  if (!record || now - record.start > windowMs) {
    hits.set(ip, { start: now, count: 1 });
    // The map would otherwise grow for the life of the instance.
    if (hits.size > 5000) {
      for (const [key, value] of hits) {
        if (now - value.start > windowMs) hits.delete(key);
      }
    }
    return { ok: true };
  }

  if (record.count >= max) {
    return {
      ok: false,
      message: "That is a lot of questions at once. Give it a minute, or message us on WhatsApp.",
    };
  }

  record.count += 1;
  return { ok: true };
}

/** Shape and size checks on what the browser sent. */
export function validateQuestion(message) {
  if (typeof message !== "string") {
    return { ok: false, message: "Ask me something about what we build." };
  }

  const question = message.trim();

  if (question.length < 2) {
    return { ok: false, message: "Ask me something about what we build." };
  }
  if (question.length > CHAT.maxQuestionLength) {
    return {
      ok: false,
      message: `Could you shorten that a little? ${CHAT.maxQuestionLength} characters is the limit here.`,
    };
  }

  return { ok: true, question };
}

/**
 * Trim and sanitise the history the browser sent.
 *
 * The client holds the conversation (no Redis on a site this size), which
 * means the history is user input like anything else: it arrives untrusted,
 * gets capped, and only the two roles the model understands survive.
 */
export function sanitiseHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (turn) =>
        turn &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string" &&
        turn.content.trim()
    )
    .slice(-CHAT.maxHistoryTurns)
    .map((turn) => ({
      role: turn.role,
      content: turn.content.trim().slice(0, CHAT.maxQuestionLength),
    }));
}
