import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { legalDocs } from '@/lib/legal/content';
import type { Locale } from '@/i18n/locales';

export async function generateMetadata({ params }: PageProps<'/[locale]/returns'>): Promise<Metadata> {
  const { locale } = await params;
  return { title: legalDocs[locale as Locale]?.returns.title ?? legalDocs.he.returns.title };
}

export default async function ReturnsPage({ params }: PageProps<'/[locale]/returns'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage slug="returns" locale={locale as Locale} />;
}
