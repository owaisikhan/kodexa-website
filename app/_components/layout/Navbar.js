"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, MessageCircle, X } from "lucide-react";

import { siteConfig, whatsappHref } from "@/app/_lib/siteConfig";
import { services } from "@/app/_lib/services-data";
import ServiceIcon, { accentVar, accentInk } from "@/app/_components/ui/ServiceIcon";
import Button from "@/app/_components/ui/Button";

// Where the visitor is decides which item is marked. On the home page the
// sections are the places, so the marker follows the scroll; everywhere else
// the route decides.
const SPY_SECTIONS = ["services", "process"];

function useSection(pathname) {
  const [section, setSection] = useState(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const els = SPY_SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
    // A section counts as "here" while it crosses the middle of the screen, so
    // the marker changes where the reader's eye is, not when an edge appears.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSection(e.target.id);
          else setSection((cur) => (cur === e.target.id ? null : cur));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      setSection(null);
    };
  }, [pathname]);

  return pathname === "/" ? section : null;
}

export default function Navbar() {
  const pathname = usePathname();
  const section = useSection(pathname);
  const current = {
    services: pathname.startsWith("/services") || section === "services",
    work: pathname.startsWith("/work"),
    process: section === "process",
  };

  const [scrolled, setScrolled] = useState(false);
  // Open state is remembered per path: arriving somewhere new closes whatever
  // was open to get there, with no effect needed to reset it.
  const [drawerAt, setDrawerAt] = useState(null);
  const [menuAt, setMenuAt] = useState(null);
  const drawer = drawerAt === pathname;
  const menu = menuAt === pathname;
  const setDrawer = useCallback((v) => setDrawerAt(v ? pathname : null), [pathname]);
  const setMenu = useCallback((v) => setMenuAt(v ? pathname : null), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        // z-60 so the open menus sit above the chat and WhatsApp buttons (z-50,
        // z-40), which otherwise float over the drawer's last links.
        "fixed inset-x-0 top-0 z-[60] transition-[background,border-color] duration-300",
        scrolled || menu || drawer
          ? "border-b border-[var(--color-border-soft)] bg-[var(--color-bg)]"
          : "border-b border-transparent"
      )}
    >
      <nav aria-label="Main" className="container-x flex h-[88px] items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${siteConfig.name} home`}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-primary)] text-[var(--color-ink)]">
            <span className="font-display text-xl font-bold">K</span>
          </span>
          <span className="font-display text-xl font-bold tracking-tight">{siteConfig.name}</span>
        </Link>

        <ul className="hidden items-center gap-2 md:flex">
          <li>
            <ServicesMenu open={menu} setOpen={setMenu} active={current.services} />
          </li>
          <li>
            <NavLink href="/work" active={current.work} page={pathname === "/work"}>
              Work
            </NavLink>
          </li>
          <li>
            <NavLink href="/#process" active={current.process}>
              How it works
            </NavLink>
          </li>
        </ul>

        <div className="hidden md:block">
          <Button href="/request" aria-current={pathname === "/request" ? "page" : undefined}>
            Start a project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>

        <MobileDrawer
          // Remounted per path, so the services list starts closed again.
          key={pathname}
          open={drawer}
          setOpen={setDrawer}
          current={current}
          pathname={pathname}
        />
      </nav>
    </header>
  );
}

// The underline marks where you are; hover previews it. One rule for every
// item, so "current" never looks like a different kind of link.
function itemClass(active) {
  return clsx(
    "relative inline-flex min-h-11 items-center gap-1.5 px-3 text-[0.975rem] font-medium transition-colors",
    "after:absolute after:inset-x-3 after:bottom-1.5 after:h-[3px] after:origin-left after:bg-[var(--color-primary)] after:transition-transform after:duration-300",
    active
      ? "text-[var(--color-text)] after:scale-x-100"
      : "text-[var(--color-muted)] after:scale-x-0 hover:text-[var(--color-text)] hover:after:scale-x-100"
  );
}

function NavLink({ href, active, page, children }) {
  return (
    <Link
      href={href}
      className={itemClass(active)}
      // "page" only for the route itself; a highlighted section on the home
      // page is a place within the page, which is what "location" means.
      aria-current={page ? "page" : active ? "location" : undefined}
    >
      {children}
    </Link>
  );
}

function ServicesMenu({ open, setOpen, active }) {
  const id = useId();
  const wrap = useRef(null);
  const button = useRef(null);
  const closeTimer = useRef(null);

  const close = useCallback(
    (refocus) => {
      setOpen(false);
      if (refocus) button.current?.focus();
    },
    [setOpen]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close(true);
    const onDown = (e) => !wrap.current?.contains(e.target) && close(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Hover opens it for a mouse, with a short grace period on the way out so
  // crossing the gap between the button and the panel does not shut it. Touch
  // and keyboard use the button, which is the real control.
  const hoverOpen = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hoverClose = (e) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };

  return (
    <div ref={wrap} onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
      <button
        ref={button}
        type="button"
        className={itemClass(active || open)}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        Services
        <ChevronDown
          className={clsx("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            // A click on the page you are already on changes no route, so
            // close on any link click rather than waiting for navigation.
            onClick={(e) => e.target.closest("a") && setOpen(false)}
            // Fixed to the header rather than the button, so the panel lines up
            // with the page's own grid instead of hanging off one word.
            className="fixed inset-x-0 top-[88px] border-b-2 border-[var(--color-ink)] bg-[var(--color-bg)]"
          >
            <div className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_280px]">
              <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((s) => (
                  <li key={s.slug}>
                    <ServiceLink service={s} />
                  </li>
                ))}
              </ul>

              <div className="panel flex flex-col justify-between gap-6 p-6">
                <div>
                  <p className="kicker">Not sure which?</p>
                  <p className="mt-3 text-[var(--color-muted)]">
                    Tell us the problem in your own words. We will say which of these fits, and what
                    it costs.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button href="/request" size="sm">
                    Describe your project
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Link
                    href="/services"
                    className="tap justify-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4"
                  >
                    Compare all nine services
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ServiceLink({ service, compact }) {
  const pathname = usePathname();
  const href = `/services/${service.slug}`;
  const here = pathname === href;

  return (
    <Link
      href={href}
      aria-current={here ? "page" : undefined}
      className={clsx(
        "group flex items-center gap-3 rounded-[4px] border-2 p-2.5 transition-colors",
        here
          ? "border-[var(--color-ink)] bg-[var(--color-surface)]"
          : "border-transparent hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)]"
      )}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] border-2 border-[var(--color-ink)]"
        style={{
          color: accentInk[service.accent] ?? accentInk.primary,
          background: accentVar[service.accent] ?? accentVar.primary,
        }}
        aria-hidden
      >
        <ServiceIcon name={service.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display font-bold leading-tight">{service.title}</span>
        {compact ? null : (
          <span className="mt-0.5 block text-sm text-[var(--color-muted)]">{service.timeline}</span>
        )}
      </span>
    </Link>
  );
}

function MobileDrawer({ open, setOpen, current, pathname }) {
  const toggle = useRef(null);
  const panel = useRef(null);
  // Starts closed, so Work, How it works and the call to action are all on the
  // first screen of the menu. It was tried starting open on service pages: the
  // nine rows pushed everything else below the fold. The breadcrumb already
  // says which service you are on.
  const [servicesOpen, setServicesOpen] = useState(false);

  // The drawer is fixed and full height, so the page behind it must not scroll.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // While it is open the drawer is the whole page: Escape closes it and hands
  // focus back to the button, and Tab cycles inside instead of wandering into
  // the page hidden behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = [toggle.current, ...panel.current.querySelectorAll("a[href], button")];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Rotating a tablet past the breakpoint would leave a drawer nobody sees
    // holding the page's scroll lock.
    const mq = window.matchMedia("(min-width: 768px)");
    const onWide = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open, setOpen]);

  const row =
    "flex min-h-14 w-full items-center justify-between rounded-[4px] px-3 font-display text-lg font-bold";

  return (
    <>
      <button
        ref={toggle}
        onClick={() => setOpen(!open)}
        className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--color-border)] md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panel}
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.target.closest("a") && setOpen(false)}
            // Full height and scrollable on its own: nine services do not fit
            // on a small phone. data-lenis-prevent, or the wheel scrolls the
            // page underneath instead (see CLAUDE.md).
            data-lenis-prevent
            className="fixed inset-x-0 bottom-0 top-[88px] overflow-y-auto overscroll-contain border-t border-[var(--color-border-soft)] bg-[var(--color-bg)] md:hidden"
          >
            <div className="container-x flex min-h-full flex-col py-4">
              <ul className="flex flex-col gap-1">
                <li>
                  <button
                    type="button"
                    className={clsx(row, current.services && "bg-[var(--color-surface-2)]")}
                    aria-expanded={servicesOpen}
                    aria-controls="mobile-services"
                    onClick={() => setServicesOpen((v) => !v)}
                  >
                    Services
                    <ChevronDown
                      className={clsx("h-5 w-5 transition-transform", servicesOpen && "rotate-180")}
                      aria-hidden
                    />
                  </button>
                  {servicesOpen ? (
                    <ul id="mobile-services" className="mt-1 mb-3 grid gap-1 pl-1">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <ServiceLink service={s} compact />
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/services"
                          className="tap gap-1.5 px-3 text-sm font-bold underline decoration-2 underline-offset-4"
                        >
                          Compare all nine
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </li>
                    </ul>
                  ) : null}
                </li>
                <li>
                  <Link
                    href="/work"
                    aria-current={pathname === "/work" ? "page" : undefined}
                    className={clsx(row, current.work && "bg-[var(--color-surface-2)]")}
                  >
                    Work
                  </Link>
                </li>
                <li>
                  <Link href="/#process" className={row}>
                    How it works
                  </Link>
                </li>
              </ul>

              <div className="mt-auto flex flex-col gap-3 pt-8 pb-4">
                <Button href="/request" className="w-full" size="lg">
                  Start a project
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button
                  href={whatsappHref({ service: "a project" })}
                  external
                  variant="ghost"
                  className="w-full"
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 text-[#1a9e4b]" />
                  Or WhatsApp us
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
