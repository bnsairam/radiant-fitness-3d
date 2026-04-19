import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCTA } from "@/components/StickyCTA";
import { TransformationGallery } from "@/components/TransformationGallery";

export const Route = createFileRoute("/transformations")({
  component: TransformationsPage,
  head: () => ({
    meta: [
      {
        title:
          "Transformations | Real Before & After Results | Total Fitness Studio, Chromepet",
      },
      {
        name: "description",
        content:
          "Real before-and-after transformations from members at Total Fitness Studio, Chromepet. Weight loss, muscle gain, women's transformations and more.",
      },
      {
        property: "og:title",
        content: "Real Transformations — Total Fitness Studio, Chromepet",
      },
      {
        property: "og:description",
        content:
          "See incredible before-and-after journeys from our members in Chromepet, Hasthinapuram and Chennai.",
      },
    ],
  }),
});

function TransformationsPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-2">
        <div className="container mx-auto px-5">
          <div className="text-[11px] uppercase tracking-[0.4em] text-accent font-semibold mb-4">
            Hall of Champions
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] max-w-5xl text-glow">
            Real Results.{" "}
            <span className="text-primary">Real Transformations</span>{" "}
            <span className="text-accent">at Total Fitness Studio, Chromepet</span>.
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl">
            See the incredible before-and-after journeys of our members from Chromepet,
            Hasthinapuram &amp; Chennai. Drag the slider on each card to reveal the change.
          </p>
        </div>
      </section>

      <TransformationGallery heading={false} />

      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
