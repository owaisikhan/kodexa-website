// Seeds the chatbot's knowledge base from this repo's own content.
//
//   node --env-file=.env.local scripts/seedKnowledge.mjs
//
// Run it after editing services-data.js or siteConfig.js. It replaces every
// chunk rather than appending, so the knowledge base can never hold a service
// that has been renamed or removed.
//
// Standalone on purpose: plain `node`, no Next module resolution, so the
// imports below are relative paths rather than the @/ alias.

import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

import { services, process as steps, work } from "../app/_lib/services-data.js";
import { siteConfig } from "../app/_lib/siteConfig.js";
import { buildProjectChunks } from "../app/_lib/chatbot/projects-data.js";

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
const DIMENSIONS = 768;

const key = process.env.GEMINI_API_KEY;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Writing to kb_chunks needs the service role: the table has no policies, so
// the anon key can neither read nor write it. This key never reaches the app.
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!key || !url || !serviceKey) {
  console.error(
    "Missing env. Needs GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

// Duplicated from app/_lib/chatbot/knowledge.js, which cannot be imported here
// because it uses the @/ alias and Next-only imports. Keep the two in step:
// this is the copy that actually reaches the database.
function buildChunks() {
  const chunks = [];

  for (const s of services) {
    chunks.push({
      topic: `service:${s.slug}`,
      title: s.title,
      content: [
        `${s.title}. ${s.short}`,
        `Who it is for: ${s.for}`,
        `What it does for you: ${s.outcomes.join("; ")}.`,
        `What is included: ${s.includes.join("; ")}.`,
        `Typical timeline: ${s.timeline}.`,
        `Request it at /request?service=${s.slug}, or read more at /services/${s.slug}.`,
      ].join("\n"),
    });
  }

  chunks.push({
    topic: "services:overview",
    title: "Everything Kodexa builds",
    content:
      `${siteConfig.name} builds ${services.map((s) => s.title).join(", ")}. ` +
      `Each one has its own page at /services/<name> and its own request form. ` +
      `${siteConfig.tagline}.`,
  });

  chunks.push({
    topic: "process",
    title: "How working with Kodexa goes",
    content: steps.map((step) => `${step.n}. ${step.title}: ${step.body}`).join("\n"),
  });

  chunks.push({
    topic: "pricing",
    title: "What it costs",
    content:
      "Kodexa does not publish fixed prices, because the price depends on what the project " +
      "actually needs. Send a short brief through the request form and you get a fixed quote " +
      "and a timeline back, usually the same day. Nothing starts and nothing is charged until " +
      "you approve that quote. Never invent a price, a rate or a discount.",
  });

  chunks.push({
    topic: "contact",
    title: "How to reach Kodexa",
    content:
      `WhatsApp ${siteConfig.whatsappDisplay} is the fastest way to reach us and is how we reply ` +
      `to requests. Email ${siteConfig.email}. We are based in ${siteConfig.location}. ` +
      `The request form is at /request: about two minutes and three short questions.`,
  });

  chunks.push({
    topic: "requesting",
    title: "How to request a service",
    content:
      "Go to /request, pick the service you need, describe what you are trying to fix in a few " +
      "lines, and leave a name and a WhatsApp number or email. Submitting it opens WhatsApp with " +
      "the whole brief already written, so you only have to press send. You get a reference code " +
      "like KDX-4H7QW2 to quote later. There is no obligation and no payment at that stage.",
  });

  chunks.push({
    topic: "work",
    title: "Projects Kodexa has built",
    content: work.map((w) => `${w.title} (${w.kind}): ${w.body}`).join("\n"),
  });

  return chunks;
}

const ai = new GoogleGenAI({ apiKey: key });
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function embedAll(chunks) {
  const rows = [];
  for (const chunk of chunks) {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: [`${chunk.title}\n${chunk.content}`],
      config: { outputDimensionality: DIMENSIONS },
    });
    rows.push({ ...chunk, embedding: response.embeddings[0].values });
    process.stdout.write(".");
  }
  console.log();
  return rows;
}

const chunks = buildChunks();
const projectChunks = buildProjectChunks();

console.log(`Embedding ${chunks.length} knowledge chunks with ${EMBEDDING_MODEL}...`);
const rows = await embedAll(chunks);

console.log(`Embedding ${projectChunks.length} project chunks...`);
const projectRows = await embedAll(projectChunks);

// Replace rather than append: a renamed or deleted service must not linger in
// the knowledge base answering questions about itself.
const { error: clearError } = await supabase
  .from("kb_chunks")
  .delete()
  .gte("id", 0);
if (clearError) {
  console.error("Could not clear kb_chunks:", clearError.message);
  process.exit(1);
}

const { error: insertError } = await supabase.from("kb_chunks").insert(rows);
if (insertError) {
  console.error("Could not insert chunks:", insertError.message);
  process.exit(1);
}

// Same replace-everything rule for the project knowledge: a project that has
// been renamed or dropped must not linger, answering questions about itself.
const { error: clearProjects } = await supabase
  .from("project_chunks")
  .delete()
  .gte("id", 0);
if (clearProjects) {
  console.error("Could not clear project_chunks:", clearProjects.message);
  process.exit(1);
}

const { error: insertProjects } = await supabase.from("project_chunks").insert(projectRows);
if (insertProjects) {
  console.error("Could not insert project chunks:", insertProjects.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} knowledge chunks and ${projectRows.length} project chunks.`);
