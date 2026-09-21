import "server-only";

import { createSupabaseServer } from "@/app/_lib/supabase-server";
import { embedText } from "@/app/_lib/chatbot/agent";
import { CHAT } from "@/app/_lib/chatbot/config";
import { toVectorLiteral, buildContextualQuery } from "@/app/_lib/chatbot/vectorUtils";

// Retrieval is the real scope fence.
//
// The assistant can only answer from what comes back here, and what comes back
// here is only ever Kodexa's own knowledge. A question about the weather
// retrieves nothing above the floor, so there is nothing to answer from and
// the prompt's refusal is the only path left.

/**
 * Retrieve the knowledge behind an answer.
 *
 * Returns the question's embedding too: the semantic cache needs it, and
 * embedding the same sentence twice per request would be paying twice for the
 * same vector.
 */
export async function retrieve(question, history = []) {
  let embedding = null;
  try {
    const contextual = buildContextualQuery(question, history, CHAT.contextTurns);
    embedding = await embedText(contextual);

    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.rpc("match_kb_chunks", {
      query_embedding: toVectorLiteral(embedding),
      query_text: question,
      match_count: CHAT.topK,
    });

    if (error) {
      console.warn("[chat] knowledge lookup failed:", error.message);
      return { embedding, chunks: [] };
    }

    const chunks = (data ?? []).filter((row) => row.similarity >= CHAT.minSimilarity);
    return { embedding, chunks };
  } catch (err) {
    // A broken knowledge base degrades to "I can only help with Kodexa",
    // never to a 500 and never to an ungrounded guess.
    console.warn("[chat] retrieval failed:", err.message);
    return { embedding, chunks: [] };
  }
}
