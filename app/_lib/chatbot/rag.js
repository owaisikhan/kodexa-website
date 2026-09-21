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
    const vector = toVectorLiteral(embedding);

    const supabase = await createSupabaseServer();

    // Two knowledge bases, searched separately and merged.
    //
    // kb_chunks is what we sell and how working with us goes; project_chunks
    // is what we have actually built. Searching them separately is the point:
    // in one combined table a question about a project competes with nine
    // service descriptions that embed nearby, and the project detail gets
    // pushed out of the top matches by things that merely sound similar.
    const [knowledge, projects] = await Promise.all([
      supabase.rpc("match_kb_chunks", {
        query_embedding: vector,
        query_text: question,
        match_count: CHAT.topK,
      }),
      supabase.rpc("match_project_chunks", {
        query_embedding: vector,
        query_text: question,
        match_count: CHAT.projectTopK,
      }),
    ]);

    if (knowledge.error) {
      console.warn("[chat] knowledge lookup failed:", knowledge.error.message);
    }
    if (projects.error) {
      console.warn("[chat] project lookup failed:", projects.error.message);
    }

    const chunks = [...(knowledge.data ?? []), ...(projects.data ?? [])]
      .filter((row) => row.similarity >= CHAT.minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, CHAT.topK + CHAT.projectTopK);

    return { embedding, chunks };
  } catch (err) {
    // A broken knowledge base degrades to "I can only help with Kodexa",
    // never to a 500 and never to an ungrounded guess.
    console.warn("[chat] retrieval failed:", err.message);
    return { embedding, chunks: [] };
  }
}
