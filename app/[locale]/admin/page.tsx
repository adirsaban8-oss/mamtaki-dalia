import type { Metadata } from 'next';
import { Admin } from '@/components/admin/Admin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'ניהול', robots: { index: false, follow: false } };

/** The shop's management screen. Signing in and every action are checked on the server (app/api/admin). */
export default function AdminPage() {
  return <Admin />;
}
