import { Link } from "@tanstack/react-router";
import heroGym from "@/assets/hero-gym.jpg";
import { ThreeScene } from "./ThreeScene";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center noise">
      {/* Animated aurora mesh */}
      <div aria-hidden="true" className="absolute inset-0 z-[1] aurora pointer-events-none" />
      {/* Moving grid floor */}
      <div aria-hidden="true" className="absolute inset-0 z-[2] grid-floor opacity-40 pointer-events-none" />

      {/* 3D background */}
      <ThreeScene />

      {/* Gym backdrop */}
      <div className="absolute inset-0 z-10">
        <img
          src={heroGym}
          alt="Total Fitness Studio interior — premium gym in Chromepet, Chennai"
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center pt-32 pb-24">
        <div className="space-y-8 animate-[fade-up_1s_ease-out_both]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-accent animate-[pulse-glow_2s_ease-in-out_infinite]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold">
              Chromepet · Hasthinapuram · Since 2014
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.88] text-glow">
            Chennai's
            <br />
            <span className="text-gradient-animated">Premier</span> Fitness
            <br />
            <span className="text-stroke">Studio</span> in <span className="text-accent">Chromepet</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Luxury Gym · Personal Training · Group Classes · Real Transformations.
            Safe, welcoming, and engineered for life-changing results.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="group relative inline-flex items-center justify-center bg-gradient-flame text-white px-8 py-4 rounded-md font-bold tracking-wider uppercase text-sm shadow-flame hover:shadow-glow transition-all overflow-hidden"
            >
              <span className="relative z-10">Claim Your Free Trial</span>
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center border border-primary/50 hover:border-primary text-foreground px-8 py-4 rounded-md font-bold tracking-wider uppercase text-sm hover:bg-primary/10 transition-all"
            >
              Explore Memberships
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Star /> <span className="text-foreground font-semibold">4.9/5</span> Rating
            </span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span><span className="text-foreground font-semibold">Since 2014</span></span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span>Safe Environment <span className="text-accent">For All</span></span>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4 max-w-md">
            {[
              { v: "500+", l: "Transformations" },
              { v: "10+", l: "Years" },
              { v: "6 AM–10 PM", l: "Open Daily" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl md:text-3xl text-primary text-glow leading-none">
                  {s.v}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1.5">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating spec card */}
        <div className="hidden lg:flex justify-center perspective-1000">
          <div className="relative tilt-card">
            <div className="absolute -inset-4 bg-gradient-electric rounded-2xl blur-2xl opacity-50 animate-[pulse-glow_3s_ease-in-out_infinite]" />
            <div className="relative w-[380px] aspect-[3/4] rounded-2xl overflow-hidden border border-primary/30 shadow-3d">
              <img
                src={heroGym}
                alt=""
                width={420}
                height={560}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <div className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] font-bold shadow-neon">
                  ★ Premier
                </div>
                <div className="px-3 py-1.5 rounded-full bg-background/70 backdrop-blur text-[10px] uppercase tracking-[0.25em] border border-border">
                  3rd Floor
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
                  Total Fitness Studio
                </div>
                <div className="font-display text-2xl leading-tight">
                  Above Axis Bank, Hasthinapuram
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Chromepet · Chennai 600044
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-accent">
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.9L10 1.5z" />
    </svg>
  );
}
