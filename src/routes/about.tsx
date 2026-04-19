import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCTA } from "@/components/StickyCTA";
import gym from "@/assets/hero-gym.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | Total Fitness Studio, Chromepet Chennai" },
      {
        name: "description",
        content:
          "A spacious, premium fitness studio above Axis Bank in Hasthinapuram, Chromepet. Experienced trainers, safe environment, real transformations since 2014.",
      },
      { property: "og:title", content: "About Total Fitness Studio, Chromepet" },
      {
        property: "og:description",
        content:
          "Premium 3rd-floor gym in Chromepet, Chennai. Safe for women, expert trainers, real results.",
      },
      { property: "og:image", content: gym },
      { name: "twitter:image", content: gym },
    ],
  }),
});

function AboutPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={gym} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="container mx-auto px-5">
          <div className="text-[11px] uppercase tracking-[0.4em] text-primary font-semibold mb-4">
            About Us
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] max-w-4xl text-glow">
            A premium fitness home in the heart of <span className="text-accent">Chromepet</span>.
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl">
            Total Fitness Studio is a modern, spacious gym above Axis Bank in Hasthinapuram —
            built for everyone in Chromepet, Pallavaram &amp; surrounding areas.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5 grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 text-foreground/85 leading-relaxed">
            <p>
              Since opening on the 3rd floor of the Vijaya Saras Building on Rajendra Prasad Road,
              we've helped hundreds of members across Chromepet, Hasthinapuram and Chennai
              completely transform their bodies and their lives. Weight loss. Muscle gain.
              Confidence rebuilt.
            </p>
            <p>
              Our studio is intentionally <strong className="text-foreground">premium and spacious</strong>{" "}
              — never overcrowded, always inviting. We're particularly proud of being one of the
              <strong className="text-accent"> safest, most welcoming gyms in Chromepet for women</strong>,
              with female trainers, dedicated programs and a community that lifts each other up.
            </p>
            <p>
              Whether you're a complete beginner who's never set foot in a gym, a busy parent
              looking for a structured way back to fitness, or a serious lifter chasing a new
              PR — we have the coaches, the equipment and the energy to take you there.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-4">
            {[
              { k: "10+ years", v: "Serving Chromepet" },
              { k: "500+", v: "Real Transformations" },
              { k: "4.9/5", v: "Member Rating" },
              { k: "6 AM – 10 PM", v: "Open Every Day" },
              { k: "100%", v: "Certified Trainers" },
              { k: "Women Safe", v: "Trusted Environment" },
            ].map((s) => (
              <li key={s.k} className="rounded-xl border border-border bg-card p-5">
                <div className="font-display text-3xl text-primary text-glow">{s.k}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1.5">
                  {s.v}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 border-t border-border bg-card/30">
        <div className="container mx-auto px-5 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Ready to see what you're capable of?
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center bg-gradient-flame text-white px-8 py-4 rounded-md font-bold tracking-wider uppercase text-sm shadow-flame hover:shadow-glow transition-all"
          >
            Claim Your Free Trial
          </Link>
        </div>
      </section>

      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
