-- Create app_versions table for version management
CREATE TABLE IF NOT EXISTS app_versions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  version TEXT NOT NULL UNIQUE,
  is_current BOOLEAN DEFAULT false,
  force_update BOOLEAN DEFAULT false,
  release_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on is_current for faster queries
CREATE INDEX IF NOT EXISTS idx_app_versions_is_current ON app_versions(is_current);

-- Insert initial version (update this to match your current app version)
INSERT INTO app_versions (version, is_current, release_notes)
VALUES ('1.0.0', true, 'Initial release')
ON CONFLICT (version) DO NOTHING;

-- Add RLS policies if needed
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read app versions (needed for version check)
CREATE POLICY "Allow public read access to app_versions"
  ON app_versions
  FOR SELECT
  USING (true);

-- Only allow authenticated users with admin role to update
CREATE POLICY "Allow admin to update app_versions"
  ON app_versions
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Only allow authenticated users with admin role to insert
CREATE POLICY "Allow admin to insert app_versions"
  ON app_versions
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

