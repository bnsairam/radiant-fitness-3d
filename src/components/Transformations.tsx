import { useRef, useState } from "react";
import before1 from "@/assets/transform-1-before.jpg";
import after1 from "@/assets/transform-1-after.jpg";
import before2 from "@/assets/transform-2-before.jpg";
import after2 from "@/assets/transform-2-after.jpg";

type Story = {
  name: string;
  weeks: string;
  stat: string;
  before: string;
  after: string;
  quote: string;
};

const stories: Story[] = [
  {
    name: "Marcus K.",
    weeks: "24 weeks",
    stat: "-32 lbs · +14 lbs lean",
    before: before1,
    after: after1,
    quote: "TotalFit didn't just change my body. It rebuilt my entire identity.",
  },
  {
    name: "Sofia R.",
    weeks: "20 weeks",
    stat: "-18% body fat",
    before: before2,
    after: after2,
    quote: "I came in broken. I left unstoppable.",
  },
];

function BeforeAfter({ story }: { story: Story }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClient = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div className="group">
      <div
        ref={ref}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-3d cursor-ew-resize select-none"
        onMouseDown={(e) => {
          dragging.current = true;
          updateFromClient(e.clientX);
        }}
        onMouseMove={(e) => dragging.current && updateFromClient(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchStart={(e) => updateFromClient(e.touches[0].clientX)}
        onTouchMove={(e) => updateFromClient(e.touches[0].clientX)}
      >
        <img
          src={story.after}
          alt={`${story.name} after transformation`}
          loading="lazy"
          width={768}
          height={1024}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={story.before}
            alt={`${story.name} before transformation`}
            loading="lazy"
            width={768}
            height={1024}
            className="w-full h-full object-cover grayscale"
            draggable={false}
          />
        </div>

        {/* Slider line + handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-glow pointer-events-none"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary border-4 border-background shadow-glow flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 5L2 10L7 15M13 5L18 10L13 15" stroke="white" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-background/80 backdrop-blur text-xs uppercase tracking-widest font-semibold">
          Before
        </div>
        <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs uppercase tracking-widest font-semibold">
          After
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-display text-3xl">{story.name}</h3>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {story.weeks}
          </span>
        </div>
        <div className="text-primary font-semibold mb-3">{story.stat}</div>
        <p className="text-muted-foreground italic">"{story.quote}"</p>
      </div>
    </div>
  );
}

export function Transformations() {
  return (
    <section
      id="transformations"
      className="relative py-32 overflow-hidden bg-card/30"
    >
      <div className="absolute inset-0 bg-gradient-radial-red opacity-40 pointer-events-none" />
      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mb-20">
          <div className="text-xs uppercase tracking-[0.4em] text-primary mb-4">
            — Real Transformations
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.9]">
            The Proof Is<br />
            <span className="text-primary text-glow">In The Bodies.</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl">
            Drag the slider. See what 20 weeks of the right system does. These are real members,
            real results, no filters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {stories.map((s) => (
            <BeforeAfter key={s.name} story={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
