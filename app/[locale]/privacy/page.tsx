import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { legalDocs } from '@/lib/legal/content';
import type { Locale } from '@/i18n/locales';

export async function generateMetadata({ params }: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await params;
  return { title: legalDocs[locale as Locale]?.privacy.title ?? legalDocs.he.privacy.title };
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacy'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage slug="privacy" locale={locale as Locale} />;
}
