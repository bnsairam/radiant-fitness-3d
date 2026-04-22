import { useReveal } from "@/hooks/use-scroll-reveal";
import { useCountUp, useInView } from "@/hooks/use-reveal";

const STATS = [
  { value: 500, suffix: "+", label: "Members Trained", color: "text-primary" },
  { value: 8500, suffix: "kg", label: "Total Weight Lost", color: "text-accent" },
  { value: 35, suffix: "+", label: "Classes Per Week", color: "text-flame" },
  { value: 10, suffix: " yrs", label: "Serving Chromepet", color: "text-primary" },
] as const;

export function StatsBand() {
  const { ref, revealed } = useReveal<HTMLDivElement>(0.25);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden border-y border-border bg-card/40">
      <div aria-hidden className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none" />
      <div
        ref={ref}
        className={`reveal ${revealed ? "is-revealed" : ""} container mx-auto px-5 relative z-10`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <StatTile key={s.label} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatTile({
  value,
  suffix,
  label,
  color,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  color: string;
  index: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const count = useCountUp(value, inView, 1800);
  return (
    <div
      ref={ref}
      style={{ ["--i" as never]: index }}
      className="rounded-xl border border-border bg-background/60 backdrop-blur p-5 md:p-7 text-center hover:border-primary/60 transition-colors"
    >
      <div className={`font-display text-4xl md:text-6xl leading-none text-glow ${color}`}>
        {count.toLocaleString()}
        <span className="text-2xl md:text-3xl">{suffix}</span>
      </div>
      <div className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground mt-3">
        {label}
      </div>
    </div>
  );
}
