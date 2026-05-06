import { useRef, useState, type CSSProperties } from "react";
import { useInView } from "@/hooks/use-reveal";
import { whatsappLinkWithTags } from "@/lib/whatsapp";
import { shareTransformation } from "@/lib/share";
import { toast } from "sonner";

export type Transformation = {
  name: string;
  initial: string;
  before?: string; // optional — falls back to placeholder
  after?: string;
  caption: string; // big stat: "22kg lost in 6 months"
  detail: string;  // smaller line: "From 89kg to 67kg"
  program: string;
  tag: "Men" | "Women" | "Weight Loss" | "Muscle Gain";
  age: number;
};

/**
 * Premium 3D before/after card. Designed so the user can later swap in their
 * own real photos by setting `before`/`after`. When images are missing we render
 * an elegant gradient placeholder with the member's initial — never broken.
 */
export function TransformationCard({
  t,
  index,
  onExpand,
}: {
  t: Transformation;
  index: number;
  onExpand?: (t: Transformation) => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.18);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState(50); // before/after slider %
  const dragging = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (py - 0.5) * -6, y: (px - 0.5) * 8 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  const updatePos = (clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  const revealStyle: CSSProperties = {
    transition: "opacity 1s ease-out, transform 1.1s cubic-bezier(0.2,0.8,0.2,1)",
    transitionDelay: `${(index % 6) * 80}ms`,
    opacity: inView ? 1 : 0,
    transform: inView
      ? "translateY(0) rotateX(0) scale(1)"
      : "translateY(50px) rotateX(10deg) scale(0.95)",
  };

  return (
    <div ref={ref} style={revealStyle} className="perspective-1000">
      <article
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative preserve-3d transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft floor shadow */}
        <div className="absolute -bottom-8 left-6 right-6 h-10 bg-black/80 blur-2xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />

        {/* Outer electric glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-electric opacity-40 blur-md group-hover:opacity-90 transition-opacity duration-500" />
        {/* Conic halo on hover */}
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, oklch(0.66 0.21 245 / 0.55), oklch(0.85 0.27 145 / 0.55), oklch(0.72 0.2 50 / 0.55), oklch(0.66 0.21 245 / 0.55))",
          }}
        />

        {/* Metallic edge frame */}
        <div
          className="relative rounded-2xl p-[2px] bg-gradient-to-br from-primary via-accent to-flame shadow-3d"
          style={{ transform: "translateZ(15px)" }}
        >
          <div className="relative rounded-[14px] overflow-hidden bg-card">
            {/* SLIDER */}
            <div
              ref={sliderRef}
              className="relative aspect-[4/5] overflow-hidden cursor-ew-resize select-none"
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
              {/* AFTER (base layer) */}
              <ImageOrPlaceholder
                src={t.after}
                alt={`${t.name} after transformation`}
                initial={t.initial}
                tone="after"
              />

              {/* BEFORE (clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              >
                <ImageOrPlaceholder
                  src={t.before}
                  alt={`${t.name} before transformation`}
                  initial={t.initial}
                  tone="before"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              </div>

              {/* Spotlight + neon fog */}
              <div
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-[140%] h-44 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, oklch(0.85 0.27 145 / 0.35) 0%, transparent 60%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />

              {/* Slider line + glowing handle */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-accent pointer-events-none"
                style={{ left: `${pos}%`, boxShadow: "0 0 24px oklch(0.85 0.27 145 / 0.9)" }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-electric border-[3px] border-background shadow-glow flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M7 5L2 10L7 15M13 5L18 10L13 15" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur text-[10px] uppercase tracking-[0.25em] font-bold border border-white/10">
                Before
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] font-bold shadow-neon">
                After
              </div>

              {/* Expand to lightbox */}
              {onExpand && (
                <button
                  type="button"
                  aria-label={`Open fullscreen view of ${t.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand(t);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="absolute top-14 right-3 w-9 h-9 rounded-full bg-background/85 backdrop-blur border border-border hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all flex items-center justify-center z-20"
                  data-cursor-label="Open"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8V3H8M17 8V3H12M3 12V17H8M17 12V17H12" />
                  </svg>
                </button>
              )}

              {/* Caption pill */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-block px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-primary/40 text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-2">
                  {t.tag} · Age {t.age}
                </div>
                <div className="font-display text-2xl md:text-3xl leading-tight text-glow drop-shadow-lg">
                  {t.caption}
                </div>
                <div className="text-sm text-foreground/85 mt-1">{t.detail}</div>
              </div>
            </div>

            {/* Footer strip */}
            <div className="px-5 py-4 flex items-center justify-between gap-3 border-t border-border bg-background/60 backdrop-blur">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-electric flex items-center justify-center font-display text-base shadow-glow shrink-0">
                  {t.initial}
                </div>
                <div className="leading-tight min-w-0">
                  <div className="font-display text-base truncate">{t.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground truncate">
                    {t.program}
                  </div>
                </div>
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold shrink-0">
                Verified ✓
              </div>
            </div>

            {/* CTA row: WhatsApp inquiry + Share */}
            <div className="flex items-stretch border-t border-border/60">
              <a
                href={whatsappLinkWithTags(
                  `Hi Total Fitness Studio! 👋 I saw ${t.name}'s transformation (${t.caption}) on your website and I'm interested in the *${t.program}* program. Could you share details, pricing & next batch availability?`,
                  {
                    source: "transformation_card",
                    campaign: "hall_of_champions",
                    program: t.program,
                    member: t.name,
                    extra: { tag: t.tag, age: String(t.age) },
                  },
                )}
                target="_blank"
                rel="noopener"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="group/cta relative flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-flame text-white font-bold uppercase tracking-[0.18em] text-[11px] hover:shadow-flame transition-all overflow-hidden"
                data-cursor-label="WhatsApp"
              >
                <span aria-hidden className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative">
                  <path d="M19.05 4.91A10 10 0 0 0 3.1 17.7L2 22l4.4-1.15a10 10 0 0 0 4.79 1.22A10 10 0 0 0 19.05 4.9zM12.2 20.3a8.31 8.31 0 0 1-4.24-1.16l-.3-.18-2.6.68.7-2.54-.2-.32a8.32 8.32 0 1 1 6.64 3.52z" />
                </svg>
                <span className="relative truncate">Inquire about {t.program}</span>
              </a>
              <ShareButton t={t} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function ImageOrPlaceholder({
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
        loading="lazy"
        width={800}
        height={1000}
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover ${
          tone === "after"
            ? "brightness-110 saturate-125"
            : "grayscale brightness-75 contrast-110"
        }`}
      />
    );
  }
  // Premium gradient placeholder so the page never looks broken before
  // the studio uploads their real photos.
  const palette =
    tone === "after"
      ? "from-primary/40 via-accent/30 to-flame/30"
      : "from-muted via-background to-onyx";
  return (
    <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${palette} flex items-center justify-center`} aria-label={alt}>
      <div
        className={`font-display text-[12rem] leading-none ${
          tone === "after" ? "text-foreground/15" : "text-foreground/8"
        }`}
      >
        {initial}
      </div>
      <div className="absolute bottom-3 inset-x-0 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Photo coming soon
      </div>
    </div>
  );
}

function ShareButton({ t }: { t: Transformation }) {
  const [busy, setBusy] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const channel = await shareTransformation({
        name: t.name,
        caption: t.caption,
        detail: t.detail,
        program: t.program,
        tag: t.tag,
        initial: t.initial,
        imageSrc: t.after ?? t.before,
      });
      if (channel === "native") toast.success("Shared!");
      else if (channel === "clipboard")
        toast.success("Link copied & share image downloaded", {
          description: "Paste anywhere — image saved to your downloads.",
        });
      else if (channel === "download")
        toast.success("Share image downloaded", {
          description: "Attach it to your post.",
        });
      else toast.error("Couldn't share — try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      disabled={busy}
      aria-label={`Share ${t.name}'s transformation`}
      title="Share this transformation"
      className="relative px-4 bg-card hover:bg-accent hover:text-accent-foreground border-l border-border/60 transition-colors flex items-center justify-center disabled:opacity-60"
      data-cursor-label="Share"
    >
      {busy ? (
        <svg className="animate-spin" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M10 2a8 8 0 1 1-8 8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
          <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
        </svg>
      )}
    </button>
  );
}

