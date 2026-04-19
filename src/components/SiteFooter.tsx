import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-card/40 mt-20">
      <div className="container mx-auto px-6 py-16 grid lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-md bg-gradient-electric flex items-center justify-center shadow-glow">
              <span className="font-display text-xl text-primary-foreground">T</span>
            </div>
            <span className="font-display text-lg tracking-widest">
              TOTAL<span className="text-primary">FIT</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Chennai's premier fitness studio in Chromepet. Real coaches. Real results.
            Safe, welcoming and transformative.
          </p>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/transformations" className="hover:text-primary">Transformations</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">Memberships</Link></li>
            <li><Link to="/schedule" className="hover:text-primary">Class Schedule</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">Visit</div>
          <address className="not-italic text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground block mb-1">Total Fitness Studio</strong>
            No. 35-B, Vijaya Saras Building, 3rd Floor,<br />
            Rajendra Prasad Road, Gayathri Nagar,<br />
            above Axis Bank, Hasthinapuram,<br />
            Chromepet, Chennai, Tamil Nadu 600044
          </address>
          <p className="text-xs text-muted-foreground mt-3">
            Open Daily · 6:00 AM – 10:00 PM
          </p>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">Connect</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="tel:+919999999999" className="hover:text-primary">+91 99999 99999</a></li>
            <li><a href="https://wa.me/919999999999" target="_blank" rel="noopener" className="hover:text-accent">WhatsApp Chat</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener" className="hover:text-primary">Instagram</a></li>
            <li><a href="mailto:hello@totalfitstudio.in" className="hover:text-primary">hello@totalfitstudio.in</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Total Fitness Studio, Chromepet. All rights reserved.</p>
          <p className="tracking-widest uppercase">Transform Your Body · Elevate Your Life</p>
        </div>
      </div>
    </footer>
  );
}
