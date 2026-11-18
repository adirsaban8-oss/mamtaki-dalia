/** A delivery address as saved with an order: what the customer sees, plus English for couriers and exports. */
export type AddressParts = { street: string; houseNumber: string; city: string; postalCode: string; country: string; full: string };

export type DeliveryAddress = {
  /** In the customer's language (Hebrew or Arabic), as typed or as Google returned it. */
  local: AddressParts;
  /** English from Google Place Details (languageCode=en, regionCode=IL); absent for a manual address. */
  en?: AddressParts;
  /** Google place ID (the one Places value that may be stored). */
  placeId?: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  /** How it was entered: picked from Google's suggestions, or typed by hand. */
  via: 'google' | 'manual';
  /** The customer confirmed an address that looked incomplete. */
  confirmedIncomplete?: boolean;
};

/** Street + number present and a city: enough for a courier. */
export function looksComplete(a: Pick<AddressParts, 'street' | 'houseNumber' | 'city'>): boolean {
  return a.street.trim().length > 1 && /\d/.test(a.houseNumber) && a.city.trim().length > 1;
}

/** One line for the order board / WhatsApp: "הרצל 12, דירה 4, קומה 2, כניסה ב, חיפה". */
export function addressLine(a: DeliveryAddress, lang: 'he' | 'ar'): string {
  const ar = lang === 'ar';
  const p = a.local;
  return [
    [p.street, p.houseNumber].filter(Boolean).join(' '),
    a.apartment && (ar ? `شقة ${a.apartment}` : `דירה ${a.apartment}`),
    a.floor && (ar ? `طابق ${a.floor}` : `קומה ${a.floor}`),
    a.entrance && (ar ? `مدخل ${a.entrance}` : `כניסה ${a.entrance}`),
    p.city,
  ]
    .filter(Boolean)
    .join(', ');
}

/** The English line, for couriers. */
export function addressLineEn(a: DeliveryAddress): string {
  const e = a.en;
  if (!e) return '';
  return [
    [e.houseNumber, e.street].filter(Boolean).join(' '),
    a.apartment && `Apt ${a.apartment}`,
    a.floor && `Floor ${a.floor}`,
    a.entrance && `Entrance ${a.entrance}`,
    e.city,
    e.postalCode,
    e.country,
  ]
    .filter(Boolean)
    .join(', ');
}
