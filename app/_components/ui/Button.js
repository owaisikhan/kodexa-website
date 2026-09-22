import Link from "next/link";
import clsx from "clsx";

// One button, three intents. Anything that navigates renders an <a>, anything
// that acts renders a <button>, so the keyboard and the browser both behave.

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-[transform,box-shadow,background,border-color] duration-300 " +
  "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[0.95rem]",
  lg: "px-8 py-4 text-base",
};

const variants = {
  primary:
    "bg-[var(--color-primary)] text-[#0c0f02] shadow-[0_10px_40px_-12px_var(--color-primary)] " +
    "hover:shadow-[0_16px_50px_-10px_var(--color-primary)] hover:brightness-110",
  ghost:
    "border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] " +
    "hover:bg-white/[0.03]",
  whatsapp:
    "bg-[#25D366] text-[#04210f] shadow-[0_10px_40px_-12px_#25D366] hover:brightness-110",
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
