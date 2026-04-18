import { useEffect, useState } from "react";

const links = [
  { href: "#programs", label: "Programs" },
  { href: "#transformations", label: "Results" },
  { href: "#trainers", label: "Trainers" },
  { href: "#join", label: "Join" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border py-3"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-md bg-gradient-blood flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
            <span className="font-display text-xl text-primary-foreground">T</span>
          </div>
          <span className="font-display text-xl tracking-widest">
            TOTAL<span className="text-primary">FIT</span>
          </span>
        </a>
        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#join"
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-semibold tracking-wider uppercase text-xs hover:bg-primary/90 hover:shadow-glow transition-all"
        >
          Join Now
        </a>
      </nav>
    </header>
  );
}
