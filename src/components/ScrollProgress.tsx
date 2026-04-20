import { useEffect, useState } from "react";

/** Slim animated scroll-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-flame shadow-glow transition-[width] duration-150 ease-out"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}
