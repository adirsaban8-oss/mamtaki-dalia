/**
 * The site's database. Postgres on Railway (DATABASE_URL). Server only.
 *
 * For local work without Postgres, set LOCAL_DB to a folder name and an
 * embedded Postgres (PGlite) keeps its files there. With neither variable
 * the site has no database: it shows the starter catalog and the admin
 * says what is missing.
 */
import { seedCatalog } from '@/lib/data/catalogSeed';

type Row = Record<string, unknown>;
type Runner = { query: (sql: string, params?: unknown[]) => Promise<{ rows: Row[] }> };

const g = globalThis as unknown as { __mdDb?: Promise<Runner> };

export const dbEnabled = () => !!(process.env.DATABASE_URL || process.env.LOCAL_DB);

const SCHEMA = `
create table if not exists products (
  id text primary key,
  slug text unique not null,
  data jsonb not null,
  price integer not null default 0,
  in_stock boolean not null default true,
  visible boolean not null default true,
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists images (
  id text primary key,
  mime text not null,
  bytes bytea not null,
  created_at timestamptz not null default now()
);
create table if not exists customers (
  id serial primary key,
  phone text unique not null,
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  terms_at timestamptz,
  marketing_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists otps (
  phone text primary key,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  sent_at timestamptz not null default now(),
  sent_today integer not null default 1
);
create table if not exists orders (
  id serial primary key,
  ref text unique not null,
  customer_id integer references customers(id),
  data jsonb not null,
  total integer not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_created on orders (created_at desc);
create table if not exists broadcasts (
  id serial primary key,
  body text not null,
  recipients integer not null,
  created_at timestamptz not null default now()
);
`;

async function connect(): Promise<Runner> {
  let run: Runner;
  if (process.env.DATABASE_URL) {
    const { Pool } = await import('pg');
    const url = process.env.DATABASE_URL;
    // Railway's private network needs no TLS; its public proxy does.
    // Short limits: an unreachable database must not hold a page for long.
    const pool = new Pool({ connectionString: url, max: 5, connectionTimeoutMillis: 4000, query_timeout: 8000, ssl: /railway\.internal|localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false } });
    run = { query: (sql, params) => pool.query(sql, params as unknown[]) as Promise<{ rows: Row[] }> };
  } else {
    const name = '@electric-sql/pglite';
    const { PGlite } = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ name)) as { PGlite: new (dir: string) => Runner & { exec: (sql: string) => Promise<unknown> } };
    run = new PGlite(process.env.LOCAL_DB as string);
  }
  for (const stmt of SCHEMA.split(';').map((s) => s.trim()).filter(Boolean)) await run.query(stmt);
  // First run: fill the catalog with the starter products the site already shows.
  const n = await run.query('select count(*)::int as n from products');
  if ((n.rows[0].n as number) === 0) {
    let i = 0;
    for (const p of seedCatalog) {
      await run.query('insert into products (id, slug, data, price, in_stock, visible, sort) values ($1,$2,$3,$4,$5,true,$6) on conflict do nothing', [p.id, p.slug, JSON.stringify(p), p.price, p.inStock, i++]);
    }
  }
  return run;
}

export async function q<T = Row>(sql: string, params: unknown[] = []): Promise<T[]> {
  if (!dbEnabled()) throw new Error('no database');
  g.__mdDb ??= connect().catch((e) => {
    g.__mdDb = undefined; // let the next request try again
    throw e;
  });
  const db = await g.__mdDb;
  return (await db.query(sql, params)).rows as T[];
}
