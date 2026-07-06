/*
# Create settings table for API keys and configuration

1. New Tables
- `settings`
  - `key` (text, primary key) - the setting name (e.g. 'NEWSAPI_KEY')
  - `value` (text) - the setting value (encrypted at rest by Supabase)
  - `category` (text) - grouping ('api_keys', 'general', 'automation')
  - `description` (text) - human-readable description
  - `is_secret` (boolean) - whether this is a sensitive value
  - `updated_at` (timestamp)
2. Security
- RLS enabled
- NO policies for anon or authenticated roles - only the service role (used by edge functions) can access
- This prevents the frontend from ever reading API keys
3. Notes
- Edge functions use the service role key which bypasses RLS
- The frontend anon key cannot read this table at all
*/

CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  description text,
  is_secret boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- No policies = no access for anon or authenticated roles
-- Only the service role (used by edge functions) can read/write, since it bypasses RLS
