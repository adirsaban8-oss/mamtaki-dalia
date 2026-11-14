import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { legalDocs } from '@/lib/legal/content';
import type { Locale } from '@/i18n/locales';

export async function generateMetadata({ params }: PageProps<'/[locale]/accessibility'>): Promise<Metadata> {
  const { locale } = await params;
  return { title: legalDocs[locale as Locale]?.accessibility.title ?? legalDocs.he.accessibility.title };
}

export default async function AccessibilityPage({ params }: PageProps<'/[locale]/accessibility'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage slug="accessibility" locale={locale as Locale} />;
}
