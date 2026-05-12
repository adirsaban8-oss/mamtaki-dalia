export const locales = ['he', 'ar'] as const;
export const defaultLocale = 'he' as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
