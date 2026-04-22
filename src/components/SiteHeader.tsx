import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type NavLink = {
  /** anchor id on the homepage */
  section: string;
  /** standalone route (used as fallback / for SEO) */
  to: "/" | "/about" | "/services" | "/transformations" | "/pricing" | "/trainers" | "/schedule" | "/contact";
  label: string;
};

const links: NavLink[] = [
  { section: "home",            to: "/",                label: "Home" },
  { section: "about",           to: "/about",           label: "About" },
  { section: "services",        to: "/services",        label: "Services" },
  { section: "transformations", to: "/transformations", label: "Transformations" },
  { section: "pricing",         to: "/pricing",         label: "Pricing" },
  { section: "trainers",        to: "/trainers",        label: "Trainers" },
  { section: "schedule",        to: "/schedule",        label: "Schedule" },
  { section: "contact",         to: "/contact",         label: "Contact" },
];

function smoothScrollTo(id: string) {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: highlight nav link based on section in viewport (homepage only)
  useEffect(() => {
    if (!onHome) return;
    const sectionIds = links.map((l) => l.section);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [onHome]);

  // If we land on home with a hash, scroll to it
  useEffect(() => {
    if (!onHome) return;
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      // wait one tick for layout
      requestAnimationFrame(() => smoothScrollTo(hash));
    }
  }, [onHome, location.pathname]);

  const handleNavClick =
    (link: NavLink) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      // On homepage, intercept and smooth-scroll to section
      if (onHome) {
        e.preventDefault();
        smoothScrollTo(link.section);
        history.replaceState(null, "", link.section === "home" ? "/" : `/#${link.section}`);
        setOpen(false);
        return;
      }
      // From any other page, jump home then scroll
      e.preventDefault();
      navigate({ to: "/", hash: link.section === "home" ? undefined : link.section });
      setOpen(false);
    };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container mx-auto px-5 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-md bg-gradient-electric flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
            <span className="font-display text-xl text-primary-foreground">T</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg tracking-widest">
              TOTAL<span className="text-primary">FIT</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground -mt-0.5">
              Studio · Chromepet
            </div>
          </div>
        </Link>

        <ul className="hidden xl:flex items-center gap-5 2xl:gap-7 min-w-0">
          {links.map((l) => {
            const isActive = onHome
              ? activeSection === l.section
              : location.pathname === l.to;
            return (
              <li key={l.section}>
                <Link
                  to={l.to}
                  onClick={handleNavClick(l)}
                  className={`whitespace-nowrap text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors relative ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-primary shadow-glow" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/contact"
            onClick={handleNavClick(links[links.length - 1])}
            className="hidden sm:inline-flex whitespace-nowrap bg-accent text-accent-foreground px-4 py-2.5 rounded-md font-bold tracking-wider uppercase text-[11px] hover:shadow-neon transition-all"
          >
            Free Trial
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden w-10 h-10 inline-flex items-center justify-center rounded-md border border-border text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="xl:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <ul className="container mx-auto px-5 py-4 grid gap-2">
            {links.map((l) => {
              const isActive = onHome
                ? activeSection === l.section
                : location.pathname === l.to;
              return (
                <li key={l.section}>
                  <Link
                    to={l.to}
                    onClick={handleNavClick(l)}
                    className={`block py-2 text-sm uppercase tracking-wider ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
