import clsx from "clsx";

// Vertical rhythm lives here. Sections never set their own padding, so the
// page cannot drift into six different gaps.

export default function Section({ id, className, children, tight, ...props }) {
  return (
    <section
      id={id}
      className={clsx(
        "relative scroll-mt-20",
        tight ? "py-14 md:py-20" : "py-20 md:py-28",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

// The running head every section opens with: a full-width ink rule, then a
// mono line with the section number on the left and a note on the right. It
// is what a magazine prints at the top of each spread, and it does the job a
// coloured card border used to do, which is to say "new section starts here".
export function RunningHead({ index, label, note, className, invert }) {
  const tone = invert ? "text-[var(--color-on-dark-muted)]" : "text-[var(--color-muted)]";
  return (
    <div className={clsx("border-t pt-3", invert ? "border-[var(--color-on-dark)]" : "border-[var(--color-ink)]", className)}>
      <div className={clsx("flex items-baseline justify-between gap-6 font-mono text-[0.72rem] uppercase tracking-[0.14em]", tone)}>
        <span>
          {index ? <span className={invert ? "text-[var(--color-primary)]" : "text-[var(--color-red)]"}>{index}</span> : null}
          {index && label ? <span className="mx-2">/</span> : null}
          {label}
        </span>
        {note ? <span className="text-right">{note}</span> : null}
      </div>
    </div>
  );
}

export function SectionHeader({ index, kicker, note, title, body, align = "left", className }) {
  return (
    <div className={clsx(align === "center" && "text-center", className)}>
      {kicker || index ? <RunningHead index={index} label={kicker} note={note} /> : null}
      <div className={clsx("mt-8 grid gap-6 md:mt-10", body && "lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16")}>
        <h2 className="text-[clamp(2.4rem,5.6vw,4.75rem)]">{title}</h2>
        {body ? (
          <p className="max-w-md text-lg leading-relaxed text-[var(--color-muted)] lg:pb-2">{body}</p>
        ) : null}
      </div>
    </div>
  );
}
