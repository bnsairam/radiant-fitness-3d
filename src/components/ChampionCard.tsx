import { useRef, useState, type CSSProperties } from "react";
import { useCountUp, useInView } from "@/hooks/use-reveal";

export type Champion = {
  name: string;
  initial: string;
  before: string;
  after: string;
  days: number;
  kgLost: number;
  muscleGained: number;
  program: string;
  quote: string;
};

/**
 * Premium 3D framed transformation card.
 * - Multi-layer frame (shadow → metallic edge → glass → image)
 * - Mouse tilt with parallax depth
 * - Scroll reveal: emerges from darkness + rotates into place
 * - Animated stats counter
 * - Shine sweep on hover
 */
export function ChampionCard({ c, index }: { c: Champion; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, mx: 50, my: 50 });

  const onMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (py - 0.5) * -10,
      y: (px - 0.5) * 14,
      mx: px * 100,
      my: py * 100,
    });
  };
  const onLeave = () => setTilt({ x: 0, y: 0, mx: 50, my: 50 });

  const days = useCountUp(c.days, inView);
  const kg = useCountUp(c.kgLost, inView);
  const muscle = useCountUp(c.muscleGained, inView);

  const revealStyle: CSSProperties = {
    transition: "opacity 1s ease-out, transform 1.1s cubic-bezier(0.2,0.8,0.2,1)",
    transitionDelay: `${index * 120}ms`,
    opacity: inView ? 1 : 0,
    transform: inView
      ? "translateY(0) rotateX(0) scale(1)"
      : "translateY(60px) rotateX(15deg) scale(0.9)",
  };

  return (
    <div ref={ref} style={revealStyle} className="perspective-1000">
      <article
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative preserve-3d transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft floor shadow */}
        <div
          className="absolute -bottom-10 left-6 right-6 h-12 bg-black/80 blur-2xl rounded-full opacity-60 group-hover:opacity-90 transition-opacity"
          style={{ transform: "translateZ(-40px)" }}
        />

        {/* Outer red glow ring */}
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary via-crimson to-blood opacity-50 blur-md group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        />

        {/* Metallic edge frame */}
        <div
          className="relative rounded-2xl p-[2px] bg-gradient-to-br from-primary/80 via-crimson to-blood shadow-3d"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Inner glass layer */}
          <div className="relative rounded-[14px] overflow-hidden bg-background">
            {/* Before / After split with depth */}
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* BEFORE — recessed, muted, darker */}
              <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                <img
                  src={c.before}
                  alt={`${c.name} before transformation`}
                  loading="lazy"
                  width={480}
                  height={600}
                  className="w-[200%] h-full object-cover grayscale brightness-75 contrast-110 transition-transform duration-700 group-hover:scale-105"
                  style={{ transform: "translateZ(-10px)" }}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/40" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur text-[10px] uppercase tracking-[0.25em] font-bold text-muted-foreground border border-white/10">
                  Before
                </div>
              </div>

              {/* AFTER — popped forward, vivid, brighter */}
              <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
                <img
                  src={c.after}
                  alt={`${c.name} after transformation`}
                  loading="lazy"
                  width={480}
                  height={600}
                  className="w-[200%] h-full object-cover object-right brightness-110 saturate-125 contrast-110 transition-transform duration-700 group-hover:scale-110"
                  style={{ transform: "translate3d(-50%, 0, 30px)" }}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-primary/20 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.25em] font-bold shadow-glow">
                  After
                </div>
              </div>

              {/* Center divider with glow */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-primary to-transparent shadow-glow" />

              {/* Top spotlight */}
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-[140%] h-40 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, oklch(0.7 0.25 25 / 0.5) 0%, transparent 60%)",
                }}
              />

              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

              {/* Shine sweep on hover */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) ${
                    tilt.mx * 0.6 + 20
                  }%, transparent 70%)`,
                }}
              />

              {/* Bottom info gradient */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent" />

              {/* Name plate */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <div className="font-display text-2xl leading-none text-glow">{c.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-primary mt-1.5">
                    {c.program}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-blood flex items-center justify-center font-display text-xl shadow-glow border border-primary/60">
                  {c.initial}
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 divide-x divide-border bg-card/80 backdrop-blur">
              <Stat label="Days" value={days} />
              <Stat label="KG Lost" value={kg} />
              <Stat label="Muscle" value={muscle} suffix="kg" />
            </div>

            {/* Quote — appears on hover */}
            <div className="px-5 py-4 border-t border-border bg-background/80">
              <p className="text-sm italic text-muted-foreground leading-snug">
                <span className="text-primary mr-1">&ldquo;</span>
                {c.quote}
                <span className="text-primary ml-1">&rdquo;</span>
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="py-3 text-center">
      <div className="font-display text-2xl text-primary text-glow leading-none">
        {value}
        {suffix && <span className="text-sm ml-0.5 opacity-80">{suffix}</span>}
      </div>
      <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1.5">
        {label}
      </div>
    </div>
  );
}
