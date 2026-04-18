import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Programs } from "@/components/Programs";
import { Transformations } from "@/components/Transformations";
import { Trainers } from "@/components/Trainers";
import { JoinCTA } from "@/components/JoinCTA";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "TotalFit Studio — Forge Your Legend | 3D Fitness Experience" },
      {
        name: "description",
        content:
          "Step inside the most advanced fitness studio on Earth. Elite coaches, six disciplines, real transformations. 24/7 access from $49/mo.",
      },
      { property: "og:title", content: "TotalFit Studio — Forge Your Legend" },
      {
        property: "og:description",
        content:
          "The most advanced fitness studio on Earth. Real transformations, elite coaches, 24/7 access.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Marquee />
      <Programs />
      <Transformations />
      <Trainers />
      <JoinCTA />
      <Footer />
    </main>
  );
}
