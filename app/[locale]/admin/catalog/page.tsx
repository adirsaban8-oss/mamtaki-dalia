import { setRequestLocale } from 'next-intl/server';
import { AdminApp } from '@/components/admin/AdminApp';
import type { Locale } from '@/i18n/locales';

export const dynamic = 'force-dynamic';

export default async function AdminCatalogPage({
  params,
}: PageProps<'/[locale]/admin/catalog'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminApp tab="catalog" locale={locale as Locale} />;
}
