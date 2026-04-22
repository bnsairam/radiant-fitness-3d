import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-scroll-reveal";

/** Wraps a section so its contents fade-up as it enters the viewport. */
export function SectionReveal({
  children,
  className = "",
  threshold = 0.12,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
  as?: "div" | "section";
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>(threshold);
  return (
    <As
      ref={ref as never}
      className={`reveal ${revealed ? "is-revealed" : ""} ${className}`}
    >
      {children}
    </As>
  );
}
