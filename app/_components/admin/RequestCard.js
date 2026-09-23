"use client";

import { useActionState, useEffect } from "react";
import { Check, Loader2, Phone, StickyNote } from "lucide-react";
import toast from "react-hot-toast";

import { updateRequestStatusAction, updateRequestNotesAction } from "@/app/_lib/actions";
import { STATUSES, STATUS_STYLE } from "@/app/_lib/requests-data";
import { formatDate } from "@/app/_lib/format-helpers";
import { whatsappHref } from "@/app/_lib/siteConfig";
import WhatsAppIcon from "@/app/_components/ui/WhatsAppIcon";

// One lead, everything needed to act on it: what they asked for, how to reach
// them, where it stands, and your own notes.

export default function RequestCard({ request }) {
  const [statusState, statusAction, statusPending] = useActionState(
    updateRequestStatusAction,
    null
  );

  // Derived, not mirrored in state. The action revalidates the page, so
  // `request.status` catches up on its own; until it does, the action's own
  // result is the newer truth. Copying it into state with an effect would mean
  // two sources for one value, and a render pass spent reconciling them.
  const status = statusState?.ok ? statusState.status : request.status;

  // The toast is an external system, which is what effects are actually for.
  useEffect(() => {
    if (!statusState) return;
    if (statusState.ok) toast.success(statusState.message);
    else toast.error(statusState.message);
  }, [statusState]);

  const style = STATUS_STYLE[status] ?? STATUS_STYLE.new;

  // Digits only: a number typed as "+92 300 123 4567" will not dial from a
  // wa.me link, and an email in this field is not a WhatsApp number at all.
  const digits = String(request.contact || "").replace(/\D/g, "");
  const canWhatsApp = digits.length >= 10;

  return (
    <article className="panel p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl">{request.name}</h2>
            <span
              className="inline-flex items-center gap-1.5 rounded-[4px] border-2 border-[var(--color-ink)] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide"
              style={{ color: style.ink, background: style.color }}
            >
              {/* Colour is never the only cue: the word is always there too. */}
              {style.label}
            </span>
          </div>

          <p className="mt-1.5 text-sm text-[var(--color-muted)]">
            {request.business ? `${request.business} · ` : ""}
            {request.service_title}
          </p>
        </div>

        <div className="text-right text-xs text-[var(--color-dim)]">
          <p className="font-mono">{request.reference}</p>
          <p className="mt-1">{formatDate(request.created_at)}</p>
        </div>
      </div>

      {request.brief ? (
        <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[var(--color-surface-2)] px-4 py-3 leading-relaxed text-[var(--color-text)]">
          {request.brief}
        </p>
      ) : (
        <p className="mt-4 text-sm italic text-[var(--color-dim)]">
          No brief written.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <Phone className="h-4 w-4 text-[var(--color-dim)]" />
          {request.contact}
        </span>

        {canWhatsApp ? (
          <a
            href={whatsappHref({
              service: request.service_title,
              name: request.name,
            }).replace(/^https:\/\/wa\.me\/\d+/, `https://wa.me/${digits}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#25D366]/15 px-3.5 py-1.5 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/25"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Reply on WhatsApp
          </a>
        ) : null}
      </div>

      <div className="mt-5 border-t border-[var(--color-border-soft)] pt-5">
        <p className="mb-2.5 text-xs uppercase tracking-[0.18em] text-[var(--color-dim)]">
          Mark as
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((value) => {
            const active = status === value;
            const s = STATUS_STYLE[value];
            return (
              <form action={statusAction} key={value}>
                <input type="hidden" name="id" value={request.id} />
                <input type="hidden" name="status" value={value} />
                <button
                  type="submit"
                  disabled={statusPending || active}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-[4px] border px-3.5 py-1.5 text-sm transition-colors disabled:cursor-default ${
                    active
                      ? "border-[var(--color-ink)] font-semibold"
                      : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-dim)] hover:text-[var(--color-text)]"
                  }`}
                  style={
                    active
                      ? {
                          color: s.ink,
                          background: s.color,
                        }
                      : undefined
                  }
                >
                  {active ? <Check className="h-3.5 w-3.5" /> : null}
                  {s.label}
                </button>
              </form>
            );
          })}
          {statusPending ? (
            <span className="inline-flex items-center gap-2 text-sm text-[var(--color-dim)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving
            </span>
          ) : null}
        </div>

        <Notes request={request} />
      </div>
    </article>
  );
}

function Notes({ request }) {
  const [state, action, pending] = useActionState(updateRequestNotesAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="mt-5">
      <label className="mb-2.5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-dim)]">
        <StickyNote className="h-3.5 w-3.5" />
        Your notes
      </label>
      <input type="hidden" name="id" value={request.id} />
      <textarea
        name="notes"
        rows={2}
        maxLength={4000}
        defaultValue={request.notes ?? ""}
        placeholder="Quoted 60k, wants delivery in two weeks."
        className="field resize-y text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-2.5 inline-flex items-center gap-2 rounded-[4px] border border-[var(--color-border)] px-4 py-1.5 text-sm text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-text)]"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        Save note
      </button>
    </form>
  );
}
