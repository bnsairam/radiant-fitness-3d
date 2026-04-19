import t1 from "@/assets/trainer-1.jpg";
import t2 from "@/assets/trainer-2.jpg";
import t3 from "@/assets/trainer-3.jpg";
import t4 from "@/assets/trainer-4.jpg";

const TRAINERS = [
  {
    name: "Ramesh Kumar",
    role: "Head Coach",
    img: t1,
    years: 8,
    specs: ["Weight Loss", "Strength", "Body Recomposition"],
    bio: "Certified trainer passionate about helping members achieve real, sustainable results in a safe environment.",
  },
  {
    name: "Priya Devi",
    role: "Women's Fitness Lead",
    img: t2,
    years: 6,
    specs: ["Women's Fitness", "Postpartum", "HIIT"],
    bio: "Specialises in safe, effective programs for women — from total beginners to advanced athletes.",
  },
  {
    name: "Vignesh Anand",
    role: "Strength & Conditioning",
    img: t3,
    years: 10,
    specs: ["Powerlifting", "Muscle Gain", "Athlete Prep"],
    bio: "Decade of experience building serious muscle and strength for ambitious lifters across Chennai.",
  },
  {
    name: "Lakshmi Sundar",
    role: "Yoga & HIIT Coach",
    img: t4,
    years: 5,
    specs: ["Yoga", "HIIT", "Flexibility"],
    bio: "Brings energy, mobility and mindfulness into every class. Certified in classical and modern yoga.",
  },
];

export function Trainers({ heading = true }: { heading?: boolean }) {
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
              Certified, experienced and genuinely invested in your journey — our coaches are
              the heart of Total Fitness Studio.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRAINERS.map((t) => (
            <article
              key={t.name}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/60 transition-all hover:-translate-y-1.5 hover:shadow-electric"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={t.img}
                  alt={`Trainer ${t.name}`}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] font-bold shadow-neon">
                  {t.years}+ Years
                </div>
              </div>
              <div className="p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">
                  {t.role}
                </div>
                <div className="font-display text-2xl mb-3">{t.name}</div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.specs.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-secondary text-secondary-foreground border border-border"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
