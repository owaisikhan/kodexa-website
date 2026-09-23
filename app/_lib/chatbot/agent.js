import "server-only";

import { GoogleGenAI } from "@google/genai";

import { CHAT } from "@/app/_lib/chatbot/config";
import { trace } from "@/app/_lib/chatbot/tracing";
import { buildSystemPrompt, buildAnswerPrompt } from "@/app/_lib/chatbot/prompt";

// Every Gemini call lives here. One provider, one key, one place to change the
// model. Callers get plain values back and never see the SDK.

let client;
function ai() {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

/** A question (or a chunk of knowledge) as a vector. */
export async function embedText(text) {
  const startedAt = Date.now();
  try {
    const response = await ai().models.embedContent({
      model: CHAT.embeddingModel,
      contents: [text],
      config: { outputDimensionality: CHAT.embeddingDimensions },
    });
    // The embed endpoint reports no usage, so the trace carries length rather
    // than a token count it would have to invent.
    trace({
      name: "embed",
      model: CHAT.embeddingModel,
      startedAt,
      extra: { chars: text.length },
    });
    return response.embeddings[0].values;
  } catch (error) {
    trace({ name: "embed", model: CHAT.embeddingModel, startedAt, error });
    throw error;
  }
}

/**
 * Answer a question from retrieved Kodexa knowledge, streaming as it goes.
 *
 * `onToken` receives each piece as it arrives; the full text is returned
 * either way, so a caller that does not stream needs no special case.
 */
export async function answerFromKnowledge(question, chunks, history, onToken) {
  const startedAt = Date.now();

  // The conversation, then the retrieved knowledge and the question. History
  // is included so follow-ups work, but the knowledge is what the answer is
  // allowed to be built from.
  const contents = [
    ...history.map((turn) => ({
      role: turn.role === "user" ? "user" : "model",
      parts: [{ text: turn.content }],
    })),
    { role: "user", parts: [{ text: buildAnswerPrompt(question, chunks) }] },
  ];

  try {
    return await streamAnswer(activeModel, contents, onToken, startedAt);
  } catch (error) {
    // A model name that does not exist fails before any text is sent, so
    // retrying on the alias is invisible to the visitor. Remember the switch
    // for the life of this instance, and say so once in the logs.
    if (error.partial || !isModelNotFound(error) || activeModel === CHAT.fallbackModel) throw error;
    console.warn(
      `[chat] GEMINI_MODEL "${activeModel}" was not found; using "${CHAT.fallbackModel}". Fix GEMINI_MODEL, or remove it to use the alias.`
    );
    activeModel = CHAT.fallbackModel;
    return streamAnswer(activeModel, contents, onToken, Date.now());
  }
}

// The model in use on this instance: GEMINI_MODEL until it proves missing.
let activeModel = CHAT.model;

function isModelNotFound(error) {
  const text = `${error?.status ?? ""} ${error?.code ?? ""} ${error?.message ?? ""}`;
  return /\b404\b|NOT_FOUND|is not found|not supported for generateContent/i.test(text);
}

async function streamAnswer(model, contents, onToken, startedAt) {
  let full = "";
  let usage;

  try {
    const stream = await ai().models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction: buildSystemPrompt(),
        // Low, because this answers factual questions about our own services.
        // Anything higher starts embellishing what a service includes.
        temperature: 0.2,
        maxOutputTokens: 400,
      },
    });

    for await (const chunk of stream) {
      // Gemini reports usage per chunk, accumulating as it goes, so the last
      // one carries the totals. Summing them would multiply the real count,
      // and the cost, by roughly the number of chunks.
      if (chunk.usageMetadata) usage = chunk.usageMetadata;
      const piece = chunk.text;
      if (!piece) continue;
      full += piece;
      onToken?.(piece);
    }

    trace({ name: "answer", model, usage, startedAt });
    return full.trim();
  } catch (error) {
    trace({ name: "answer", model, usage, startedAt, error });
    // Only a failure before the first word may be retried on another model;
    // after that the visitor has already seen part of this answer.
    if (full) error.partial = true;
    throw error;
  }
}
