import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Transformation } from "./TransformationCard";

/**
 * Cinematic 3D coverflow carousel.
 *
 * Design goals (no AI-tropes — feels like a high-end product showcase):
 * - True CSS perspective with cards orbiting on a circular rig
 * - Inertial pointer drag with rubber-band release & velocity flick
 * - Per-card depth response: scale, brightness, saturation, blur, opacity
 *   driven by the angular distance to the front (0° = active)
 * - Active card lifts forward (translateZ), tilts subtly, glows
 * - Mirrored "floor" reflection of the active card for depth grounding
 * - Keyboard ←/→, on-screen Prev/Next, dot indicators, wheel scroll
 * - Auto-rotates only when fully idle, pauses on any interaction
 * - Respects prefers-reduced-motion (no auto-spin, instant snaps)
 */
export function CarouselCarousel({ items }: { items: Transformation[] }) {
  const N = items.length;
  const stage = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(340);
  const [angle, setAngle] = useState(0);
  const angleRef = useRef(0);
  const velRef = useRef(0); // deg per frame
  const lastMoveTime = useRef(0);
  const lastMoveX = useRef(0);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startAngle: 0,
    moved: false,
  });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useRef(false);

  // Geometry
  const step = 360 / N;
  const radius = Math.round(w / 2 / Math.tan(Math.PI / N)) + 60;

  // Responsive card width
  useEffect(() => {
    const compute = () => {
      const sw = stage.current?.clientWidth ?? 1000;
      // Bigger on large screens, more cinematic
      setW(Math.max(240, Math.min(420, Math.floor(sw * 0.36))));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion.current = mq.matches;
    const update = () => (reduceMotion.current = mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Imperative animation loop — handles auto-rotate, inertia, snapping.
  useEffect(() => {
    let raf = 0;
    let target: number | null = null;

    const SNAP_TOLERANCE = 0.05;
    const SPRING = 0.14;
    const FRICTION = 0.94;
    const AUTO_SPEED = -0.06; // gentle clockwise drift

    const tick = () => {
      // 1) Free inertia after release
      if (Math.abs(velRef.current) > 0.01 && !dragRef.current.active) {
        angleRef.current += velRef.current;
        velRef.current *= FRICTION;
        if (Math.abs(velRef.current) < 0.05) {
          // Lock onto nearest card
          target = Math.round(angleRef.current / step) * step;
          velRef.current = 0;
        }
      }
      // 2) Spring snap toward target
      else if (target !== null && !dragRef.current.active) {
        const diff = target - angleRef.current;
        if (Math.abs(diff) < SNAP_TOLERANCE) {
          angleRef.current = target;
          target = null;
        } else {
          angleRef.current += diff * SPRING;
        }
      }
      // 3) Idle auto-rotate
      else if (
        !dragRef.current.active &&
        !paused &&
        !hovered &&
        !reduceMotion.current &&
        target === null
      ) {
        angleRef.current += AUTO_SPEED;
      }

      setAngle(angleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Expose a way to set target from outside the loop
    (trackRef as any).snapTo = (deg: number) => {
      target = deg;
    };

    return () => cancelAnimationFrame(raf);
  }, [paused, hovered, step]);

  const snapTo = (deg: number) => {
    velRef.current = 0;
    (trackRef as any).snapTo?.(deg);
  };

  const stepBy = (dir: 1 | -1) => {
    const current = Math.round(angleRef.current / step) * step;
    snapTo(current + dir * step);
  };

  // Pointer drag (mouse + touch unified)
  const onPointerDown = (e: React.PointerEvent) => {
    setPaused(true);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startAngle: angleRef.current,
      moved: false,
    };
    lastMoveTime.current = performance.now();
    lastMoveX.current = e.clientX;
    velRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 3) dragRef.current.moved = true;
    angleRef.current = dragRef.current.startAngle + dx * 0.32;
    setAngle(angleRef.current);

    // Track velocity for inertia
    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTime.current);
    const vx = e.clientX - lastMoveX.current;
    velRef.current = (vx / dt) * 16 * 0.32; // deg per frame approx
    lastMoveTime.current = now;
    lastMoveX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    // If barely moved, count as click — snap to nearest
    if (!dragRef.current.moved) {
      snapTo(Math.round(angleRef.current / step) * step);
    }
    // Otherwise inertia loop handles snap
    setTimeout(() => setPaused(false), 1500);
  };

  // Wheel: horizontal scroll rotates
  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (!delta) return;
    setPaused(true);
    angleRef.current -= delta * 0.25;
    setAngle(angleRef.current);
    velRef.current = -delta * 0.05;
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setPaused(true);
        stepBy(-1);
      } else if (e.key === "ArrowLeft") {
        setPaused(true);
        stepBy(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const activeIdx = ((Math.round(-angle / step) % N) + N) % N;
  const active = items[activeIdx];

  return (
    <div
      ref={stage}
      className="relative w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient stage glow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.66 0.21 245 / 0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Stage */}
      <div
        className="relative mx-auto select-none touch-none cursor-grab active:cursor-grabbing"
        style={{
          height: Math.round(w * 1.75),
          perspective: 1600,
          perspectiveOrigin: "50% 45%",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        role="region"
        aria-label="3D transformation carousel"
        aria-roledescription="carousel"
      >
        {/* Reflective floor */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bottom-[10%] w-[70%] h-32 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.85 0.27 145 / 0.4) 0%, oklch(0.66 0.21 245 / 0.25) 30%, transparent 70%)",
            filter: "blur(28px)",
            opacity: 0.85,
          }}
        />
        {/* Subtle grid floor (perspective) */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[120%] h-[35%] pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.85 0.27 145 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.66 0.21 245 / 1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "rotateX(70deg)",
            transformOrigin: "50% 100%",
            maskImage:
              "linear-gradient(to top, black 0%, transparent 100%)",
          }}
        />

        {/* Orbit ring */}
        <div
          ref={trackRef}
          className="absolute top-1/2 left-1/2 will-change-transform"
          style={{
            transform: `translate(-50%, -50%) rotateX(-6deg) rotateY(${angle}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((t, i) => {
            const cardAngle = i * step;
            // Angular distance from the front of the stage
            let rel = (cardAngle + angle) % 360;
            if (rel > 180) rel -= 360;
            if (rel < -180) rel += 360;
            const absRel = Math.abs(rel);

            // Depth-driven visual response (smooth easing curves)
            const t01 = Math.min(1, absRel / 90); // 0 = center, 1 = side+
            const ease = t01 * t01 * (3 - 2 * t01); // smoothstep
            const isActive = absRel < step / 2;

            const scale = 1 - ease * 0.18;
            const opacity = 1 - ease * 0.55;
            const blurPx = ease * 4;
            const brightness = 1 - ease * 0.35;
            const saturate = 1 - ease * 0.4;
            // Active card lifts forward
            const liftZ = isActive ? 60 : 0;

            return (
              <CarouselCard
                key={t.name}
                t={t}
                width={w}
                style={{
                  transform: `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px) translateZ(${liftZ}px) scale(${scale})`,
                  opacity,
                  filter: `blur(${blurPx}px) brightness(${brightness}) saturate(${saturate})`,
                  zIndex: Math.round(1000 - absRel),
                }}
                active={isActive}
              />
            );
          })}
        </div>

        {/* Soft side fades to focus the eye on the front card */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background via-background/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background via-background/80 to-transparent z-20" />
      </div>

      {/* HUD: name + caption of active card */}
      <div className="mt-2 text-center px-4 min-h-[64px]">
        <div className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
          Champion {String(activeIdx + 1).padStart(2, "0")} ·{" "}
          <span className="text-muted-foreground">
            of {String(N).padStart(2, "0")}
          </span>
        </div>
        <div className="font-display text-2xl md:text-3xl mt-1 text-glow">
          {active.name}
          <span className="text-muted-foreground font-sans text-base md:text-lg font-normal">
            {" "}
            — {active.caption}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => {
            setPaused(true);
            stepBy(1);
          }}
          aria-label="Previous champion"
          className="w-12 h-12 rounded-full border border-border bg-card/80 backdrop-blur text-foreground hover:border-primary hover:text-primary hover:shadow-glow transition-all flex items-center justify-center"
        >
          <Arrow dir="left" />
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 max-w-[60vw] overflow-hidden">
          {items.map((it, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={it.name}
                type="button"
                aria-label={`Go to champion ${i + 1}: ${it.name}`}
                onClick={() => {
                  setPaused(true);
                  snapTo(-i * step);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  isActive
                    ? "w-8 bg-accent shadow-neon"
                    : "w-1.5 bg-border hover:bg-muted-foreground"
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setPaused(true);
            stepBy(-1);
          }}
          aria-label="Next champion"
          className="w-12 h-12 rounded-full border border-border bg-card/80 backdrop-blur text-foreground hover:border-primary hover:text-primary hover:shadow-glow transition-all flex items-center justify-center"
        >
          <Arrow dir="right" />
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-[0.3em]">
        Drag · Swipe · Arrow keys · or tap a dot
      </p>
    </div>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {dir === "left" ? (
        <path
          d="M12 4l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M8 4l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
      className={`absolute top-1/2 left-1/2 rounded-2xl overflow-hidden border bg-card transition-[box-shadow,border-color] duration-500 ${
        active
          ? "border-accent shadow-glow"
          : "border-border/60 shadow-3d"
      }`}
      style={{
        width,
        height: Math.round(width * 1.4),
        ...style,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Active card sheen */}
      {active && (
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-2xl pointer-events-none opacity-70 blur-xl"
          style={{
            background:
              "conic-gradient(from 0deg, oklch(0.66 0.21 245 / 0.6), oklch(0.85 0.27 145 / 0.6), oklch(0.72 0.2 50 / 0.6), oklch(0.66 0.21 245 / 0.6))",
          }}
        />
      )}

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

        {/* Bottom caption gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <div className="font-display text-base md:text-lg leading-tight text-glow drop-shadow-lg">
            {t.caption}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="h-[22%] px-4 py-3 flex flex-col justify-center bg-background/85 backdrop-blur border-t border-border">
        <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
          {t.tag} · Age {t.age}
        </div>
        <div className="font-display text-sm md:text-base leading-tight truncate">
          {t.name}
        </div>
        <div className="text-[11px] text-muted-foreground truncate">
          {t.program}
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
      <div className="font-display text-[7rem] leading-none text-foreground/15">
        {initial}
      </div>
    </div>
  );
}
