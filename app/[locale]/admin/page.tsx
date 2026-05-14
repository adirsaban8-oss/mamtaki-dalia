import { setRequestLocale } from 'next-intl/server';
import { AdminApp } from '@/components/admin/AdminApp';
import type { Locale } from '@/i18n/locales';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  params,
}: PageProps<'/[locale]/admin'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminApp tab="orders" locale={locale as Locale} />;
}
