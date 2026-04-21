import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Transformation } from "./TransformationCard";
import { useCountUp } from "@/hooks/use-reveal";

/**
 * Fullscreen cinematic lightbox for a Transformation. Features:
 * - Giant draggable before/after slider (mouse + touch + keyboard)
 * - Animated kg / months counters parsed from the caption
 * - Backdrop blur, glow halo, and entrance animation
 * - Closes on ESC, backdrop click, or close button
 * - Locks body scroll while open
 */
export function TransformationLightbox({
  t,
  onClose,
  items,
  onNavigate,
}: {
  t: Transformation | null;
  onClose: () => void;
  /** Optional list to enable prev/next navigation inside the lightbox. */
  items?: Transformation[];
  onNavigate?: (next: Transformation) => void;
}) {
  const [pos, setPos] = useState(100);
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [contentKey, setContentKey] = useState(0); // re-trigger counters on nav
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const userInteracted = useRef(false);

  // Mount portal target only on client
  useEffect(() => setMounted(true), []);

  // Index lookup for prev/next
  const index = t && items ? items.findIndex((x) => x.name === t.name) : -1;
  const canNav = !!items && items.length > 1 && index >= 0;
  const goTo = (delta: number) => {
    if (!canNav || !items) return;
    const next = items[(index + delta + items.length) % items.length];
    setContentKey((k) => k + 1);
    onNavigate?.(next);
  };

  // Animate in + cinematic auto-reveal sweep (100% → 50%) on open / nav
  useEffect(() => {
    if (!t) {
      setShow(false);
      return;
    }
    userInteracted.current = false;
    setPos(100); // start fully on "before"
    requestAnimationFrame(() => setShow(true));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPos(50);
      return;
    }

    // Animate the slider from 100 → 50 with easeInOutCubic over ~1s
    const duration = 1100;
    const startDelay = 220; // wait for entrance to settle
    const start = performance.now() + startDelay;
    let raf = 0;
    const tick = (now: number) => {
      if (userInteracted.current) return; // user took over — stop the sweep
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, elapsed / duration);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setPos(100 - eased * 50); // 100 → 50
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [t, contentKey]);

  // ESC + arrows + body scroll lock
  useEffect(() => {
    if (!t) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        if (e.shiftKey && canNav) goTo(-1);
        else {
          userInteracted.current = true;
          setPos((p) => Math.max(0, p - 4));
        }
      }
      if (e.key === "ArrowRight") {
        if (e.shiftKey && canNav) goTo(1);
        else {
          userInteracted.current = true;
          setPos((p) => Math.min(100, p + 4));
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, onClose, canNav, index]);

  const stats = parseStats(t?.caption ?? "", t?.detail ?? "");

  // Counters animate every time a new transformation opens
  const kg = useCountUp(stats.kg ?? 0, !!t && show, 1400);
  const months = useCountUp(stats.months ?? 0, !!t && show, 1200);
  const muscle = useCountUp(stats.muscleKg ?? 0, !!t && show, 1400);

  const updatePos = (clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 220);
  };

  if (!mounted || !t) return null;

  const tone = t.tag;

  const node = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${t.name} transformation`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8"
      style={{
        background: show
          ? "color-mix(in oklab, oklch(0.08 0.02 250) 92%, transparent)"
          : "transparent",
        backdropFilter: show ? "blur(18px)" : "blur(0px)",
        transition: "background 240ms ease, backdrop-filter 240ms ease",
      }}
      onClick={handleClose}
    >
      {/* Glow halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.66 0.21 245 / 0.18), transparent 70%)",
          opacity: show ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
      />

      <div
        className="relative w-full max-w-7xl max-h-[94vh] grid lg:grid-cols-[1.4fr_0.9fr] gap-0 rounded-2xl overflow-hidden border border-border bg-card shadow-3d"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "scale(1) translateY(0)" : "scale(0.94) translateY(20px)",
          transition: "opacity 280ms ease, transform 320ms cubic-bezier(0.2,0.8,0.2,1)",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-30 w-11 h-11 rounded-full bg-background/80 backdrop-blur border border-border hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M5 5L15 15M15 5L5 15" />
          </svg>
        </button>

        {/* GIANT SLIDER */}
        <div
          ref={sliderRef}
          className="relative bg-onyx aspect-[4/5] lg:aspect-auto lg:min-h-[640px] cursor-ew-resize select-none overflow-hidden"
          onMouseDown={(e) => {
            dragging.current = true;
            updatePos(e.clientX);
          }}
          onMouseMove={(e) => dragging.current && updatePos(e.clientX)}
          onMouseUp={() => (dragging.current = false)}
          onMouseLeave={() => (dragging.current = false)}
          onTouchStart={(e) => updatePos(e.touches[0].clientX)}
          onTouchMove={(e) => updatePos(e.touches[0].clientX)}
        >
          <BigImage src={t.after} alt={`${t.name} after`} initial={t.initial} tone="after" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <BigImage src={t.before} alt={`${t.name} before`} initial={t.initial} tone="before" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          </div>

          {/* Spotlight */}
          <div
            aria-hidden="true"
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] h-56 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.85 0.27 145 / 0.28) 0%, transparent 60%)",
            }}
          />

          {/* Slider line + handle */}
          <div
            className="absolute top-0 bottom-0 w-[3px] bg-accent pointer-events-none"
            style={{ left: `${pos}%`, boxShadow: "0 0 32px oklch(0.85 0.27 145 / 0.95)" }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-electric border-[3px] border-background shadow-glow flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path d="M7 5L2 10L7 15M13 5L18 10L13 15" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded bg-black/80 backdrop-blur text-[11px] uppercase tracking-[0.3em] font-bold border border-white/10">
            Before
          </div>
          <div className="absolute top-4 right-16 px-3 py-1.5 rounded bg-accent text-accent-foreground text-[11px] uppercase tracking-[0.3em] font-bold shadow-neon">
            After
          </div>

          {/* Drag hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-border text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Drag · ← → keys
          </div>
        </div>

        {/* INFO PANEL */}
        <div className="relative p-6 md:p-8 lg:p-10 flex flex-col gap-6 overflow-y-auto bg-gradient-to-br from-background via-card to-background">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-4">
              {tone} · Age {t.age}
            </div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-full bg-gradient-electric flex items-center justify-center font-display text-lg shadow-glow">
                {t.initial}
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl leading-tight">{t.name}</h3>
                <div className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
                  {t.program}
                </div>
              </div>
            </div>
          </div>

          {/* Counter grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {stats.kg !== null && (
              <Stat value={kg} unit="kg" label={tone === "Muscle Gain" ? "Body Recomp" : "Lost"} accent />
            )}
            {stats.muscleKg !== null && (
              <Stat value={muscle} unit="kg" label="Lean Muscle Gained" accent />
            )}
            {stats.months !== null && (
              <Stat value={months} unit="mo" label="Total Time" />
            )}
            <Stat value={t.age} unit="yrs" label="Age" />
          </div>

          {/* Caption */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
              The Story
            </div>
            <p className="font-display text-2xl md:text-3xl leading-tight text-glow">
              {t.caption}
            </p>
            <p className="text-base text-muted-foreground mt-3 leading-relaxed">
              {t.detail}
            </p>
          </div>

          {/* Verified strip */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0L12.5 5.5L18 6L13.5 10L15 16L10 13L5 16L6.5 10L2 6L7.5 5.5z" />
              </svg>
              Verified Member
            </div>
            <a
              href="/contact"
              className="px-4 py-2 rounded-full bg-gradient-electric text-foreground text-[10px] uppercase tracking-[0.3em] font-bold shadow-glow hover:scale-105 transition-transform"
            >
              Start Yours →
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

function Stat({
  value,
  unit,
  label,
  accent = false,
}: {
  value: number;
  unit: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl p-4 border ${
        accent
          ? "border-accent/40 bg-accent/5"
          : "border-border bg-card/60"
      } backdrop-blur overflow-hidden`}
    >
      {accent && (
        <div className="absolute -inset-px rounded-xl bg-gradient-electric opacity-20 pointer-events-none" />
      )}
      <div className="relative">
        <div className="font-display text-3xl md:text-4xl leading-none">
          {value}
          <span className="text-base text-muted-foreground ml-1">{unit}</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2 font-bold">
          {label}
        </div>
      </div>
    </div>
  );
}

function BigImage({
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
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover ${
          tone === "after"
            ? "brightness-110 saturate-125"
            : "grayscale brightness-75 contrast-110"
        }`}
      />
    );
  }
  const palette =
    tone === "after"
      ? "from-primary/40 via-accent/30 to-flame/30"
      : "from-muted via-background to-onyx";
  return (
    <div
      className={`absolute inset-0 w-full h-full bg-gradient-to-br ${palette} flex items-center justify-center`}
      aria-label={alt}
    >
      <div
        className={`font-display text-[20rem] leading-none ${
          tone === "after" ? "text-foreground/15" : "text-foreground/8"
        }`}
      >
        {initial}
      </div>
    </div>
  );
}

/**
 * Parse "22kg lost in 6 months" / "+12kg lean" / "From 89kg to 67kg" type strings.
 */
function parseStats(caption: string, detail: string) {
  const text = `${caption} ${detail}`.toLowerCase();

  // months
  const monthMatch = text.match(/(\d+)\s*(?:month|mo|mos)/);
  const dayMatch = text.match(/(\d+)\s*day/);
  const months = monthMatch
    ? parseInt(monthMatch[1], 10)
    : dayMatch
      ? Math.max(1, Math.round(parseInt(dayMatch[1], 10) / 30))
      : null;

  // kg lost (e.g., "22kg lost", "lost 18kg", "down 25kg", "From 89kg to 67kg")
  let kg: number | null = null;
  const fromTo = text.match(/from\s+(\d+)\s*kg\s+to\s+(\d+)\s*kg/);
  if (fromTo) {
    kg = Math.abs(parseInt(fromTo[1], 10) - parseInt(fromTo[2], 10));
  } else {
    const lostMatch = text.match(/(\d+)\s*kg(?:\s+(?:lost|down|loss|lighter))/);
    const downMatch = text.match(/(?:lost|down)\s*(\d+)\s*kg/);
    if (lostMatch) kg = parseInt(lostMatch[1], 10);
    else if (downMatch) kg = parseInt(downMatch[1], 10);
  }

  // muscle gained (e.g., "+12kg lean", "+8kg muscle", "+9kg lean mass")
  let muscleKg: number | null = null;
  const gainMatch = text.match(/\+\s*(\d+)\s*kg/);
  if (gainMatch) muscleKg = parseInt(gainMatch[1], 10);

  // Avoid showing both if only one stat was found in caption ambiguously
  if (kg !== null && muscleKg !== null && kg === muscleKg) muscleKg = null;

  return { kg, months, muscleKg };
}
