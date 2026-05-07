import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Transformation } from "./TransformationCard";

/**
 * Cinematic 3D coverflow carousel.
 *
 * Performance model:
 *  - The rAF loop never calls setState on every frame. Instead it mutates
 *    transforms / filters directly on cached DOM refs (orbit ring + each card).
 *  - React re-renders only when the *active index* changes (HUD + active styles).
 *  - Cards are memoized so prop-stable cards skip reconciliation entirely.
 *  - Loop pauses when the carousel scrolls offscreen or the tab hides.
 *  - prefers-reduced-motion disables auto-rotate and uses instant snaps.
 */
export function CarouselCarousel({
  items,
  onExpand,
}: {
  items: Transformation[];
  onExpand?: (t: Transformation) => void;
}) {
  const N = items.length;
  const stage = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [w, setW] = useState(340);
  const [activeIdx, setActiveIdx] = useState(0);

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
  const pausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const reduceMotion = useRef(false);
  const targetRef = useRef<number | null>(null);

  // Geometry — recomputed only when w or N changes
  const step = 360 / N;
  const radius = Math.round(w / 2 / Math.tan(Math.PI / N)) + 60;
  const stepRef = useRef(step);
  const radiusRef = useRef(radius);
  stepRef.current = step;
  radiusRef.current = radius;

  // Responsive card width
  useEffect(() => {
    const compute = () => {
      const sw = stage.current?.clientWidth ?? 1000;
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

  // Pause when offscreen / tab hidden
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(el);
    const onVis = () => {
      visibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Imperative animation loop — mutates DOM directly, no per-frame React renders.
  useEffect(() => {
    let raf = 0;
    let lastActive = -1;

    const SNAP_TOLERANCE = 0.05;
    const SPRING = 0.28;
    const FRICTION = 0.9;
    const AUTO_SPEED = -0.18;

    const apply = () => {
      const angle = angleRef.current;
      const s = stepRef.current;
      const r = radiusRef.current;

      // Orbit ring
      const track = trackRef.current;
      if (track) {
        track.style.transform = `translate(-50%, -50%) rotateX(-6deg) rotateY(${angle}deg)`;
      }

      // Per-card transforms
      const cards = cardRefs.current;
      let nearestIdx = 0;
      let nearestAbs = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        if (!el) continue;
        const cardAngle = i * s;
        let rel = (cardAngle + angle) % 360;
        if (rel > 180) rel -= 360;
        if (rel < -180) rel += 360;
        const absRel = Math.abs(rel);
        if (absRel < nearestAbs) {
          nearestAbs = absRel;
          nearestIdx = i;
        }
        const t01 = absRel > 90 ? 1 : absRel / 90;
        const ease = t01 * t01 * (3 - 2 * t01);
        const isActive = absRel < s / 2;
        const scale = 1 - ease * 0.18;
        const opacity = 1 - ease * 0.55;
        const blurPx = ease * 4;
        const brightness = 1 - ease * 0.35;
        const saturate = 1 - ease * 0.4;
        const liftZ = isActive ? 60 : 0;
        el.style.transform = `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${r}px) translateZ(${liftZ}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.filter = `blur(${blurPx}px) brightness(${brightness}) saturate(${saturate})`;
        el.style.zIndex = String(Math.round(1000 - absRel));
      }

      if (nearestIdx !== lastActive) {
        lastActive = nearestIdx;
        setActiveIdx(nearestIdx);
      }
    };

    const tick = () => {
      const s = stepRef.current;
      // 1) Free inertia after release
      if (Math.abs(velRef.current) > 0.01 && !dragRef.current.active) {
        angleRef.current += velRef.current;
        velRef.current *= FRICTION;
        if (Math.abs(velRef.current) < 0.05) {
          targetRef.current = Math.round(angleRef.current / s) * s;
          velRef.current = 0;
        }
      }
      // 2) Spring snap
      else if (targetRef.current !== null && !dragRef.current.active) {
        const diff = targetRef.current - angleRef.current;
        if (Math.abs(diff) < SNAP_TOLERANCE) {
          angleRef.current = targetRef.current;
          targetRef.current = null;
        } else {
          angleRef.current += diff * SPRING;
        }
      }
      // 3) Idle auto-rotate
      else if (
        !dragRef.current.active &&
        !pausedRef.current &&
        !hoveredRef.current &&
        !reduceMotion.current &&
        visibleRef.current &&
        targetRef.current === null
      ) {
        angleRef.current += AUTO_SPEED;
      }

      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [N]);

  const snapTo = (deg: number) => {
    velRef.current = 0;
    targetRef.current = deg;
  };

  const stepBy = (dir: 1 | -1) => {
    const current = Math.round(angleRef.current / step) * step;
    snapTo(current + dir * step);
  };

  // Pointer drag
  const onPointerDown = (e: React.PointerEvent) => {
    pausedRef.current = true;
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
    angleRef.current = dragRef.current.startAngle + dx * 0.55;
    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTime.current);
    const vx = e.clientX - lastMoveX.current;
    velRef.current = (vx / dt) * 16 * 0.55;
    lastMoveTime.current = now;
    lastMoveX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    if (!dragRef.current.moved) {
      snapTo(Math.round(angleRef.current / step) * step);
    }
    setTimeout(() => {
      pausedRef.current = false;
    }, 600);
  };

  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (!delta) return;
    pausedRef.current = true;
    angleRef.current -= delta * 0.25;
    velRef.current = -delta * 0.05;
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        pausedRef.current = true;
        stepBy(-1);
      } else if (e.key === "ArrowLeft") {
        pausedRef.current = true;
        stepBy(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const active = items[activeIdx];

  return (
    <div
      ref={stage}
      className="relative w-full"
      onMouseEnter={() => (hoveredRef.current = true)}
      onMouseLeave={() => (hoveredRef.current = false)}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.66 0.21 245 / 0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

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
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[120%] h-[35%] pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.85 0.27 145 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.66 0.21 245 / 1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "rotateX(70deg)",
            transformOrigin: "50% 100%",
            maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          }}
        />

        <div
          ref={trackRef}
          className="absolute top-1/2 left-1/2 will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((t, i) => (
            <CarouselCard
              key={t.name}
              t={t}
              width={w}
              active={i === activeIdx}
              onExpand={onExpand}
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background via-background/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background via-background/80 to-transparent z-20" />
      </div>

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

      <div className="mt-4 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => {
            pausedRef.current = true;
            stepBy(1);
          }}
          aria-label="Previous champion"
          className="w-12 h-12 rounded-full border border-border bg-card/80 backdrop-blur text-foreground hover:border-primary hover:text-primary hover:shadow-glow transition-all flex items-center justify-center"
        >
          <Arrow dir="left" />
        </button>

        <div className="flex items-center gap-1.5 max-w-[60vw] overflow-hidden">
          {items.map((it, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={it.name}
                type="button"
                aria-label={`Go to champion ${i + 1}: ${it.name}`}
                onClick={() => {
                  pausedRef.current = true;
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
            pausedRef.current = true;
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

const CarouselCard = memo(function CarouselCard({
  t,
  width,
  active,
  onExpand,
  cardRef,
}: {
  t: Transformation;
  width: number;
  active: boolean;
  onExpand?: (t: Transformation) => void;
  cardRef: (el: HTMLElement | null) => void;
}) {
  const style: CSSProperties = {
    width,
    height: Math.round(width * 1.4),
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    willChange: "transform, opacity, filter",
    contain: "layout paint",
  };
  return (
    <article
      ref={cardRef as React.Ref<HTMLElement>}
      className={`absolute top-1/2 left-1/2 rounded-2xl overflow-hidden border bg-card transition-[box-shadow,border-color] duration-500 ${
        active ? "border-accent shadow-glow" : "border-border/60 shadow-3d"
      }`}
      style={style}
    >
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

        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-accent shadow-neon" />

        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[9px] uppercase tracking-[0.25em] font-bold border border-white/10">
          Before
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-accent text-accent-foreground text-[9px] uppercase tracking-[0.25em] font-bold">
          After
        </div>

        {active && onExpand && (
          <button
            type="button"
            aria-label={`Open fullscreen view of ${t.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onExpand(t);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-background/85 backdrop-blur border border-accent/50 hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all flex items-center justify-center z-30 shadow-glow"
            data-cursor-label="Open"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8V3H8M17 8V3H12M3 12V17H8M17 12V17H12" />
            </svg>
          </button>
        )}

        <div
          aria-hidden="true"
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[140%] h-32 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.85 0.27 145 / 0.3) 0%, transparent 60%)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <div className="font-display text-base md:text-lg leading-tight text-glow drop-shadow-lg">
            {t.caption}
          </div>
        </div>
      </div>

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
});

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
