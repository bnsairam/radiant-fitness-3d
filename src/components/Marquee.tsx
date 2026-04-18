const words = ["STRENGTH", "POWER", "DISCIPLINE", "LEGACY", "RELENTLESS", "ELITE", "FORGED"];

export function Marquee() {
  const items = [...words, ...words];
  return (
    <div className="relative py-8 overflow-hidden border-y border-border bg-card/40">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {items.map((w, i) => (
          <div key={i} className="flex items-center gap-12 shrink-0">
            <span className="font-display text-5xl md:text-7xl text-stroke">{w}</span>
            <span className="w-3 h-3 rounded-full bg-primary shadow-glow" />
          </div>
        ))}
      </div>
    </div>
  );
}
