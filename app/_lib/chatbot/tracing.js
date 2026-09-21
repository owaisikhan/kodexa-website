import "server-only";

// What each request cost and how long it took.
//
// Deliberately smaller than the store's pipeline, which exports to Langfuse:
// this is a marketing site answering a handful of questions a day, so the
// useful version is a line in the Vercel logs you can actually grep. The shape
// is the same, so swapping in a real exporter later is one function.

// Per million tokens, USD, for the models whose published rates we have.
// A model that is not listed logs `usd: null` rather than a guessed figure:
// an invented cost is worse than no cost, because it looks like a measurement.
// Fill a rate in here when you have it from Google's pricing page.
const RATES = {
  "gemini-2.5-flash": { input: 0.3, output: 2.5 },
  "gemini-2.0-flash": { input: 0.1, output: 0.4 },
  "gemini-embedding-001": { input: 0.15, output: 0 },
};

function costOf(model, usage) {
  const rate = RATES[model];
  if (!rate || !usage) return null;
  const input = (usage.promptTokenCount ?? 0) / 1e6 * rate.input;
  const output = (usage.candidatesTokenCount ?? 0) / 1e6 * rate.output;
  return Number((input + output).toFixed(6));
}

export function trace({ name, model, usage, startedAt, error, extra }) {
  const line = {
    at: new Date().toISOString(),
    step: name,
    model,
    ms: Date.now() - startedAt,
    inputTokens: usage?.promptTokenCount ?? null,
    outputTokens: usage?.candidatesTokenCount ?? null,
    usd: costOf(model, usage),
    ...extra,
  };

  if (error) {
    console.error("[chat]", JSON.stringify({ ...line, error: error.message }));
    return;
  }
  console.log("[chat]", JSON.stringify(line));
}
