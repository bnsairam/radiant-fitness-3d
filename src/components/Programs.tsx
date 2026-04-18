const programs = [
  {
    n: "01",
    title: "Iron Forge",
    desc: "Powerlifting and strength science. Build raw, dense muscle with periodized programming.",
    tags: ["Strength", "Hypertrophy"],
  },
  {
    n: "02",
    title: "Combustion HIIT",
    desc: "45-minute thermogenic burn. Heart-rate-zoned circuits torch fat and forge endurance.",
    tags: ["Cardio", "Fat Loss"],
  },
  {
    n: "03",
    title: "Athlete Lab",
    desc: "Sport-specific conditioning. Sprint mechanics, plyometrics, and recovery protocols.",
    tags: ["Performance", "Speed"],
  },
  {
    n: "04",
    title: "Mobility Vault",
    desc: "Restorative flow, deep stretching, and corrective work to bulletproof your joints.",
    tags: ["Recovery", "Flow"],
  },
  {
    n: "05",
    title: "Boxing Pit",
    desc: "Technique, footwork, sparring. Coached by former pros in our dedicated ring.",
    tags: ["Combat", "Cardio"],
  },
  {
    n: "06",
    title: "1:1 Elite",
    desc: "Personal coaching with full-body scans, nutrition, and weekly accountability.",
    tags: ["Coaching", "Custom"],
  },
];

export function Programs() {
  return (
    <section id="programs" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mb-20">
          <div className="text-xs uppercase tracking-[0.4em] text-primary mb-4">
            — Our Programs
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.9]">
            Six Disciplines.<br />
            <span className="text-primary text-glow">One Standard.</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl">
            Every program is engineered by sports scientists and refined by world-class coaches.
            Pick your path or stack them all.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
          {programs.map((p) => (
            <article
              key={p.n}
              className="tilt-card group relative bg-card border border-border rounded-xl p-8 overflow-hidden hover:border-primary/60 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <span className="font-display text-5xl text-stroke">{p.n}</span>
                  <div className="w-12 h-12 rounded-full border border-primary/40 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                <h3 className="font-display text-3xl mb-3">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{p.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
