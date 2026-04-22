import { useState } from "react";

const ADDRESS_LINES = [
  "No. 35-B, Vijaya Saras Building, 3rd Floor,",
  "Rajendra Prasad Road, Gayathri Nagar,",
  "above Axis Bank, Hasthinapuram,",
  "Chromepet, Chennai, Tamil Nadu 600044",
];

export function ContactSection({ heading = true }: { heading?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 md:py-28">
      <div className="container mx-auto px-5">
        {heading && (
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-px bg-flame" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-flame font-semibold">
                Visit Us in Chromepet
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95]">
              Your transformation <span className="text-primary text-glow">starts here</span>.
            </h2>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
          {/* Info + form */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">Address</div>
              <address className="not-italic text-foreground/90 leading-relaxed">
                <strong className="block mb-1">Total Fitness Studio</strong>
                {ADDRESS_LINES.map((l) => <div key={l}>{l}</div>)}
              </address>
              <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
                <a href="tel:+919999999999" className="rounded-md border border-border p-3 hover:border-primary transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-0.5">Call</div>
                  <div className="font-semibold">+91 99999 99999</div>
                </a>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener" className="rounded-md border border-border p-3 hover:border-accent transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-accent mb-0.5">WhatsApp</div>
                  <div className="font-semibold">Chat instantly</div>
                </a>
                <a href="mailto:hello@totalfitstudio.in" className="rounded-md border border-border p-3 hover:border-primary transition-colors">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-0.5">Email</div>
                  <div className="font-semibold">hello@totalfitstudio.in</div>
                </a>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-flame mb-0.5">Hours</div>
                  <div className="font-semibold">6 AM – 10 PM Daily</div>
                </div>
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-border bg-card p-6 space-y-4"
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-accent">
                Claim your free trial
              </div>
              <h3 className="font-display text-2xl">Book a tour & first session</h3>
              {submitted ? (
                <div className="rounded-md border border-accent/60 bg-accent/10 p-4 text-sm">
                  Thanks! Our team will reach out on WhatsApp within a few hours to confirm your slot.
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input required name="name" placeholder="Your name" className="bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                    <input required type="tel" name="phone" placeholder="WhatsApp number" className="bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <select name="goal" className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option>I want to lose weight</option>
                    <option>I want to gain muscle</option>
                    <option>I want general fitness</option>
                    <option>I'm new — just exploring</option>
                  </select>
                  <textarea name="msg" rows={3} placeholder="Tell us a bit about your goal (optional)" className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <button type="submit" className="w-full inline-flex items-center justify-center bg-gradient-flame text-white px-5 py-3 rounded-md font-bold tracking-wider uppercase text-sm shadow-flame hover:shadow-glow transition-all">
                    Claim Free Trial
                  </button>
                  <p className="text-[11px] text-muted-foreground text-center">
                    No credit card. We'll WhatsApp you within hours.
                  </p>
                </>
              )}
            </form>
          </div>

          {/* Map */}
          <div className="relative rounded-2xl overflow-hidden border border-border bg-card min-h-[420px]">
            <iframe
              title="Total Fitness Studio location map"
              src="https://www.google.com/maps?q=Hasthinapuram+Chromepet+Chennai+600044&output=embed"
              loading="lazy"
              className="absolute inset-0 w-full h-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
