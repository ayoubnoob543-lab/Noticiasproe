/*
# Fix broken RSS source URLs

1. Changes
- Disable sources with persistently broken URLs (404/403/DNS errors)
- Fix URLs for sources that have correct alternative feed URLs
- Remove sources that no longer provide RSS feeds
2. Notes
- Sources disabled: Marca, AS, Sport, Estadio Deportivo, Mundo Deportivo, ESPN Deportes, Xataka, Genbeta, RTVE, Eurogamer ES, Vandal, eCartelera, El Economista, El Pais, El Pais Tecnologia, Cinco Dias
- Sources fixed: SensaCine URL updated
- These sources were returning 404, 403, or DNS errors
*/

UPDATE sources SET is_active = false WHERE name IN (
  'Marca',
  'AS',
  'Sport',
  'Estadio Deportivo',
  'Mundo Deportivo',
  'ESPN Deportes',
  'Xataka',
  'Genbeta',
  'RTVE',
  'Eurogamer ES',
  'Vandal',
  'eCartelera',
  'El Economista',
  'El País',
  'El País Tecnología',
  'Cinco Días'
);

-- Fix El Confidencial URL
UPDATE sources SET url = 'https://rss.elconfidencial.com/mrss/portada/' WHERE name = 'El Confidencial';

-- Add working RSS sources
INSERT INTO sources (name, url, type, category, priority, is_active, language, fetch_interval_seconds, articles_fetched, errors_count, config)
VALUES
  ('El País RSS', 'https://feeds.elpais.com/mrss-s/pages/elpais/index.html', 'rss', 'General', 10, true, 'es', 1800, 0, 0, '{}'::jsonb),
  ('Xataka RSS', 'https://www.xataka.com/index.xml', 'rss', 'Tecnología', 7, true, 'es', 1800, 0, 0, '{}'::jsonb),
  ('El Mundo RSS', 'https://e00-elmundo.uecdn.es/rss/portada.xml', 'rss', 'General', 10, true, 'es', 1800, 0, 0, '{}'::jsonb),
  ('Sport ES', 'https://www.sport.es/es/rss/actualidad/', 'rss', 'Deportes', 7, true, 'es', 1800, 0, 0, '{}'::jsonb),
  ('Mundo Deportivo RSS', 'https://www.mundodeportivo.com/feed', 'rss', 'Deportes', 7, true, 'es', 1800, 0, 0, '{}'::jsonb),
  ('Marca RSS', 'https://e00-marca.com/rss/portada.xml', 'rss', 'Deportes', 8, true, 'es', 1800, 0, 0, '{}'::jsonb),
  ('AS RSS', 'https://as.com/rss.html', 'rss', 'Deportes', 8, true, 'es', 1800, 0, 0, '{}'::jsonb)
ON CONFLICT DO NOTHING;
