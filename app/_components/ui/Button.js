import Link from "next/link";
import clsx from "clsx";

// One button, three intents. Anything that navigates renders an <a>, anything
// that acts renders a <button>, so the keyboard and the browser both behave.

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-[4px] border-2 " +
  "border-[var(--color-ink)] font-display font-extrabold uppercase tracking-tight " +
  // The press is the whole interaction: the button travels into its own
  // shadow instead of lifting off the page and glowing.
  "shadow-[4px_4px_0_var(--color-ink)] transition-[transform,box-shadow,background] duration-150 " +
  "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-ink)] " +
  "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none " +
  "disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[0.95rem]",
  lg: "px-7 py-4 text-[1.05rem]",
};

const variants = {
  primary: "bg-[var(--color-primary)] text-[var(--color-ink)]",
  ghost: "bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-primary)]",
  whatsapp: "bg-[#25D366] text-[var(--color-ink)]",
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
