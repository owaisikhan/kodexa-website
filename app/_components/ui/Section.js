import clsx from "clsx";

// Vertical rhythm lives here. Sections never set their own padding, so the
// page cannot drift into six different gaps.

export default function Section({ id, className, children, tight, ...props }) {
  return (
    <section
      id={id}
      className={clsx(
        "relative",
        tight ? "py-16 md:py-20" : "py-24 md:py-32",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionHeader({ kicker, title, body, align = "left", className }) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {kicker ? <p className="kicker mb-4">{kicker}</p> : null}
      <h2 className="text-[clamp(2rem,5vw,3.4rem)]">{title}</h2>
      {body ? (
        <p className="mt-5 text-lg leading-relaxed text-[var(--color-muted)]">{body}</p>
      ) : null}
    </div>
  );
}
