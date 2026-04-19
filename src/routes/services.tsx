import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCTA } from "@/components/StickyCTA";
import { Services } from "@/components/Services";
import { Schedule } from "@/components/Schedule";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services & Programs | Total Fitness Studio, Chromepet" },
      {
        name: "description",
        content:
          "Strength training, cardio, group classes (Zumba, HIIT, Yoga), personal training, women-friendly programs and weight loss plans in Chromepet, Chennai.",
      },
      { property: "og:title", content: "Services — Total Fitness Studio, Chromepet" },
      {
        property: "og:description",
        content:
          "Everything you need under one roof: strength, cardio, group classes, PT and women-safe programs.",
      },
    ],
  }),
});

function ServicesPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-6">
        <div className="container mx-auto px-5">
          <div className="text-[11px] uppercase tracking-[0.4em] text-primary font-semibold mb-4">
            Services
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] max-w-4xl text-glow">
            Everything you need to <span className="text-accent">transform</span>.
          </h1>
        </div>
      </section>

      <Services heading={false} />
      <Schedule />

      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
