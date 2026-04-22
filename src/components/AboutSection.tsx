import { Link } from "@tanstack/react-router";
import gym from "@/assets/hero-gym.jpg";

const STATS = [
  { k: "10+ yrs", v: "Serving Chromepet" },
  { k: "500+", v: "Real Transformations" },
  { k: "4.9/5", v: "Member Rating" },
  { k: "6A – 10P", v: "Open Every Day" },
  { k: "100%", v: "Certified Trainers" },
  { k: "Women Safe", v: "Trusted Space" },
];

export function AboutSection({ heading = true }: { heading?: boolean }) {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={gym} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="container mx-auto px-5 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          {heading && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-12 h-px bg-primary" />
                <span className="text-[11px] uppercase tracking-[0.4em] text-primary font-semibold">
                  About Total Fitness Studio
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
                A premium fitness home in the heart of{" "}
                <span className="text-accent">Chromepet</span>.
              </h2>
            </>
          )}

          <div className="mt-6 space-y-5 text-foreground/85 leading-relaxed">
            <p>
              Since 2014, on the 3rd floor of the Vijaya Saras Building above Axis Bank in
              Hasthinapuram, we've helped hundreds of members across Chromepet, Pallavaram and
              Chennai completely transform their bodies — and their lives.
            </p>
            <p>
              Our studio is intentionally <strong className="text-foreground">premium and spacious</strong> —
              never overcrowded, always inviting. We're particularly proud of being one of the
              <strong className="text-accent"> safest, most welcoming gyms in Chromepet for women</strong>,
              with female trainers and dedicated programs.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/about"
              className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold tracking-wider uppercase text-xs shadow-glow hover:shadow-neon transition-all"
            >
              Read Full Story
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center border border-border px-6 py-3 rounded-md font-bold tracking-wider uppercase text-xs hover:border-accent hover:text-accent transition-all"
            >
              Free Trial
            </Link>
          </div>
        </div>

        <ul className="grid sm:grid-cols-2 gap-4">
          {STATS.map((s) => (
            <li
              key={s.k}
              className="rounded-xl border border-border bg-card/70 backdrop-blur p-6 hover:border-primary/60 transition-colors"
            >
              <div className="font-display text-3xl md:text-4xl text-primary text-glow">
                {s.k}
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-2">
                {s.v}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
