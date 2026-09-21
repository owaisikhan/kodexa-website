"use server";

import { randomBytes } from "node:crypto";

import { createSupabaseServer, isSupabaseConfigured } from "@/app/_lib/supabase-server";
import { getService } from "@/app/_lib/services-data";
import { whatsappHref } from "@/app/_lib/siteConfig";

// Every action returns the same shape, so one message component renders them
// all: { ok, message, ...extras }.

const LIMITS = {
  name: 80,
  business: 120,
  contact: 60,
  brief: 2000,
};

// The reference is generated here, not read back from the database.
//
// Reading it back would mean INSERT ... RETURNING, and under RLS that also
// applies the table's SELECT policy. service_requests deliberately has none:
// a letterbox nobody can read from. Generating the code app-side keeps it that
// way and still gives the visitor something to quote. Six characters from a
// 32-letter alphabet is ~1 in a billion for a collision at our volume, and the
// column's unique constraint catches even that.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function makeReference() {
  const bytes = randomBytes(6);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `KDX-${out}`;
}

function clean(value, max) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

/**
 * Save a service request and hand the visitor off to WhatsApp.
 *
 * The WhatsApp link is built here rather than on the client so the message the
 * visitor sends and the row we store are generated from the same values. If
 * Supabase is not configured yet the handoff still works, because a lead that
 * reaches the phone is worth more than a lead that reaches the database.
 */
export async function submitRequest(prevState, formData) {
  // Bots fill every field they can see. Humans never see this one.
  if (clean(formData.get("company_website"), 200)) {
    return { ok: true, message: "Thanks, we will be in touch." };
  }

  const slug = clean(formData.get("service"), 60);
  const service = getService(slug);
  const name = clean(formData.get("name"), LIMITS.name);
  const business = clean(formData.get("business"), LIMITS.business);
  const contact = clean(formData.get("contact"), LIMITS.contact);
  const brief = clean(formData.get("brief"), LIMITS.brief);

  if (!service) {
    return { ok: false, message: "Please choose which service you need." };
  }
  if (name.length < 2) {
    return { ok: false, message: "Please tell us your name." };
  }
  if (contact.length < 6) {
    return {
      ok: false,
      message: "Please add a WhatsApp number or an email we can reply to.",
    };
  }

  const whatsappUrl = whatsappHref({
    service: service.title,
    name,
    business,
    brief,
  });

  if (!isSupabaseConfigured()) {
    // No database wired yet. Still a successful request from the visitor's
    // point of view, and the message still reaches the phone.
    return {
      ok: true,
      stored: false,
      message: "Request ready. Opening WhatsApp so we get it straight away.",
      whatsappUrl,
      reference: null,
    };
  }

  const reference = makeReference();
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("service_requests").insert({
    reference,
    service_slug: service.slug,
    service_title: service.title,
    name,
    business: business || null,
    contact,
    brief: brief || null,
  });

  if (error) {
    // The row failed, but the visitor should not be punished for our plumbing.
    // Hand them to WhatsApp anyway and say so plainly.
    console.error("service_requests insert failed:", error.message);
    return {
      ok: true,
      stored: false,
      message: "Request ready. Opening WhatsApp so we get it straight away.",
      whatsappUrl,
      reference: null,
    };
  }

  return {
    ok: true,
    stored: true,
    message: "Request received. Opening WhatsApp so we can reply faster.",
    whatsappUrl,
    reference,
  };
}
