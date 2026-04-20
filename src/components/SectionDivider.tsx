/** Cinematic divider — animated gradient line + side glow dots. */
export function SectionDivider() {
  return (
    <div aria-hidden className="relative h-24 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="relative flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow animate-[pulse-glow_2.4s_ease-in-out_infinite]" />
        <span className="w-2 h-2 rounded-full bg-accent shadow-neon" />
        <span className="w-1.5 h-1.5 rounded-full bg-flame shadow-flame animate-[pulse-glow_2.4s_ease-in-out_infinite_0.6s]" />
      </div>
    </div>
  );
}
