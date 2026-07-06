/*
# Set up pg_cron for automatic news fetching

1. Extensions
- Enable pg_cron extension for scheduled job execution
- Enable pg_net extension for HTTP requests from Postgres
2. Scheduled Jobs
- Create a cron job that calls the cron-news edge function every 30 minutes
- The edge function fetches articles from all sources, rewrites them with AI, and publishes them
3. Notes
- The cron job uses pg_net to make an HTTP POST request to the edge function
- The edge function URL is constructed from the SUPABASE_URL env var
- The anon key is used for authentication
*/

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT USAGE ON SCHEMA net TO postgres;

-- Drop existing job if it exists (idempotent)
DO $$
BEGIN
  PERFORM cron.unschedule('fetch-news-automatically');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Schedule the news fetch job to run every 30 minutes
-- The job calls the cron-news edge function which orchestrates:
--   1. fetch-sources: fetches articles from all active sources (RSS, NewsAPI, GNews, etc.)
--   2. rewrite-ai: processes raw articles with AI rewriting and translation
SELECT cron.schedule(
  'fetch-news-automatically',
  '*/30 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://znrphhfwlbjfcfmcahux.supabase.co/functions/v1/cron-news',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucnBoaGZ3bGJqZmNmbWNhaHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTI3MzYsImV4cCI6MjA2NzIxMjczNn0.Qj4Hs2D6j5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5',
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $$
);
