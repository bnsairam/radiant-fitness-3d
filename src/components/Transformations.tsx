import { GalleryBackdrop } from "./GalleryBackdrop";
import { ChampionCard, type Champion } from "./ChampionCard";
import { HeroSpotlight } from "./HeroSpotlight";

import b1 from "@/assets/champion-1-before.jpg";
import a1 from "@/assets/champion-1-after.jpg";
import b2 from "@/assets/champion-2-before.jpg";
import a2 from "@/assets/champion-2-after.jpg";
import b3 from "@/assets/champion-3-before.jpg";
import a3 from "@/assets/champion-3-after.jpg";

const spotlight: Champion = {
  name: "Arun M.",
  initial: "A",
  before: b1,
  after: a1,
  days: 120,
  kgLost: 28,
  muscleGained: 9,
  program: "Iron Forge · 1:1 Elite",
  quote: "Total Fitness changed my life. I walked in broken. I walked out a weapon.",
};

const champions: Champion[] = [
  {
    name: "Sofia R.",
    initial: "S",
    before: b2,
    after: a2,
    days: 140,
    kgLost: 14,
    muscleGained: 6,
    program: "Combustion HIIT",
    quote: "I came in unsure of myself. I left unstoppable.",
  },
  {
    name: "Robert L.",
    initial: "R",
    before: b3,
    after: a3,
    days: 180,
    kgLost: 22,
    muscleGained: 7,
    program: "Athlete Lab · Mobility",
    quote: "At 54, I'm in the best shape of my entire life.",
  },
  {
    name: "Marcus K.",
    initial: "M",
    before: b1,
    after: a1,
    days: 168,
    kgLost: 32,
    muscleGained: 14,
    program: "Iron Forge",
    quote: "Every rep here counts. Every coach is obsessed with my progress.",
  },
  {
    name: "Elena V.",
    initial: "E",
    before: b2,
    after: a2,
    days: 90,
    kgLost: 11,
    muscleGained: 5,
    program: "Boxing Pit",
    quote: "I found my power. And then I doubled it.",
  },
  {
    name: "David T.",
    initial: "D",
    before: b3,
    after: a3,
    days: 200,
    kgLost: 26,
    muscleGained: 10,
    program: "1:1 Elite",
    quote: "Two years of failure. Six months here. Done.",
  },
];

export function Transformations() {
  return (
    <section
      id="transformations"
      className="relative py-32 overflow-hidden bg-background noise"
    >
      {/* Layered cinematic backdrop */}
      <GalleryBackdrop />

      {/* Heavy red ambient fog */}
      <div className="absolute inset-0 bg-gradient-radial-red opacity-50 pointer-events-none z-[1]" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent z-[1] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent z-[1] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-12 h-px bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">
              Hall of Fame · 2026
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.85]">
            Real Bodies.<br />
            <span className="text-primary text-glow">Real Proof.</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed">
            These aren't photos. They're trophies. Every champion below walked through our doors
            ordinary — and walked out a legend. Drag the slider on the spotlight. Hover the wall.
            Then book your seat.
          </p>
        </div>

        {/* HERO SPOTLIGHT */}
        <div className="mb-32">
          <div className="flex items-end justify-between mb-8 max-w-6xl mx-auto">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-primary mb-2">
                ★ Featured Transformation
              </div>
              <h3 className="font-display text-3xl md:text-4xl">The Champion Spotlight</h3>
            </div>
            <div className="hidden md:block text-xs uppercase tracking-widest text-muted-foreground">
              ← Drag the slider →
            </div>
          </div>
          <HeroSpotlight c={spotlight} />
        </div>

        {/* WALL OF CHAMPIONS */}
        <div>
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-primary mb-2">
                ◆ Wall of Champions
              </div>
              <h3 className="font-display text-3xl md:text-4xl">12,000+ Lives Rebuilt</h3>
            </div>
            <a
              href="#join"
              className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:gap-3 transition-all"
            >
              Become Next →
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {champions.map((c, i) => (
              <ChampionCard key={c.name} c={c} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-24 relative rounded-2xl border border-primary/40 bg-gradient-to-r from-blood via-primary/20 to-blood p-[2px] overflow-hidden">
          <div className="rounded-[14px] bg-background/90 backdrop-blur px-8 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-primary mb-2">
                Your Photo Belongs Here
              </div>
              <div className="font-display text-2xl md:text-3xl">
                Start your transformation. <span className="text-primary">Today.</span>
              </div>
            </div>
            <a
              href="#join"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-md font-semibold tracking-wider uppercase text-sm shadow-glow hover:shadow-blood transition-all"
            >
              Claim Your Spot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
