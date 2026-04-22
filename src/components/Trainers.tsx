import t1 from "@/assets/trainer-1.jpg";
import t2 from "@/assets/trainer-2.jpg";
import t3 from "@/assets/trainer-3.jpg";
import t4 from "@/assets/trainer-4.jpg";
import { useReveal } from "@/hooks/use-scroll-reveal";
import { whatsappLink } from "@/lib/whatsapp";

const TRAINERS = [
  {
    name: "Ramesh Kumar",
    role: "Head Coach",
    img: t1,
    years: 8,
    specs: ["Weight Loss", "Strength", "Body Recomp"],
    bio: "Certified trainer passionate about helping members achieve real, sustainable results in a safe environment.",
    motto: "No shortcuts. Just reps.",
  },
  {
    name: "Priya Devi",
    role: "Women's Fitness Lead",
    img: t2,
    years: 6,
    specs: ["Women's Fitness", "Postpartum", "HIIT"],
    bio: "Specialises in safe, effective programs for women — from total beginners to advanced athletes.",
    motto: "Strong is the new graceful.",
  },
  {
    name: "Vignesh Anand",
    role: "Strength & Conditioning",
    img: t3,
    years: 10,
    specs: ["Powerlifting", "Muscle Gain", "Athlete Prep"],
    bio: "Decade of experience building serious muscle and strength for ambitious lifters across Chennai.",
    motto: "Train heavy. Live limitless.",
  },
  {
    name: "Lakshmi Sundar",
    role: "Yoga & HIIT Coach",
    img: t4,
    years: 5,
    specs: ["Yoga", "HIIT", "Flexibility"],
    bio: "Brings energy, mobility and mindfulness into every class. Certified in classical and modern yoga.",
    motto: "Breathe deep. Move bold.",
  },
];

export function Trainers({ heading = true }: { heading?: boolean }) {
  const { ref, revealed } = useReveal<HTMLDivElement>(0.15);

  return (
    <section id="trainers" className="relative py-24 md:py-28">
      <div className="container mx-auto px-5">
        {heading && (
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-px bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-accent font-semibold">
                Meet The Coaches
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95]">
              Coaches obsessed with{" "}
              <span className="text-primary text-glow">your progress</span>
            </h2>
            <p className="text-muted-foreground mt-5 text-base md:text-lg leading-relaxed">
              Hover any card to flip it — see the bio, specialties and book direct on WhatsApp.
            </p>
          </div>
        )}

        <div
          ref={ref}
          className={`reveal reveal-stagger ${revealed ? "is-revealed" : ""} grid sm:grid-cols-2 lg:grid-cols-4 gap-6`}
        >
          {TRAINERS.map((t, i) => (
            <article
              key={t.name}
              tabIndex={0}
              style={{ ["--i" as never]: i }}
              className="flip-card group relative rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <div className="relative aspect-[3/4] flip-inner rounded-2xl">
                {/* FRONT */}
                <div className="flip-face rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
                    <img
                      src={t.img}
                      alt={`Trainer ${t.name}`}
                      loading="lazy"
                      width={768}
                      height={1024}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] font-bold shadow-neon">
                      {t.years}+ yrs
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-background/80 backdrop-blur text-[9px] uppercase tracking-[0.25em] text-muted-foreground border border-border">
                      Hover ↻
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-5">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">
                        {t.role}
                      </div>
                      <div className="font-display text-2xl md:text-3xl leading-tight">
                        {t.name}
                      </div>
                      <div className="mt-2 text-xs italic text-accent">
                        “{t.motto}”
                      </div>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className="flip-face flip-back rounded-2xl overflow-hidden border border-primary/50 bg-gradient-electric text-primary-foreground p-5 flex flex-col">
                    <div className="text-[10px] uppercase tracking-[0.3em] opacity-90 mb-1">
                      {t.role}
                    </div>
                    <div className="font-display text-2xl mb-3">{t.name}</div>
                    <p className="text-sm leading-relaxed mb-4 opacity-95">{t.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {t.specs.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-background/25 backdrop-blur border border-background/30"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <a
                      href={whatsappLink(
                        `Hi! I'd like to book a session with Coach ${t.name} (${t.role}) at Total Fitness Studio.`,
                      )}
                      target="_blank"
                      rel="noopener"
                      className="mt-auto inline-flex items-center justify-center gap-2 bg-background text-foreground px-4 py-2.5 rounded-md font-bold tracking-wider uppercase text-xs hover:shadow-glow transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M19.05 4.91A10 10 0 0 0 3.1 17.7L2 22l4.4-1.15a10 10 0 0 0 4.79 1.22A10 10 0 0 0 19.05 4.9zM12.2 20.3a8.31 8.31 0 0 1-4.24-1.16l-.3-.18-2.6.68.7-2.54-.2-.32a8.32 8.32 0 1 1 6.64 3.52z" />
                      </svg>
                    </a>
                  </div>
                </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
