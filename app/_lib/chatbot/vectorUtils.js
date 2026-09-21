// Shared helpers for the pgvector side of retrieval.

export function toVectorLiteral(embedding) {
  return `[${embedding.join(",")}]`;
}

// Folds the last few turns into the text that gets embedded, so a follow-up
// like "and how long does that take?" is disambiguated by what it follows
// instead of being embedded as a bare, ambiguous phrase. With no history this
// is just the question, unchanged.
export function buildContextualQuery(question, history = [], turns = 4) {
  if (!history.length) return question;

  const recent = history
    .slice(-turns)
    .map((t) => `${t.role === "user" ? "Visitor" : "Assistant"}: ${t.content}`)
    .join("\n");

  return `${recent}\nVisitor: ${question}`;
}
