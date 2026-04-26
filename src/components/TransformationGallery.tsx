import { useState } from "react";
import { TransformationCard, type Transformation } from "./TransformationCard";
import { CarouselCarousel } from "./TransformationCarousel";
import { TransformationLightbox } from "./TransformationLightbox";

import b1 from "@/assets/champion-1-before.jpg";
import a1 from "@/assets/champion-1-after.jpg";
import b2 from "@/assets/champion-2-before.jpg";
import a2 from "@/assets/champion-2-after.jpg";
import b3 from "@/assets/champion-3-before.jpg";
import a3 from "@/assets/champion-3-after.jpg";

export const TRANSFORMATIONS: Transformation[] = [
  { name: "Arun M.",     initial: "A", before: b1, after: a1, caption: "22kg lost in 6 months",       detail: "From 89kg to 67kg — complete body transformation", program: "Weight Loss + Strength", tag: "Weight Loss", age: 32 },
  { name: "Priya S.",    initial: "P", before: b2, after: a2, caption: "18kg down in 5 months",       detail: "Belly fat gone & confidence gained",               program: "Women's Safe Program",   tag: "Women",      age: 29 },
  { name: "Karthik R.",  initial: "K",                         caption: "Muscle gain · +12kg lean",    detail: "From 62kg skinny to 74kg athletic",                program: "Muscle Builder",         tag: "Muscle Gain",age: 24 },
  { name: "Lakshmi V.",  initial: "L",                         caption: "15kg lost in 90 days",        detail: "Postpartum comeback — stronger than ever",         program: "Women's Transform",      tag: "Women",      age: 34 },
  { name: "Vignesh T.",  initial: "V", before: b1, after: a1, caption: "20kg fat loss · 6-pack",      detail: "From 92kg to 72kg in 7 months",                    program: "Body Recomposition",     tag: "Men",        age: 27 },
  { name: "Divya K.",    initial: "D", before: b2, after: a2, caption: "Toned & 11kg lighter",        detail: "Zumba + HIIT 4× a week",                           program: "Group Classes",          tag: "Women",      age: 26 },
  { name: "Suresh P.",   initial: "S", before: b3, after: a3, caption: "25kg down in 8 months",       detail: "Reversed pre-diabetes · off all medication",       program: "Lifestyle Reset",        tag: "Weight Loss",age: 41 },
  { name: "Meena R.",    initial: "M",                         caption: "Women's safe transformation", detail: "From hesitant beginner to confident lifter",       program: "1:1 Personal",           tag: "Women",      age: 36 },
  { name: "Rahul B.",    initial: "R",                         caption: "+8kg muscle in 5 months",     detail: "Strength training · powerlifter prep",             program: "Strength Builder",       tag: "Muscle Gain",age: 22 },
  { name: "Anitha D.",   initial: "A",                         caption: "14kg lost · stronger core",   detail: "Mom of two, busier than ever — and fitter",        program: "Women's Transform",      tag: "Women",      age: 38 },
  { name: "Naveen K.",   initial: "N",                         caption: "30kg lost in 10 months",      detail: "From 108kg to 78kg — life rebuilt",                program: "Total Reset",            tag: "Weight Loss",age: 35 },
  { name: "Hari Prasad", initial: "H", before: b3, after: a3, caption: "Lean & muscular at 45",       detail: "+9kg lean mass · 8% body fat down",                program: "Senior Strength",        tag: "Men",        age: 45 },
];

const TABS = ["All", "Men", "Women", "Weight Loss", "Muscle Gain"] as const;
type Tab = (typeof TABS)[number];
type Mode = "grid" | "3d";

export function TransformationGallery({ heading = true }: { heading?: boolean }) {
  const [active, setActive] = useState<Tab>("All");
  const [mode, setMode] = useState<Mode>("grid");
  const [openItem, setOpenItem] = useState<Transformation | null>(null);

  const filtered =
    active === "All"
      ? TRANSFORMATIONS
      : TRANSFORMATIONS.filter((t) => t.tag === active);

  return (
    <section
      id="transformations"
      className="relative py-24 md:py-32 overflow-hidden noise"
    >
      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-gradient-radial opacity-40 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-[1]" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-[1]" />

      <div className="container mx-auto px-5 relative z-10">
        {heading && (
          <div className="max-w-4xl mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-12 h-px bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-accent font-semibold">
                Hall of Champions · Chromepet
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
              Real Results.
              <br />
              <span className="text-gradient-animated">Real Transformations</span>{" "}
              <span className="text-accent">at Total Fitness Studio</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed">
              See the incredible before-and-after journeys of our members from Chromepet,
              Hasthinapuram &amp; Chennai. Drag the slider on each card to reveal the change.
            </p>
          </div>
        )}

        {/* Controls row: tabs + view mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const isActive = active === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActive(tab)}
                  className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold border transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-glow"
                      : "bg-card/60 text-muted-foreground border-border hover:text-primary hover:border-primary/60"
                  }`}
                >
                  {tab}
                  <span className="ml-2 opacity-60">
                    {tab === "All"
                      ? TRANSFORMATIONS.length
                      : TRANSFORMATIONS.filter((t) => t.tag === tab).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View mode toggle */}
          <div
            role="tablist"
            aria-label="View mode"
            className="inline-flex p-1 rounded-full border border-border bg-card/60 backdrop-blur"
          >
            <ModeButton
              active={mode === "grid"}
              onClick={() => setMode("grid")}
              label="Wall"
              icon={<GridIcon />}
            />
            <ModeButton
              active={mode === "3d"}
              onClick={() => setMode("3d")}
              label="3D Carousel"
              icon={<OrbitIcon />}
            />
          </div>
        </div>

        {/* View */}
        {mode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9">
            {filtered.map((t, i) => (
              <TransformationCard key={t.name} t={t} index={i} onExpand={setOpenItem} />
            ))}
          </div>
        ) : (
          <CarouselCarousel key={active} items={filtered} onExpand={setOpenItem} />
        )}

      </div>

      <TransformationLightbox
        t={openItem}
        items={filtered}
        onNavigate={setOpenItem}
        onClose={() => setOpenItem(null)}
      />
    </section>
  );
}

function ModeButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.18em] font-bold transition-all ${
        active
          ? "bg-accent text-accent-foreground shadow-neon"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </svg>
  );
}
function OrbitIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="10" cy="10" rx="8" ry="3.5" />
      <circle cx="10" cy="10" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
