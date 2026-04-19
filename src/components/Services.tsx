const SERVICES = [
  {
    title: "Strength Training",
    icon: "💪",
    body: "Premium racks, dumbbells up to 50kg, dedicated platforms. Build real strength with proper coaching.",
    color: "primary",
  },
  {
    title: "Cardio Zone",
    icon: "🏃",
    body: "Latest treadmills, ellipticals, bikes and rowers — plenty of stations, never a wait.",
    color: "accent",
  },
  {
    title: "Group Classes",
    icon: "🔥",
    body: "Zumba, HIIT, Yoga, Bootcamp & more. High-energy sessions led by certified instructors.",
    color: "flame",
  },
  {
    title: "Personal Training",
    icon: "🎯",
    body: "1:1 coaching tailored to your goal — fat loss, muscle, strength or rehabilitation.",
    color: "primary",
  },
  {
    title: "Women-Friendly",
    icon: "🛡️",
    body: "Safe, welcoming, judgement-free space. Female trainers available. The gym women in Chromepet trust.",
    color: "accent",
  },
  {
    title: "Weight Loss Programs",
    icon: "⚡",
    body: "Structured 90-day fat-loss & body recomp programs with diet guidance and weekly check-ins.",
    color: "flame",
  },
];

export function Services({ heading = true }: { heading?: boolean }) {
  return (
    <section id="services" className="relative py-24 md:py-28">
      <div className="container mx-auto px-5">
        {heading && (
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-px bg-primary" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-primary font-semibold">
                Everything You Need
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95]">
              One studio. <span className="text-accent text-glow">Every kind</span> of training.
            </h2>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="group relative rounded-2xl border border-border bg-card p-7 hover:-translate-y-1.5 hover:border-primary/60 transition-all overflow-hidden tilt-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity ${
                  s.color === "primary"
                    ? "bg-primary"
                    : s.color === "accent"
                      ? "bg-accent"
                      : "bg-flame"
                }`}
              />
              <div className="relative">
                <div className="text-4xl mb-5">{s.icon}</div>
                <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
