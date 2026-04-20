import { useEffect, useRef, useState } from "react";

/**
 * Luxury magnetic cursor.
 * - A soft outer ring lags behind the pointer with spring easing.
 * - A small inner dot tracks instantly.
 * - Over interactive elements (buttons, links, images, [data-cursor="hover"]),
 *   the ring scales up, brightens, and shows a subtle label when provided
 *   via data-cursor-label="View".
 * - Hidden on touch / coarse-pointer devices automatically.
 */
export function MagneticCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-magnetic-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: target.x, y: target.y };
    let raf = 0;

    const tick = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const HOVER_SELECTOR =
      'a, button, [role="button"], input, textarea, select, label, img, [data-cursor="hover"]';

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest(HOVER_SELECTOR) as HTMLElement | null;
      if (el) {
        setHovering(true);
        setLabel(el.getAttribute("data-cursor-label"));
      }
    };
    const onOut = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest(HOVER_SELECTOR);
      if (el) {
        setHovering(false);
        setLabel(null);
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeaveWindow = () => {
      if (ring.current) ring.current.style.opacity = "0";
      if (dot.current) dot.current.style.opacity = "0";
    };
    const onEnterWindow = () => {
      if (ring.current) ring.current.style.opacity = "1";
      if (dot.current) dot.current.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      document.documentElement.classList.remove("has-magnetic-cursor");
    };
  }, []);

  if (!enabled) return null;

  const ringScale = pressed ? 0.7 : hovering ? 2.4 : 1;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] w-10 h-10 rounded-full border border-primary/70 backdrop-blur-[2px] mix-blend-screen transition-[width,height,border-color,background-color,box-shadow] duration-300 ease-out"
        style={{
          transform: "translate3d(-100px,-100px,0)",
          scale: String(ringScale),
          backgroundColor: hovering
            ? "oklch(0.66 0.21 245 / 0.18)"
            : "transparent",
          borderColor: hovering
            ? "oklch(0.85 0.27 145 / 0.95)"
            : "oklch(0.66 0.21 245 / 0.7)",
          boxShadow: hovering
            ? "0 0 30px oklch(0.85 0.27 145 / 0.55), inset 0 0 20px oklch(0.66 0.21 245 / 0.3)"
            : "0 0 20px oklch(0.66 0.21 245 / 0.4)",
        }}
      >
        {label && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.25em] font-bold text-accent-foreground bg-accent px-2 py-0.5 rounded-full whitespace-nowrap shadow-neon">
            {label}
          </span>
        )}
      </div>

      {/* Inner dot */}
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-1.5 h-1.5 rounded-full bg-accent mix-blend-screen transition-opacity"
        style={{
          transform: "translate3d(-100px,-100px,0)",
          boxShadow: "0 0 12px oklch(0.85 0.27 145 / 0.95)",
        }}
      />
    </>
  );
}
