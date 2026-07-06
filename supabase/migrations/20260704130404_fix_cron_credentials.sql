/*
# Fix cron job with correct project URL and anon key

1. Changes
- Drop the incorrectly configured cron job
- Recreate with the correct Supabase project URL and anon key from .env
2. Notes
- The previous migration used placeholder credentials
- This uses the actual project URL and anon key
*/

DO $$
BEGIN
  PERFORM cron.unschedule('fetch-news-automatically');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule(
  'fetch-news-automatically',
  '*/30 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://iuhfldwgvmavptfgwswm.supabase.co/functions/v1/cron-news',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1aGZsZHdndm1hdnB0Zmd3c3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNjM3MjEsImV4cCI6MjA5ODczOTcyMX0.S1WHxMCVnBEzeXj_oC86tOkAkC19x6MERXI7OHZNuTE',
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $$
);
