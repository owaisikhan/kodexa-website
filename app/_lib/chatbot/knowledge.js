// The chatbot's knowledge, built from the same modules the pages render.
//
// Nothing here is typed out by hand. Every fact comes from services-data.js or
// siteConfig.js, so the assistant physically cannot quote a service we do not
// sell, a timeline the service page disagrees with, or an old phone number.
// Edit those files and re-run scripts/seedKnowledge.mjs.

import { services, process as steps, work } from "@/app/_lib/services-data";
import { siteConfig } from "@/app/_lib/siteConfig";
import { lead, promises, faqs } from "@/app/_lib/company-data";

export function buildKnowledgeChunks() {
  const chunks = [];

  // One chunk per service. Kept whole rather than split: a service is already
  // about a paragraph, and splitting it would separate "what you get" from the
  // thing you get it for.
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
    content: steps
      .map((step) => `${step.n}. ${step.title}: ${step.body}`)
      .join("\n"),
  });

  chunks.push({
    topic: "pricing",
    title: "What it costs",
    content:
      "Kodexa does not publish fixed prices, because the price depends on what the project " +
      "actually needs. Send a short brief through the request form and you get a fixed quote " +
      "and a timeline back, usually the same day. Nothing starts and nothing is charged until " +
      "you approve that quote. The assistant must never invent a price, a rate or a discount.",
  });

  chunks.push({
    topic: "contact",
    title: "How to reach Kodexa",
    content:
      `WhatsApp ${siteConfig.whatsappDisplay} is the fastest way to reach us and is how we reply ` +
      `to requests. Email ${siteConfig.email}. We are based in ${siteConfig.location}. ` +
      `The request form is at /request: it takes about two minutes and three short questions.`,
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
    content: work
      .map((w) => `${w.title} (${w.kind}): ${w.body}`)
      .join("\n"),
  });

  // What people ask before they send a request, and who they will be talking
  // to. From company-data.js, the same list the FAQ and About pages show.
  chunks.push({
    topic: "about",
    title: "About Kodexa",
    content:
      `${siteConfig.name} is a software studio based in ${siteConfig.location}, led by ` +
      `${lead.name} (${lead.role}). Every project is led by ${lead.name}, from the first message to launch. Promises: ` +
      promises.map((p) => `${p.title}: ${p.body}`).join(" ") +
      " More at /about.",
  });
  for (const f of faqs) {
    chunks.push({ topic: "faq", title: f.q, content: `${f.q} ${f.a}${f.link ? ` See ${f.link.href}.` : ""}` });
  }

  return chunks;
}
