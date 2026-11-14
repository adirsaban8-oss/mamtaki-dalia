import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { legalDocs } from '@/lib/legal/content';
import type { Locale } from '@/i18n/locales';

export async function generateMetadata({ params }: PageProps<'/[locale]/terms'>): Promise<Metadata> {
  const { locale } = await params;
  return { title: legalDocs[locale as Locale]?.terms.title ?? legalDocs.he.terms.title };
}

export default async function TermsPage({ params }: PageProps<'/[locale]/terms'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage slug="terms" locale={locale as Locale} />;
}
