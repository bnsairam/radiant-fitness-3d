import { useState } from "react";
import { buildLeadMessage, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/whatsapp";

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
    const fd = new FormData(e.currentTarget);
    const url = whatsappLink(
      buildLeadMessage({
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        goal: String(fd.get("goal") ?? ""),
        msg: String(fd.get("msg") ?? ""),
      }),
    );
    setSubmitted(true);
    // Open WhatsApp in a new tab with the prefilled lead message
    window.open(url, "_blank", "noopener");
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
                <a
                  href="tel:+919941942942"
                  className="rounded-md border border-border p-3 hover:border-primary transition-colors"
                >
                  <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-0.5">Call</div>
                  <div className="font-semibold">{WHATSAPP_DISPLAY}</div>
                </a>
                <a
                  href={whatsappLink(
                    "Hi Total Fitness Studio! I'd like to know more about your programs.",
                  )}
                  target="_blank"
                  rel="noopener"
                  className="rounded-md border border-border p-3 hover:border-accent transition-colors"
                >
                  <div className="text-[10px] uppercase tracking-[0.25em] text-accent mb-0.5">WhatsApp</div>
                  <div className="font-semibold">Chat instantly</div>
                </a>
                <a
                  href="mailto:hello@totalfitstudio.in"
                  className="rounded-md border border-border p-3 hover:border-primary transition-colors"
                >
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
                <div className="rounded-md border border-accent/60 bg-accent/10 p-4 text-sm space-y-3">
                  <p>
                    ✅ Opening WhatsApp now — just hit <strong>send</strong> in the chat to confirm your slot.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs uppercase tracking-wider text-accent underline underline-offset-4"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input required name="name" placeholder="Your name" className="bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                    <input required type="tel" name="phone" placeholder="WhatsApp number" className="bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <select name="goal" defaultValue="I want to lose weight" className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option>I want to lose weight</option>
                    <option>I want to gain muscle</option>
                    <option>I want general fitness</option>
                    <option>I'm new — just exploring</option>
                  </select>
                  <textarea name="msg" rows={3} placeholder="Tell us a bit about your goal (optional)" className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-flame text-white px-5 py-3 rounded-md font-bold tracking-wider uppercase text-sm shadow-flame hover:shadow-glow transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M19.05 4.91A10 10 0 0 0 3.1 17.7L2 22l4.4-1.15a10 10 0 0 0 4.79 1.22A10 10 0 0 0 19.05 4.9zM12.2 20.3a8.31 8.31 0 0 1-4.24-1.16l-.3-.18-2.6.68.7-2.54-.2-.32a8.32 8.32 0 1 1 6.64 3.52z" />
                    </svg>
                    Send to WhatsApp
                  </button>
                  <p className="text-[11px] text-muted-foreground text-center">
                    Opens WhatsApp with your details prefilled — just hit send. We reply within hours.
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
