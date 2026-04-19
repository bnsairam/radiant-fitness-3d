import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCTA } from "@/components/StickyCTA";
import { Trainers } from "@/components/Trainers";
import { Testimonials } from "@/components/Testimonials";
import t1 from "@/assets/trainer-1.jpg";

export const Route = createFileRoute("/trainers")({
  component: TrainersPage,
  head: () => ({
    meta: [
      { title: "Our Trainers | Total Fitness Studio, Chromepet Chennai" },
      {
        name: "description",
        content:
          "Meet our certified personal trainers in Chromepet — experts in weight loss, strength training, women's fitness, HIIT and yoga.",
      },
      { property: "og:title", content: "Trainers — Total Fitness Studio, Chromepet" },
      {
        property: "og:description",
        content:
          "Certified, experienced and obsessed with your progress. Meet the team at Total Fitness Studio.",
      },
      { property: "og:image", content: t1 },
      { name: "twitter:image", content: t1 },
    ],
  }),
});

function TrainersPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-2">
        <div className="container mx-auto px-5">
          <div className="text-[11px] uppercase tracking-[0.4em] text-accent font-semibold mb-4">
            Our Coaches
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] max-w-4xl text-glow">
            Coaches obsessed with{" "}
            <span className="text-primary">your progress</span>.
          </h1>
        </div>
      </section>

      <Trainers heading={false} />
      <Testimonials />

      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
