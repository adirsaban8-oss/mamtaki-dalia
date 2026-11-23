import { randomBytes } from 'node:crypto';
import { adminRefusal } from '@/lib/server/admin';
import { q } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

const MAX = 4 * 1024 * 1024;

/** The real type from the file's first bytes, not from what the browser claims. */
function sniff(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  return null;
}

/** POST the image bytes as the request body (the admin screen shrinks the photo first). Returns its address. */
export async function POST(req: Request) {
  const no = await adminRefusal();
  if (no) return no;
  const bytes = new Uint8Array(await req.arrayBuffer());
  if (bytes.length === 0 || bytes.length > MAX) return Response.json({ error: 'size', message: 'התמונה גדולה מדי. נסו תמונה אחרת.' }, { status: 400 });
  const mime = sniff(bytes);
  if (!mime) return Response.json({ error: 'type', message: 'אפשר להעלות רק תמונות (JPG, PNG, WEBP).' }, { status: 400 });
  const id = randomBytes(9).toString('hex');
  await q('insert into images (id, mime, bytes) values ($1, $2, $3)', [id, mime, Buffer.from(bytes)]);
  return Response.json({ url: `/api/img/${id}` });
}
