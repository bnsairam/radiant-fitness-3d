export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-gradient-blood flex items-center justify-center shadow-glow">
                <span className="font-display text-xl text-primary-foreground">T</span>
              </div>
              <span className="font-display text-xl tracking-widest">
                TOTAL<span className="text-primary">FIT</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The most advanced fitness studio on Earth.
            </p>
          </div>
          {[
            { title: "Studio", items: ["Programs", "Trainers", "Tour", "Hours"] },
            { title: "Company", items: ["About", "Careers", "Press", "Contact"] },
            { title: "Connect", items: ["Instagram", "YouTube", "TikTok", "Newsletter"] },
          ].map((c) => (
            <div key={c.title}>
              <div className="font-display text-sm uppercase tracking-widest text-primary mb-4">
                {c.title}
              </div>
              <ul className="space-y-2">
                {c.items.map((i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground uppercase tracking-widest">
          <div>© 2026 TotalFit Studio. Forged in iron.</div>
          <div>Privacy · Terms · Cookies</div>
        </div>
      </div>
    </footer>
  );
}
