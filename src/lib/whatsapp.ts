/** Studio WhatsApp helper — every CTA in the app goes through here. */
export const WHATSAPP_NUMBER = "919941942942"; // +91 99419 42942 (intl. format, no '+', no spaces)
export const WHATSAPP_DISPLAY = "+91 99419 42942";

/** Build a wa.me deep-link with a prefilled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
