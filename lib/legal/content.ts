import type { Locale } from '@/i18n/locales';
import { he } from './he';
import { ar } from './ar';

/**
 * Legal texts of the site (terms, cancellations, privacy, accessibility).
 * Hebrew is the binding version; Arabic is a convenience translation.
 * Business facts come from the owners — update the texts when they change.
 */
export const LEGAL_UPDATED = '14.11.2026';

export type LegalSlug = 'terms' | 'returns' | 'privacy' | 'accessibility';

export const legalSlugs: LegalSlug[] = ['terms', 'returns', 'privacy', 'accessibility'];

export type LegalSection = { id?: string; h: string; p: string[] };
export type LegalDoc = { title: string; intro: string; sections: LegalSection[] };

export const legalDocs: Record<Locale, Record<LegalSlug, LegalDoc>> = { he, ar };
