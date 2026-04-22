import { Link } from "@tanstack/react-router";

const PLANS = [
  {
    name: "Free Trial",
    price: "₹0",
    per: "1 day",
    cta: "Claim Trial",
    features: ["Full studio access", "1 group class", "Tour with a coach"],
    featured: false,
  },
  {
    name: "Monthly",
    price: "₹2,499",
    per: "/ month",
    cta: "Start Monthly",
    features: ["Unlimited gym", "All group classes", "Locker access"],
    featured: false,
  },
  {
    name: "3 Months",
    price: "₹6,499",
    per: "/ quarter",
    cta: "Get 3 Months",
    features: ["Save ₹999", "Free fitness assessment", "Diet starter plan"],
    featured: false,
  },
  {
    name: "6 Months",
    price: "₹10,999",
    per: "/ half year",
    cta: "Most Popular",
    features: [
      "Save ₹3,995",
      "2 PT sessions FREE",
      "Custom diet plan",
      "Body composition tracking",
    ],
    featured: true,
  },
  {
    name: "Annual",
    price: "₹17,999",
    per: "/ year",
    cta: "Best Value",
    features: [
      "Save ₹11,989",
      "5 PT sessions FREE",
      "Premium diet & macro plan",
      "Quarterly DEXA-style review",
      "Priority booking",
    ],
    featured: false,
  },
];

export function Pricing({ heading = true }: { heading?: boolean }) {
  return (
    <section id="pricing" className="relative py-24 md:py-28">
      <div className="container mx-auto px-5">
        {heading && (
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-px bg-flame" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-flame font-semibold">
                Membership Plans
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95]">
              Choose your <span className="text-primary text-glow">commitment</span>.
              <br />
              We handle the <span className="text-accent">results</span>.
            </h2>
            <p className="text-muted-foreground mt-5 text-base md:text-lg">
              Transparent pricing. No hidden fees. Cancel anytime.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 pb-28 lg:pb-4">
          {PLANS.map((p) => (
            <article
              key={p.name}
              className={`relative rounded-2xl p-6 flex flex-col border transition-all hover:-translate-y-1.5 ${
                p.featured
                  ? "bg-gradient-electric text-primary-foreground border-accent shadow-glow scale-[1.02] lg:scale-105"
                  : "bg-card border-border hover:border-primary/60"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] font-bold shadow-neon whitespace-nowrap">
                  ★ Best Value
                </div>
              )}
              <div className="text-[10px] uppercase tracking-[0.3em] mb-2 opacity-80">
                {p.name}
              </div>
              <div className="font-display text-4xl leading-none mb-1">{p.price}</div>
              <div className="text-xs uppercase tracking-wider opacity-70 mb-5">{p.per}</div>
              <ul className="space-y-2 mb-6 text-sm flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className={p.featured ? "text-accent" : "text-accent"}>✓</span>
                    <span className={p.featured ? "" : "text-foreground/85"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-auto inline-flex items-center justify-center px-4 py-2.5 rounded-md font-bold tracking-wider uppercase text-xs transition-all ${
                  p.featured
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-primary text-primary-foreground hover:shadow-glow"
                }`}
              >
                {p.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
