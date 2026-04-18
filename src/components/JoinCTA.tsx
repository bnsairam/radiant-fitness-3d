const tiers = [
  {
    name: "Spark",
    price: "49",
    desc: "Get started. Full studio access during off-peak hours.",
    perks: ["Open gym 6am–4pm", "All group classes", "Locker access"],
    featured: false,
  },
  {
    name: "Forge",
    price: "99",
    desc: "Our most popular plan. Anytime access plus coaching.",
    perks: ["24/7 access", "All classes & studios", "Monthly body scan", "1 PT session"],
    featured: true,
  },
  {
    name: "Elite",
    price: "199",
    desc: "Total transformation. Personal coaching included.",
    perks: ["Everything in Forge", "Weekly 1:1 coaching", "Custom nutrition", "Recovery suite"],
    featured: false,
  },
];

export function JoinCTA() {
  return (
    <section id="join" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-ember opacity-20 pointer-events-none" />
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="text-xs uppercase tracking-[0.4em] text-primary mb-4">
            — Choose Your Path
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.9]">
            Ready To<br />
            <span className="text-primary text-glow">Begin?</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-6">
            No contracts. No fine print. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 perspective-1000">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`tilt-card relative rounded-2xl p-8 border ${
                t.featured
                  ? "bg-gradient-blood border-primary shadow-glow scale-105"
                  : "bg-card border-border"
              }`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-primary px-4 py-1 rounded-full text-xs uppercase tracking-widest font-bold border border-primary">
                  Most Chosen
                </div>
              )}
              <div className="font-display text-2xl uppercase mb-2">{t.name}</div>
              <p className={`text-sm mb-6 ${t.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {t.desc}
              </p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="font-display text-6xl">${t.price}</span>
                <span className={t.featured ? "text-primary-foreground/70" : "text-muted-foreground"}>
                  /month
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 ${t.featured ? "text-primary-foreground" : "text-primary"}`}>
                      ✓
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 rounded-md font-semibold tracking-wider uppercase text-sm transition-all ${
                  t.featured
                    ? "bg-background text-primary hover:bg-background/90"
                    : "bg-primary text-primary-foreground hover:shadow-glow"
                }`}
              >
                Join {t.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
