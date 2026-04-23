import { useEffect, useRef, useState } from "react";

/**
 * Adds the `is-revealed` class when the element scrolls into view.
 * Pair with the `.reveal` utility in styles.css for the slide-up + fade-in.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.18,
) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(true);
      return;
    }

    // If the element is already in/near the viewport on mount (e.g. above the
    // fold on first paint, or after a fast scroll-restore), reveal immediately
    // so the user never sees an empty placeholder.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 0;
    if (rect.top < vh * 0.9) {
      setRevealed(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -5% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
