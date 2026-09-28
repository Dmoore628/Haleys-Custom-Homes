import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';
import { projectsSeed, seedMedia } from '@/lib/seed';

/**
 * The portfolio database: any PostgreSQL server, reached through one connection string in
 * DATABASE_URL (Neon, Supabase, RDS, Cloud SQL or self-hosted all work unchanged). Without it the
 * site renders from content/projects.json and the admin reports that no database is connected.
 */
export function databaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

export function hasDatabase(): boolean {
  return Boolean(databaseUrl());
}

type Sql = postgres.Sql<Record<string, never>>;
let client: Sql | null = null;

/** The shared client, created on first use (never at import, so builds don't need a database). */
export function sql(): Sql {
  if (!client) {
    const url = databaseUrl();
    if (!url) throw new Error('DATABASE_URL is not set');
    const local = /localhost|127\.0\.0\.1/.test(url);
    client = postgres(url, {
      max: 5,
      idle_timeout: 20,
      // Poolers such as Neon's and PgBouncer don't support prepared statements across sessions.
      prepare: false,
      ssl: local ? false : 'require',
      // Idempotent setup ("already exists, skipping") is expected; don't log it.
      onnotice: () => undefined,
    }) as Sql;
  }
  return client;
}

let ready: Promise<void> | null = null;

/**
 * Applies db/schema.sql (idempotent) and, the first time only, fills an empty projects table
 * from content/projects.json. Runs once per server instance, before the first query.
 */
export function ensureDatabase(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const schema = await readFile(path.join(process.cwd(), 'db', 'schema.sql'), 'utf8');
      // One transaction under an advisory lock, so several server instances starting at once
      // can't race each other creating tables or seeding.
      await sql().begin(async (tx) => {
        await tx`SELECT pg_advisory_xact_lock(4207761)`;
        await tx.unsafe(schema);
        const [{ count }] = await tx<
          { count: string }[]
        >`SELECT count(*)::text AS count FROM projects`;
        if (Number(count) === 0) await seedProjects(tx as unknown as Sql);
      });
    })().catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready;
}

async function seedProjects(db: Sql) {
  let order = 0;
  for (const p of projectsSeed) {
    order += 1;
    await db`
      INSERT INTO projects (slug, name, category, location, completion_year, square_footage,
        build_duration, tagline, description, credits, source, featured, published, sort_order,
        cover, images, hero_video)
      VALUES (${p.slug}, ${p.name}, ${p.category}, ${p.location ?? null},
        ${p.completionYear ?? null}, ${p.squareFootage ?? null}, ${p.buildDuration ?? null},
        ${p.tagline ?? null}, ${p.description}, ${db.json(p.credits)}, ${p.source}, ${p.featured},
        ${p.published}, ${order}, ${db.json(seedMedia(p.coverImage) as never)},
        ${db.json([p.coverImage, ...p.images].map(seedMedia) as never)}, ${p.heroVideo})
      ON CONFLICT (slug) DO NOTHING`;
  }
}
