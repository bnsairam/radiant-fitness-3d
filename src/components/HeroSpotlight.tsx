import { useRef, useState } from "react";
import { useCountUp, useInView } from "@/hooks/use-reveal";
import type { Champion } from "./ChampionCard";

/**
 * Hero spotlight — one giant centerpiece transformation.
 * Draggable before/after split with cinematic frame, spotlight, and animated stats.
 */
export function HeroSpotlight({ c }: { c: Champion }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const [pos, setPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClient = (clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  const days = useCountUp(c.days, inView);
  const kg = useCountUp(c.kgLost, inView);
  const muscle = useCountUp(c.muscleGained, inView);

  return (
    <div
      ref={ref}
      className="relative max-w-6xl mx-auto perspective-1000"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(60px) scale(0.95)",
        transition: "opacity 1.2s ease-out, transform 1.2s cubic-bezier(0.2,0.8,0.2,1)",
      }}
    >
      {/* Outer glow halo */}
      <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-[pulse-glow_4s_ease-in-out_infinite]" />

      <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-0 rounded-3xl overflow-hidden border border-primary/40 bg-gradient-to-br from-primary/30 via-blood to-background p-[2px] shadow-3d">
        <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-0 rounded-[22px] overflow-hidden bg-background">
          {/* SLIDER */}
          <div
            ref={sliderRef}
            className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[640px] overflow-hidden cursor-ew-resize select-none"
            onMouseDown={(e) => {
              dragging.current = true;
              updateFromClient(e.clientX);
            }}
            onMouseMove={(e) => dragging.current && updateFromClient(e.clientX)}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchStart={(e) => updateFromClient(e.touches[0].clientX)}
            onTouchMove={(e) => updateFromClient(e.touches[0].clientX)}
          >
            {/* AFTER (base) — bright */}
            <img
              src={c.after}
              alt={`${c.name} after`}
              width={1024}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover brightness-110 saturate-125"
              draggable={false}
            />
            {/* BEFORE (clipped) — muted */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <img
                src={c.before}
                alt={`${c.name} before`}
                width={1024}
                height={1280}
                className="w-full h-full object-cover grayscale brightness-75 contrast-110"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>

            {/* Top corner spotlight */}
            <div
              className="absolute -top-32 -left-20 w-[600px] h-[400px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(0.85 0.2 30 / 0.45) 0%, transparent 60%)",
              }}
            />
            {/* Red ambient fog bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/30 via-blood/10 to-transparent pointer-events-none" />

            {/* Slider line + glowing handle */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-primary pointer-events-none"
              style={{ left: `${pos}%`, boxShadow: "0 0 40px oklch(0.65 0.26 25 / 1)" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-blood border-4 border-background shadow-glow flex items-center justify-center animate-[pulse-glow_2.5s_ease-in-out_infinite]">
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                  <path d="M7 5L2 10L7 15M13 5L18 10L13 15" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-5 left-5 px-3 py-1.5 rounded bg-black/80 backdrop-blur text-[10px] uppercase tracking-[0.3em] font-bold border border-white/15">
              Before
            </div>
            <div className="absolute top-5 right-5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.3em] font-bold shadow-glow">
              After
            </div>
          </div>

          {/* INFO PANEL */}
          <div className="relative p-8 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-card via-background to-background overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-blood flex items-center justify-center font-display text-2xl shadow-glow border border-primary/60">
                  {c.initial}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
                    Hall of Fame · Champion #001
                  </div>
                  <div className="font-display text-3xl">{c.name}</div>
                </div>
              </div>

              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                Program
              </div>
              <div className="font-display text-xl mb-8">{c.program}</div>

              <blockquote className="relative pl-6 border-l-2 border-primary mb-10">
                <div className="absolute -left-3 top-0 text-4xl text-primary leading-none font-display">
                  &ldquo;
                </div>
                <p className="text-lg italic text-foreground/90 leading-relaxed">{c.quote}</p>
              </blockquote>
            </div>

            {/* Animated stats grid */}
            <div className="grid grid-cols-3 gap-4 relative">
              <BigStat value={days} label="Days" />
              <BigStat value={kg} label="KG Lost" accent />
              <BigStat value={muscle} label="Muscle" suffix="kg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({
  value,
  label,
  suffix,
  accent,
}: {
  value: number;
  label: string;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative p-4 rounded-xl border ${
        accent ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card/60"
      }`}
    >
      <div className="font-display text-4xl text-glow leading-none">
        {value}
        {suffix && <span className="text-lg ml-0.5 opacity-80">{suffix}</span>}
      </div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
        {label}
      </div>
    </div>
  );
}
