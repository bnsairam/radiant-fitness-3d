import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TRIAL_MESSAGE, whatsappLink } from "@/lib/whatsapp";

/** Floating sticky CTAs — Free Trial + WhatsApp on every page (except /contact). */
export function StickyCTA() {
  const location = useLocation();
  const [show, setShow] = useState(false);

  // Hide the redundant "Free Trial" pill on the contact page itself.
  const hideTrialPill = location.pathname === "/contact";

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const trialUrl = whatsappLink(TRIAL_MESSAGE);
  const chatUrl = whatsappLink(
    "Hi Total Fitness Studio! I'd like to know more about your programs.",
  );

  return (
    <div
      className={`fixed z-40 right-4 bottom-4 sm:right-6 sm:bottom-6 flex flex-col items-end gap-3 pointer-events-none transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      aria-hidden={!show}
    >
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-neon hover:scale-110 transition-transform"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.05 4.91A10 10 0 0 0 3.1 17.7L2 22l4.4-1.15a10 10 0 0 0 4.79 1.22h.01A10 10 0 0 0 19.05 4.9zm-7.85 15.4a8.31 8.31 0 0 1-4.24-1.16l-.3-.18-2.6.68.7-2.54-.2-.32a8.32 8.32 0 1 1 15.45-4.4 8.32 8.32 0 0 1-8.81 7.92zm4.79-6.23c-.26-.13-1.55-.76-1.79-.85s-.42-.13-.59.13-.68.85-.83 1.02-.31.2-.57.07a6.84 6.84 0 0 1-2-1.24 7.55 7.55 0 0 1-1.4-1.74c-.14-.26 0-.4.11-.53.11-.11.26-.31.39-.46l.2-.34c.06-.13.03-.26-.03-.39s-.59-1.42-.81-1.94c-.21-.51-.43-.44-.59-.45h-.5a.97.97 0 0 0-.7.32 2.94 2.94 0 0 0-.92 2.18 5.1 5.1 0 0 0 1.07 2.7 11.66 11.66 0 0 0 4.45 3.94 14.97 14.97 0 0 0 1.49.55 3.58 3.58 0 0 0 1.64.1 2.69 2.69 0 0 0 1.76-1.24 2.18 2.18 0 0 0 .15-1.24c-.06-.11-.23-.17-.49-.3z" />
        </svg>
      </a>
      {!hideTrialPill && (
        <a
          href={trialUrl}
          target="_blank"
          rel="noopener"
          className="pointer-events-auto inline-flex items-center gap-2 bg-gradient-flame text-white px-5 py-3 rounded-full shadow-flame font-bold tracking-wider uppercase text-xs hover:scale-105 transition-transform"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Free Trial
        </a>
      )}
    </div>
  );
}
