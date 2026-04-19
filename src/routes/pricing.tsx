import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCTA } from "@/components/StickyCTA";
import { Pricing } from "@/components/Pricing";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Membership Plans & Pricing | Total Fitness Studio, Chromepet" },
      {
        name: "description",
        content:
          "Affordable, transparent gym membership plans in Chromepet, Chennai. Monthly, quarterly, half-yearly and annual plans. Free trial available.",
      },
      { property: "og:title", content: "Membership Plans — Total Fitness Studio" },
      {
        property: "og:description",
        content:
          "Choose your commitment. We handle the results. Plans starting from ₹2,499/month.",
      },
    ],
  }),
});

function PricingPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-2">
        <div className="container mx-auto px-5">
          <div className="text-[11px] uppercase tracking-[0.4em] text-flame font-semibold mb-4">
            Memberships
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] max-w-4xl text-glow">
            Pricing built for <span className="text-primary">commitment</span> &{" "}
            <span className="text-accent">results</span>.
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl">
            Transparent plans. No hidden fees. Try us free for a day, then choose what fits your goal.
          </p>
        </div>
      </section>

      <Pricing heading={false} />

      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
