-- Haley Custom Homes portfolio database. Plain PostgreSQL (13+): runs unchanged on Neon, Supabase,
-- AWS RDS, Google Cloud SQL, DigitalOcean or a self-hosted server. Every statement is idempotent,
-- so the site applies this file automatically on first use and it is safe to run again.

CREATE TABLE IF NOT EXISTS projects (
  id               BIGSERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  name             TEXT NOT NULL,
  category         TEXT NOT NULL CHECK (category IN ('new-build', 'remodel')),
  location         TEXT,
  completion_year  TEXT CHECK (completion_year IS NULL OR completion_year ~ '^[0-9]{4}$'),
  square_footage   TEXT,
  build_duration   TEXT,
  tagline          TEXT,
  description      TEXT NOT NULL DEFAULT '',
  credits          JSONB NOT NULL DEFAULT '[]',
  source           TEXT,
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  -- Images are stored as JSON: { src, width, height, color, blurDataURL }. `src` is either a path
  -- under /images (photos shipped with the site) or the URL of an uploaded file in storage.
  cover            JSONB,
  images           JSONB NOT NULL DEFAULT '[]',
  hero_video       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_listing ON projects (published, sort_order);

CREATE TABLE IF NOT EXISTS admins (
  id             BIGSERIAL PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at  TIMESTAMPTZ
);

-- Failed sign-in attempts, for rate limiting. Old rows are pruned on each attempt.
CREATE TABLE IF NOT EXISTS login_attempts (
  key           TEXT NOT NULL,
  attempted_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS login_attempts_key ON login_attempts (key, attempted_at);
