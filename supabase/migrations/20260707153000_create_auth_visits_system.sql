/*
# Create Auth and Visits Tracking System

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, the user's email)
  - `is_admin` (boolean, defaults to false, true for ayoubnoob543@gmail.com)
  - `created_at` (timestamp)
  
- `visits`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, nullable for anonymous visits)
  - `page_url` (text, the URL visited)
  - `page_title` (text, title of the page)
  - `referrer` (text, where the visitor came from)
  - `user_agent` (text, browser/device info)
  - `ip_address` (text, visitor's IP)
  - `country` (text, visitor's country)
  - `city` (text, visitor's city)
  - `visited_at` (timestamp)
  
- `daily_stats`
  - `id` (uuid, primary key)
  - `date` (date, unique)
  - `total_visits` (integer)
  - `unique_visitors` (integer)
  - `authenticated_visits` (integer)
  - `anonymous_visits` (integer)

2. Functions
- `get_connected_users_count()`: Returns count of users active in last 5 minutes
- `get_today_stats()`: Returns today's visit statistics

3. Security
- Enable RLS on all tables.
- `profiles`: Users can read/update their own profile. Admin can read all.
- `visits`: Authenticated users can insert visits; admin can read all.
- `daily_stats`: Admin can read all; authenticated users can insert/update.

4. Important Notes
- Admin email: ayoubnoob543@gmail.com
- The visits table tracks both authenticated and anonymous visitors
- Daily stats are aggregated for performance
- Automatic profile creation on user signup via trigger
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create visits table (if not exists from previous migration)
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  page_url text NOT NULL,
  page_title text,
  referrer text,
  user_agent text,
  ip_address text,
  country text,
  city text,
  visited_at timestamptz DEFAULT now()
);

-- Create daily_visit_stats table (if not exists)
CREATE TABLE IF NOT EXISTS daily_visit_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  total_visits integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  authenticated_visits integer DEFAULT 0,
  anonymous_visits integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_visit_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "admin_read_all_profiles" ON profiles;
CREATE POLICY "admin_read_all_profiles" ON profiles FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Visits policies
DROP POLICY IF EXISTS "authenticated_insert_visits" ON visits;
CREATE POLICY "authenticated_insert_visits" ON visits FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_visits" ON visits;
CREATE POLICY "anon_insert_visits" ON visits FOR INSERT
  TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_all_visits" ON visits;
CREATE POLICY "admin_read_all_visits" ON visits FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Daily visit stats policies
DROP POLICY IF EXISTS "admin_read_daily_stats" ON daily_visit_stats;
CREATE POLICY "admin_read_daily_stats" ON daily_visit_stats FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "authenticated_insert_daily_stats" ON daily_visit_stats;
CREATE POLICY "authenticated_insert_daily_stats" ON daily_visit_stats FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_daily_stats" ON daily_visit_stats;
CREATE POLICY "authenticated_update_daily_stats" ON daily_visit_stats FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_visit_stats(date DESC);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.email = 'ayoubnoob543@gmail.com')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get connected users (users who visited in last 5 minutes)
CREATE OR REPLACE FUNCTION get_connected_users_count()
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT user_id)::integer
    FROM visits
    WHERE visited_at > NOW() - INTERVAL '5 minutes'
    AND user_id IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get today's stats
CREATE OR REPLACE FUNCTION get_today_stats()
RETURNS TABLE (
  total_visits integer,
  unique_visitors bigint,
  authenticated_visits integer,
  anonymous_visits integer,
  connected_users integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT total_visits FROM daily_visit_stats WHERE date = CURRENT_DATE), 0)::integer,
    COALESCE((SELECT COUNT(DISTINCT user_id) FROM visits WHERE visited_at::date = CURRENT_DATE), 0),
    COALESCE((SELECT authenticated_visits FROM daily_visit_stats WHERE date = CURRENT_DATE), 0)::integer,
    COALESCE((SELECT anonymous_visits FROM daily_visit_stats WHERE date = CURRENT_DATE), 0)::integer,
    get_connected_users_count();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_connected_users_count() TO authenticated;
GRANT EXECUTE ON FUNCTION get_today_stats() TO authenticated;

-- Set admin flag for admin email
UPDATE profiles SET is_admin = true WHERE email = 'ayoubnoob543@gmail.com';