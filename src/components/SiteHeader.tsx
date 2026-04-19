import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/transformations", label: "Transformations" },
  { to: "/pricing", label: "Pricing" },
  { to: "/trainers", label: "Trainers" },
  { to: "/schedule", label: "Schedule" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground hover:text-primary transition-colors relative"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden sm:inline-flex bg-accent text-accent-foreground px-5 py-2.5 rounded-md font-bold tracking-wider uppercase text-[11px] hover:shadow-neon transition-all"
          >
            Free Trial
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-md border border-border text-foreground"
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
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <ul className="container mx-auto px-5 py-4 grid gap-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm uppercase tracking-wider text-muted-foreground hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
