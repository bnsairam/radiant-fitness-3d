import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCTA } from "@/components/StickyCTA";
import { Schedule } from "@/components/Schedule";

export const Route = createFileRoute("/schedule")({
  component: SchedulePage,
  head: () => ({
    meta: [
      { title: "Class Schedule | Total Fitness Studio, Chromepet" },
      {
        name: "description",
        content:
          "Weekly group class schedule — HIIT, Zumba, Yoga, Strength, Bootcamp. Morning & evening slots. Open 6 AM – 10 PM daily in Chromepet.",
      },
      { property: "og:title", content: "Class Schedule — Total Fitness Studio" },
      {
        property: "og:description",
        content:
          "Train every day. Morning or evening. See the full weekly group class schedule.",
      },
    ],
  }),
});

function SchedulePage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-2">
        <div className="container mx-auto px-5">
          <div className="text-[11px] uppercase tracking-[0.4em] text-accent font-semibold mb-4">
            Class Schedule
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] max-w-4xl text-glow">
            Train <span className="text-primary">every day</span>.
            Morning or <span className="text-accent">evening</span>.
          </h1>
        </div>
      </section>

      <Schedule heading={false} />

      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
