import m1 from "@/assets/member-1.jpg";
import m2 from "@/assets/member-2.jpg";
import m3 from "@/assets/member-3.jpg";
import m4 from "@/assets/member-4.jpg";
import m5 from "@/assets/member-5.jpg";

const REVIEWS = [
  {
    img: m1,
    name: "Priya S.",
    place: "Hasthinapuram",
    text: "I lost 18kg in 5 months. The environment is very safe and motivating — best gym in Chromepet for women!",
    stars: 5,
  },
  {
    img: m2,
    name: "Arun M.",
    place: "Chromepet",
    text: "Coaches genuinely care. Lost 22kg, gained real strength and built habits that stuck. Worth every rupee.",
    stars: 5,
  },
  {
    img: m3,
    name: "Lakshmi V.",
    place: "Hasthinapuram",
    text: "After my second baby I thought I'd never feel fit again. The women's program here changed everything.",
    stars: 5,
  },
  {
    img: m4,
    name: "Vignesh T.",
    place: "Pallavaram",
    text: "Spacious 3rd-floor studio, premium equipment, never overcrowded. Got my first 6-pack here at 27.",
    stars: 5,
  },
  {
    img: m5,
    name: "Hari P.",
    place: "Chromepet",
    text: "I'm 45 and in the best shape of my life. The trainers actually understand older bodies. Highly recommended.",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-28 bg-card/30 border-y border-border">
      <div className="container mx-auto px-5">
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-px bg-flame" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-flame font-semibold">
              What Our Members Say
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95]">
            Real reviews from{" "}
            <span className="text-primary text-glow">real Chromepet members</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <article
              key={r.name}
              className="relative rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-all hover:-translate-y-1 group overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              <div className="relative">
                <div className="flex items-center gap-1 text-accent mb-4">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.9L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-6 italic">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img
                    src={r.img}
                    alt={r.name}
                    loading="lazy"
                    width={64}
                    height={64}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/40"
                  />
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {r.place}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
