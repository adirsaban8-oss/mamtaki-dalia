import { dbEnabled, q } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

/** A product photo uploaded in /admin. An upload never changes, so browsers may keep it for a year. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!dbEnabled() || !/^[a-f0-9]{18}$/.test(id)) return new Response('Not found', { status: 404 });
  const row = (await q<{ mime: string; bytes: Uint8Array }>('select mime, bytes from images where id = $1', [id]))[0];
  if (!row) return new Response('Not found', { status: 404 });
  return new Response(Buffer.from(row.bytes), { headers: { 'Content-Type': row.mime, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
}
