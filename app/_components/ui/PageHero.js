import Breadcrumbs from "@/app/_components/ui/Breadcrumbs";
import Reveal from "@/app/_components/ui/Reveal";

// The top of every inner page: breadcrumbs, one heading, one line under it.
// The 152px top padding clears the fixed navbar; see "The navbar height is
// load-bearing" in CLAUDE.md before changing it.

export default function PageHero({ base, crumbs, title, body, children }) {
  return (
    <section className="relative overflow-hidden pt-[152px] pb-10">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="container-x relative">
        <Breadcrumbs base={base} items={crumbs} />
        <Reveal>
          <h1 className="mt-8 max-w-3xl text-[clamp(2.4rem,6.5vw,4.4rem)]">{title}</h1>
          {body ? (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">{body}</p>
          ) : null}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
