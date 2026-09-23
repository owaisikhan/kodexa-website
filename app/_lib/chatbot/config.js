// Every knob the chatbot has, in one place.

export const CHAT = {
  // Google's moving alias for the current Flash-Lite model. A pinned name
  // like "gemini-3.7-flash-lite" breaks the day it is retired or if it never
  // existed for your key (a 404 on every answer); the alias does not. Pin a
  // specific model in GEMINI_MODEL only when you need one, and the agent falls
  // back to this alias if the pinned one is not found.
  model: process.env.GEMINI_MODEL || "gemini-flash-lite-latest",
  fallbackModel: "gemini-flash-lite-latest",
  embeddingModel: process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001",

  // Matches the vector(768) column in the migration. Changing one means
  // changing the other and re-seeding.
  embeddingDimensions: 768,

  // How many knowledge chunks ground an answer, and how similar they have to
  // be to count. The floor is what makes "I can only help with Kodexa" the
  // answer to an off-topic question rather than a confident guess.
  topK: Number(process.env.RAG_TOP_K) || 4,

  // Project knowledge is searched separately, so it gets its own budget. Fewer
  // than topK because a project answer needs depth on one project, not a
  // shallow line about four of them.
  projectTopK: Number(process.env.RAG_PROJECT_TOP_K) || 3,
  minSimilarity: Number(process.env.RAG_MIN_SIMILARITY) || 0.45,

  // Turns of conversation folded into the embedded query, so a bare follow-up
  // ("how long does that take?") retrieves against what it follows.
  contextTurns: 4,

  // A public chatbot spends real money per message. Per instance, in memory:
  // several serverless instances each allow this much, which is fine for a
  // marketing site and avoids standing up Redis for it.
  rateLimit: { windowMs: 60_000, max: 8 },

  maxQuestionLength: 500,
  maxHistoryTurns: 8,
};

export function isChatConfigured() {
  return Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
