/** Shop-wide contact details used by the catalog CTAs. */
export const WHATSAPP_NUMBER = '972525986266';

/** WhatsApp deep link, optionally pre-filled with a message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
