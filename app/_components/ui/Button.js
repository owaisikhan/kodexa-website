import Link from "next/link";
import clsx from "clsx";

// One button, three intents. Anything that navigates renders an <a>, anything
// that acts renders a <button>, so the keyboard and the browser both behave.
//
// A printed rectangle: square corners, no shadow, no lift. The hover is a fill
// change and nothing else, which is how a button on paper would behave if it
// could.

const base =
  "group relative inline-flex items-center justify-center gap-2.5 border font-medium " +
  "transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-[0.95rem]",
  lg: "px-7 py-4 text-base",
};

const variants = {
  // Ink by default, red on hover. The red is the site's one accent, so it is
  // earned by pointing at the thing rather than spent on every button at rest.
  primary:
    "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-on-dark)] " +
    "hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-ink)]",
  ghost:
    "border-[var(--color-ink)] bg-transparent text-[var(--color-ink)] " +
    "hover:bg-[var(--color-ink)] hover:text-[var(--color-on-dark)]",
  // Paper on ink, for the inverted band.
  paper:
    "border-[var(--color-on-dark)] bg-[var(--color-on-dark)] text-[var(--color-ink)] " +
    "hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]",
  whatsapp:
    "border-[#25D366] bg-[#25D366] text-[var(--color-ink)] hover:brightness-95",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
  ...props
}) {
  const cls = clsx(base, sizes[size], variants[variant], className);

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
