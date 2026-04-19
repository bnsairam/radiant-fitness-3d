import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCTA } from "@/components/StickyCTA";
import { ContactSection } from "@/components/ContactSection";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact & Free Trial | Total Fitness Studio, Chromepet Chennai" },
      {
        name: "description",
        content:
          "Visit Total Fitness Studio at No. 35-B, 3rd Floor, above Axis Bank, Hasthinapuram, Chromepet. Book a free trial via WhatsApp or our quick form.",
      },
      { property: "og:title", content: "Contact Total Fitness Studio, Chromepet" },
      {
        property: "og:description",
        content:
          "Claim your free trial today. Located above Axis Bank, Hasthinapuram, Chromepet, Chennai.",
      },
    ],
  }),
});

function ContactPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-2">
        <div className="container mx-auto px-5">
          <div className="text-[11px] uppercase tracking-[0.4em] text-flame font-semibold mb-4">
            Visit Us · Chromepet
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] max-w-4xl text-glow">
            Your transformation <span className="text-primary">starts here</span>.
          </h1>
        </div>
      </section>

      <ContactSection heading={false} />

      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
