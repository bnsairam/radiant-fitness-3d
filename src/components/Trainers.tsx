import gymInterior from "@/assets/gym-interior.jpg";

const trainers = [
  { name: "Diego Vega", role: "Head of Strength", spec: "Powerlifting · IPF Coach" },
  { name: "Aria Lin", role: "HIIT & Conditioning", spec: "NSCA-CSCS · Olympian" },
  { name: "Kai Reeves", role: "Performance Lab", spec: "MSc Sport Science" },
  { name: "Nadia Cole", role: "Boxing & Combat", spec: "Former Pro · USA Boxing" },
];

export function Trainers() {
  return (
    <section id="trainers" className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative perspective-1000">
            <div className="tilt-card relative rounded-2xl overflow-hidden border border-border shadow-3d">
              <img
                src={gymInterior}
                alt="Inside the TotalFit studio"
                loading="lazy"
                width={1536}
                height={1024}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-glow max-w-[200px]">
              <div className="font-display text-4xl">12,000</div>
              <div className="text-xs uppercase tracking-widest opacity-80">sq ft of pure iron</div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-primary mb-4">
              — The Coaches
            </div>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.9] mb-6">
              Trained By<br />
              <span className="text-primary text-glow">The Best.</span>
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg">
              Olympians, sport scientists, former pros. Every coach is hand-picked, certified,
              and obsessed with your results.
            </p>

            <div className="space-y-4">
              {trainers.map((t) => (
                <div
                  key={t.name}
                  className="group flex items-center justify-between p-5 rounded-lg border border-border bg-card/50 hover:border-primary/60 hover:bg-card transition-all"
                >
                  <div>
                    <div className="font-display text-xl">{t.name}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                      {t.spec}
                    </div>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.role} →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
