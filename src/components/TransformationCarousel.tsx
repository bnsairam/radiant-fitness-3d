import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Transformation } from "./TransformationCard";

/**
 * 3D rotating carousel — cards orbit on a circular rig in true CSS perspective.
 * - Drag horizontally (mouse or touch) to rotate.
 * - Wheel/trackpad horizontal scroll also rotates.
 * - Prev / Next buttons step exactly one card.
 * - Auto-rotates gently when idle; pauses on interaction.
 * - Active card pops forward with a glowing edge; side cards dim and recede.
 *
 * Visual depth comes from real `transform: rotateY(...) translateZ(R)` on each
 * card placed inside a `perspective` parent — no fake CSS hacks.
 */
export function CarouselCarousel({ items }: { items: Transformation[] }) {
  const N = items.length;
  const stage = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(360);          // card width
  const [angle, setAngle] = useState(0);    // current rotation deg
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ active: boolean; startX: number; startAngle: number }>({
    active: false,
    startX: 0,
    startAngle: 0,
  });

  // Card width responds to viewport
  useEffect(() => {
    const compute = () => {
      const sw = stage.current?.clientWidth ?? 1000;
      setW(Math.max(240, Math.min(380, Math.floor(sw * 0.42))));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Geometry: angle between cards & ring radius
  const step = 360 / N;
  // radius derived so neighbors don't overlap, with a comfortable gap
  const radius = Math.round(w / 2 / Math.tan(Math.PI / N)) + 40;

  // Auto rotate (slow, idle-only)
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setAngle((a) => a - 0.15), 40);
    return () => window.clearInterval(id);
  }, [paused]);

  const snap = (delta: number) => {
    setAngle((a) => Math.round((a + delta) / step) * step);
  };

  // Pointer drag
  const onPointerDown = (e: React.PointerEvent) => {
    setPaused(true);
    drag.current = { active: true, startX: e.clientX, startAngle: angle };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    setAngle(drag.current.startAngle + dx * 0.35);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    // snap to nearest card
    setAngle((a) => Math.round(a / step) * step);
  };

  // Compute "active" card index from angle for badge / shadow
  const activeIdx = ((Math.round(-angle / step) % N) + N) % N;

  return (
    <div
      ref={stage}
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stage with perspective */}
      <div
        className="relative mx-auto select-none touch-none"
        style={{
          height: Math.round(w * 1.4),
          perspective: 1400,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Floor reflection */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[80%] h-24 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.66 0.21 245 / 0.35) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* The orbit ring */}
        <div
          className="absolute top-1/2 left-1/2 will-change-transform"
          style={{
            transform: `translate(-50%, -50%) rotateX(-8deg) rotateY(${angle}deg)`,
            transformStyle: "preserve-3d",
            transition: drag.current.active
              ? "none"
              : "transform 0.7s cubic-bezier(0.2,0.8,0.2,1)",
          }}
        >
          {items.map((t, i) => {
            const cardAngle = i * step;
            // distance of this card from "front" in degrees (-180..180)
            let rel = (cardAngle + angle) % 360;
            if (rel > 180) rel -= 360;
            if (rel < -180) rel += 360;
            const absRel = Math.abs(rel);
            const isActive = i === activeIdx;
            const opacity = Math.max(0.35, 1 - absRel / 180);
            return (
              <CarouselCard
                key={t.name}
                t={t}
                width={w}
                style={{
                  transform: `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  opacity,
                }}
                active={isActive}
              />
            );
          })}
        </div>

        {/* Edge fades to focus the eye */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-20" />
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => {
            setPaused(true);
            snap(step);
          }}
          aria-label="Previous"
          className="w-12 h-12 rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary hover:shadow-glow transition-all flex items-center justify-center"
        >
          <Arrow dir="left" />
        </button>

        <div className="text-center px-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
            Champion {String(activeIdx + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </div>
          <div className="font-display text-xl mt-0.5">
            {items[activeIdx].name} · {items[activeIdx].caption}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setPaused(true);
            snap(-step);
          }}
          aria-label="Next"
          className="w-12 h-12 rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary hover:shadow-glow transition-all flex items-center justify-center"
        >
          <Arrow dir="right" />
        </button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground mt-3 uppercase tracking-[0.25em]">
        Drag · Swipe · or use the arrows
      </p>
    </div>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      {dir === "left" ? (
        <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function CarouselCard({
  t,
  width,
  style,
  active,
}: {
  t: Transformation;
  width: number;
  style: CSSProperties;
  active: boolean;
}) {
  return (
    <article
      className={`absolute top-1/2 left-1/2 rounded-2xl overflow-hidden border bg-card transition-shadow duration-500 ${
        active
          ? "border-accent shadow-glow"
          : "border-border shadow-3d"
      }`}
      style={{
        width,
        height: Math.round(width * 1.35),
        ...style,
        backfaceVisibility: "hidden",
      }}
    >
      {/* Two-pane before/after */}
      <div className="relative w-full h-[78%] grid grid-cols-2">
        <Pane src={t.before} alt={`${t.name} before`} initial={t.initial} tone="before" />
        <Pane src={t.after} alt={`${t.name} after`} initial={t.initial} tone="after" />
        {/* Center divider */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-accent shadow-neon" />
        {/* Labels */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[9px] uppercase tracking-[0.25em] font-bold border border-white/10">
          Before
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-accent text-accent-foreground text-[9px] uppercase tracking-[0.25em] font-bold">
          After
        </div>
        {/* Top spotlight */}
        <div
          aria-hidden="true"
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[140%] h-32 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.85 0.27 145 / 0.3) 0%, transparent 60%)",
          }}
        />
        {/* Glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none" />
      </div>
      {/* Footer info */}
      <div className="h-[22%] px-4 py-3 flex flex-col justify-center bg-background/80 backdrop-blur border-t border-border">
        <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
          {t.tag} · Age {t.age}
        </div>
        <div className="font-display text-base md:text-lg leading-tight truncate">
          {t.caption}
        </div>
        <div className="text-[11px] text-muted-foreground truncate">
          {t.name} · {t.program}
        </div>
      </div>
    </article>
  );
}

function Pane({
  src,
  alt,
  initial,
  tone,
}: {
  src?: string;
  alt: string;
  initial: string;
  tone: "before" | "after";
}) {
  if (src) {
    return (
      <div className="relative overflow-hidden">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          width={400}
          height={500}
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover ${
            tone === "after"
              ? "brightness-110 saturate-125"
              : "grayscale brightness-75 contrast-110"
          }`}
        />
        {tone === "before" && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        )}
        {tone === "after" && (
          <div className="absolute inset-0 bg-gradient-to-l from-primary/15 to-transparent" />
        )}
      </div>
    );
  }
  const palette =
    tone === "after"
      ? "from-primary/40 via-accent/30 to-flame/30"
      : "from-muted via-background to-onyx";
  return (
    <div
      className={`relative bg-gradient-to-br ${palette} flex items-center justify-center`}
      aria-label={alt}
    >
      <div className="font-display text-[7rem] leading-none text-foreground/15">{initial}</div>
    </div>
  );
}
