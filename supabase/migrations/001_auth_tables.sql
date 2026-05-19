-- ============================================================
-- Run this in Supabase SQL Editor BEFORE testing auth/dashboard
-- ============================================================

-- 1. Students table (linked to auth.users)
CREATE TABLE IF NOT EXISTS students (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL DEFAULT '',
  email         TEXT,
  marks         INTEGER,
  category      TEXT,
  gender        TEXT,
  predicted_rank INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Index for fast lookup
CREATE INDEX IF NOT EXISTS students_phone_idx ON students (phone);

-- 3. Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Users can read/update only their own row
CREATE POLICY "students_own_select" ON students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "students_own_update" ON students
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Service role can do everything (used by API routes)
CREATE POLICY "students_service_insert" ON students
  FOR INSERT WITH CHECK (true);

-- 4. Leads table (write-only for anon capture; service role inserts)
CREATE TABLE IF NOT EXISTS leads (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  phone         TEXT UNIQUE NOT NULL,
  email         TEXT,
  marks         INTEGER NOT NULL DEFAULT 0,
  category      TEXT NOT NULL DEFAULT '',
  gender        TEXT NOT NULL DEFAULT '',
  rank_mid      INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads should not be readable by users
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_no_select" ON leads
  FOR SELECT USING (false);

-- Service role inserts only
CREATE POLICY "leads_service_insert" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "leads_service_update" ON leads
  FOR UPDATE USING (true) WITH CHECK (true);

-- 5. Helper: auto-update updated_at on students
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS students_updated_at ON students;
CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
