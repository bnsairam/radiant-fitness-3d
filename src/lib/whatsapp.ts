/** Studio WhatsApp helper — every CTA in the app goes through here. */
export const WHATSAPP_NUMBER = "919941942942"; // +91 99419 42942 (intl. format, no '+', no spaces)
export const WHATSAPP_DISPLAY = "+91 99419 42942";

/** Build a wa.me deep-link with a prefilled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type LeadTags = {
  /** Where in the site the click came from (e.g. "transformation_card", "hero_cta"). */
  source: string;
  /** High-level campaign bucket (e.g. "hall_of_champions", "free_trial"). */
  campaign?: string;
  /** Specific program / offering being inquired about. */
  program?: string;
  /** Specific transformation member name (for transformation CTAs). */
  member?: string;
  /** Anything else worth tracking. */
  extra?: Record<string, string>;
};

/**
 * Wrap a human message with a hidden lead-tag footer so the studio team can
 * categorize inquiries directly in WhatsApp, with no backend required.
 *
 * The footer block is plain text, machine-greppable, and human-readable:
 *   ━━ LEAD INFO ━━
 *   • source: transformation_card
 *   • campaign: hall_of_champions
 *   • program: Weight Loss + Strength
 *   • member: arun-m
 *   • utm_source=website utm_medium=transformation_card utm_campaign=hall_of_champions
 */
export function whatsappLinkWithTags(message: string, tags: LeadTags): string {
  const slug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const lines = [
    message.trim(),
    "",
    "━━ LEAD INFO ━━",
    `• source: ${tags.source}`,
    tags.campaign ? `• campaign: ${tags.campaign}` : null,
    tags.program ? `• program: ${tags.program}` : null,
    tags.member ? `• member: ${slug(tags.member)}` : null,
    ...Object.entries(tags.extra ?? {}).map(([k, v]) => `• ${k}: ${v}`),
    `• utm: utm_source=website utm_medium=${tags.source}${
      tags.campaign ? ` utm_campaign=${tags.campaign}` : ""
    }${tags.program ? ` utm_content=${slug(tags.program)}` : ""}${
      tags.member ? ` utm_term=${slug(tags.member)}` : ""
    }`,
  ].filter(Boolean);
  return whatsappLink(lines.join("\n"));
}

/** Standard "Free Trial" message. */
export const TRIAL_MESSAGE =
  "Hi Total Fitness Studio! 👋 I'd like to claim my FREE trial session at your Chromepet studio. Please share the next available slot. — sent from your website";

/** Build a contact-form message from form state. */
export function buildLeadMessage(input: {
  name?: string;
  phone?: string;
  goal?: string;
  msg?: string;
}): string {
  const lines = [
    "Hi Total Fitness Studio! 👋 I'd like to book a FREE trial.",
    "",
    input.name ? `• Name: ${input.name}` : null,
    input.phone ? `• WhatsApp: ${input.phone}` : null,
    input.goal ? `• Goal: ${input.goal}` : null,
    input.msg ? `• Note: ${input.msg}` : null,
    "",
    "— sent from totalfitstudio.in",
  ].filter(Boolean);
  return lines.join("\n");
}
