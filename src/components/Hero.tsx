import heroAthlete from "@/assets/hero-athlete.jpg";
import { ThreeScene } from "./ThreeScene";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center noise">
      {/* 3D background */}
      <ThreeScene />

      {/* Athlete image with red overlay */}
      <div className="absolute inset-0 z-10">
        <img
          src={heroAthlete}
          alt="Elite athlete training in the studio"
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center pt-32 pb-20">
        <div className="space-y-8 animate-[fade-up_1s_ease-out_both]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-primary animate-[pulse-glow_2s_ease-in-out_infinite]" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Now Open · 2026</span>
          </div>

          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.85] text-glow">
            Forge
            <br />
            <span className="text-primary">Your</span>
            <br />
            <span className="text-stroke">Legend</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
            Step inside the most advanced fitness studio on Earth. Three-dimensional training,
            elite coaches, and a community engineered to break every limit.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#join"
              className="group relative inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-md font-semibold tracking-wider uppercase text-sm shadow-glow hover:shadow-blood transition-all overflow-hidden"
            >
              <span className="relative z-10">Start Free Trial</span>
              <span className="absolute inset-0 bg-gradient-blood opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="#transformations"
              className="inline-flex items-center justify-center border border-primary/40 hover:border-primary text-foreground px-8 py-4 rounded-md font-semibold tracking-wider uppercase text-sm hover:bg-primary/10 transition-all"
            >
              See Transformations
            </a>
          </div>

          <div className="flex gap-10 pt-6">
            {[
              { v: "12K+", l: "Members" },
              { v: "98%", l: "Goal Hit Rate" },
              { v: "24/7", l: "Open" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-4xl text-primary text-glow">{s.v}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating 3D card */}
        <div className="hidden lg:flex justify-center perspective-1000">
          <div className="relative tilt-card">
            <div className="absolute -inset-4 bg-gradient-blood rounded-2xl blur-2xl opacity-50 animate-[pulse-glow_3s_ease-in-out_infinite]" />
            <div className="relative w-[420px] aspect-[3/4] rounded-2xl overflow-hidden border border-primary/30 shadow-3d">
              <img
                src={heroAthlete}
                alt=""
                width={420}
                height={560}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                  Featured Member
                </div>
                <div className="font-display text-2xl">Marcus K.</div>
                <div className="text-sm text-muted-foreground">-32lbs · +14lbs lean mass</div>
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
