import { isChatConfigured } from "@/app/_lib/chatbot/config";
import { rateLimit, validateQuestion, sanitiseHistory } from "@/app/_lib/chatbot/guard";
import { retrieve } from "@/app/_lib/chatbot/rag";
import { findCached, putCached } from "@/app/_lib/chatbot/cache";
import { answerFromKnowledge } from "@/app/_lib/chatbot/agent";
import { OUT_OF_SCOPE_REPLY } from "@/app/_lib/chatbot/prompt";

// Streams the answer as Server-Sent Events, so the first words appear while
// the rest is still being written rather than after a long silence.
export const runtime = "nodejs";
export const maxDuration = 30;

function sse(data) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request) {
  if (!isChatConfigured()) {
    return Response.json({ error: "Chat is not configured." }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send JSON." }, { status: 400 });
  }

  const check = validateQuestion(body?.message);
  if (!check.ok) {
    return Response.json({ error: check.message }, { status: 400 });
  }

  // Vercel puts the real client address in x-forwarded-for; the first entry is
  // the client, the rest are proxies.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limit = rateLimit(ip);
  if (!limit.ok) {
    return Response.json({ error: limit.message }, { status: 429 });
  }

  const question = check.question;
  const history = sanitiseHistory(body?.history);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event) => controller.enqueue(encoder.encode(sse(event)));

      try {
        const { embedding, chunks } = await retrieve(question, history);

        // Only first-turn questions are cached. A follow-up ("and that one?")
        // embeds close to its neighbours while meaning something different
        // depending on what came before it, so serving it from the cache would
        // answer confidently and wrongly.
        if (embedding && history.length === 0) {
          const hit = findCached(embedding);
          if (hit) {
            send({ type: "token", value: hit.answer });
            send({ type: "done", grounded: true, cached: true });
            return;
          }
        }

        // Nothing relevant retrieved means the question is outside what this
        // assistant knows about, which is the whole of its scope. Answer from
        // the fixed line rather than letting the model improvise: a model with
        // no context is exactly when one starts inventing.
        if (chunks.length === 0) {
          send({ type: "token", value: OUT_OF_SCOPE_REPLY });
          send({ type: "done", grounded: false });
          return;
        }

        const answer = await answerFromKnowledge(question, chunks, history, (piece) =>
          send({ type: "token", value: piece })
        );

        if (embedding && history.length === 0) putCached(embedding, answer);

        send({
          type: "done",
          grounded: true,
          // Useful in the browser's network tab when an answer looks off:
          // which knowledge it was built from.
          sources: chunks.map((c) => c.title),
          answer,
        });
      } catch (err) {
        console.error("[chat] request failed:", err.message);
        send({
          type: "error",
          value:
            "Something went wrong on our side. Message us on WhatsApp and we will answer properly.",
        });
      } finally {
        // The single close. Early returns above fall through to here, which is
        // what stops a second close from failing the response.
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
