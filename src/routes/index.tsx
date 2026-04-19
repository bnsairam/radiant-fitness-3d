import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCTA } from "@/components/StickyCTA";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { TransformationGallery } from "@/components/TransformationGallery";
import { Trainers } from "@/components/Trainers";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { ContactSection } from "@/components/ContactSection";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title:
          "Total Fitness Studio | Best Gym in Chromepet, Chennai | Weight Loss & Personal Training",
      },
      {
        name: "description",
        content:
          "Premier fitness studio in Chromepet, Chennai. Personal training, group classes, weight loss & body transformation programs. Safe, welcoming environment. Free trial available.",
      },
      { property: "og:title", content: "Total Fitness Studio — Chromepet, Chennai" },
      {
        property: "og:description",
        content:
          "Transform your body. Elevate your life. Chennai's premier fitness studio in Chromepet — real coaches, real results.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Marquee />
      <Services />
      <TransformationGallery />
      <Trainers />
      <Pricing />
      <Testimonials />
      <ContactSection />
      <SiteFooter />
      <StickyCTA />
    </main>
  );
}
