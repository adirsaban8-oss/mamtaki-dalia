/** Shop-wide contact details used by the catalog CTAs. */
export const WHATSAPP_NUMBER = '972525986266';

/** WhatsApp deep link, optionally pre-filled with a message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Events & large orders line (owner: "לאירועים וכמויות גדולות"). */
export const EVENTS_PHONE = '972543910078';
export const EVENTS_PHONE_DISPLAY = '054-3910078';

/** WhatsApp deep link to the events line. */
export function eventsWhatsappLink(message?: string): string {
  const base = `https://wa.me/${EVENTS_PHONE}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
