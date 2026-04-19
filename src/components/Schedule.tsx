const SCHEDULE = [
  { day: "Mon", classes: [
    { time: "6:00 AM", name: "HIIT Burn",     coach: "Vignesh" },
    { time: "7:30 AM", name: "Yoga Flow",     coach: "Lakshmi" },
    { time: "6:00 PM", name: "Strength Lab",  coach: "Ramesh" },
    { time: "7:30 PM", name: "Zumba",         coach: "Priya"   },
  ]},
  { day: "Tue", classes: [
    { time: "6:00 AM", name: "Cardio Crush",  coach: "Vignesh" },
    { time: "7:30 AM", name: "Women's Tone",  coach: "Priya"   },
    { time: "6:00 PM", name: "Bootcamp",      coach: "Ramesh"  },
    { time: "7:30 PM", name: "Yoga Restore",  coach: "Lakshmi" },
  ]},
  { day: "Wed", classes: [
    { time: "6:00 AM", name: "Strength Lab",  coach: "Ramesh"  },
    { time: "7:30 AM", name: "HIIT Express",  coach: "Vignesh" },
    { time: "6:00 PM", name: "Zumba",         coach: "Priya"   },
    { time: "7:30 PM", name: "Mobility",      coach: "Lakshmi" },
  ]},
  { day: "Thu", classes: [
    { time: "6:00 AM", name: "Power Yoga",    coach: "Lakshmi" },
    { time: "7:30 AM", name: "Cardio Crush",  coach: "Vignesh" },
    { time: "6:00 PM", name: "Women's Strong",coach: "Priya"   },
    { time: "7:30 PM", name: "Strength Lab",  coach: "Ramesh"  },
  ]},
  { day: "Fri", classes: [
    { time: "6:00 AM", name: "HIIT Burn",     coach: "Vignesh" },
    { time: "7:30 AM", name: "Yoga Flow",     coach: "Lakshmi" },
    { time: "6:00 PM", name: "Bootcamp",      coach: "Ramesh"  },
    { time: "7:30 PM", name: "Zumba Fiesta",  coach: "Priya"   },
  ]},
  { day: "Sat", classes: [
    { time: "7:00 AM", name: "Total Body",    coach: "Ramesh"  },
    { time: "8:30 AM", name: "Yoga Long",     coach: "Lakshmi" },
    { time: "5:00 PM", name: "HIIT Showdown", coach: "Vignesh" },
  ]},
  { day: "Sun", classes: [
    { time: "8:00 AM", name: "Open Floor",    coach: "Open" },
    { time: "9:30 AM", name: "Stretch + Sauna", coach: "Lakshmi" },
  ]},
];

export function Schedule({ heading = true }: { heading?: boolean }) {
  return (
    <section className="relative py-24 md:py-28">
      <div className="container mx-auto px-5">
        {heading && (
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-px bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-accent font-semibold">
                Weekly Class Schedule
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95]">
              Train every day. <span className="text-primary text-glow">Morning or evening.</span>
            </h2>
            <p className="text-muted-foreground mt-4">
              Studio open daily 6:00 AM – 10:00 PM. Drop-in or book ahead.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {SCHEDULE.map((d) => (
            <div
              key={d.day}
              className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/60 transition-colors"
            >
              <div className="px-4 py-3 bg-gradient-electric text-primary-foreground text-center">
                <div className="font-display text-lg tracking-widest">{d.day}</div>
              </div>
              <ul className="p-3 space-y-2">
                {d.classes.map((c, i) => (
                  <li
                    key={i}
                    className="rounded-md p-2.5 bg-background/60 border border-border/50 hover:border-accent/60 transition-colors"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                      {c.time}
                    </div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">{c.coach}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
