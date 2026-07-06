/*
# Add more RSS sources for better news coverage

1. New Sources Added
- El Pais (general/es)
- El Mundo (general/es)
- 20minutos (general/es)
- El Confidencial (general/es)
- Sport (deportes/es)
- Estadio Deportivo (deportes/es)
- Xataka (tecnologia/es)
- Genbeta (tecnologia/es)
- Cinco Días (economia/es)
- Expansión (economia/es)
- El Pais Tecnologia (tecnologia/es)
- BBC Mundo (internacional/es)
- RTVE (general/es)
- La Vanguardia (general/es)
- ABC (general/es)
- El Economista (economia/es)
- Vandal (videojuegos/es)
- Eurogamer ES (videojuegos/es)
- SensaCine (entretenimiento/es)
- eCartelera (entretenimiento/es)
2. Notes
- All new sources are RSS type (no API key required)
- All are Spanish language for direct publishing
- Priorities range from 5-9 based on relevance
- TechCrunch re-enabled as it's a popular tech source
*/

DO $$
DECLARE
  v_source RECORD;
BEGIN
  -- Re-enable TechCrunch
  UPDATE sources SET is_active = true WHERE name = 'TechCrunch';

  -- Insert new RSS sources if they don't exist
  INSERT INTO sources (name, url, type, category, priority, is_active, language, fetch_interval_seconds, articles_fetched, errors_count, config)
  VALUES
    ('El País', 'https://feeds.elpais.com/mrss-s/pages/elpais/portada', 'rss', 'General', 10, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('El Mundo', 'https://e00-elmundo.uecdn.es/rss/portada.xml', 'rss', 'General', 10, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('20minutos', 'https://www.20minutos.es/rss/', 'rss', 'General', 9, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('El Confidencial', 'https://rss.elconfidencial.com/mrss/portada', 'rss', 'General', 9, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('La Vanguardia', 'https://www.lavanguardia.com/rss/home.xml', 'rss', 'General', 9, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('ABC', 'https://www.abc.es/rss/feeds/abcPortada.xml', 'rss', 'General', 9, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('RTVE', 'https://www.rtve.es/rss/noticias', 'rss', 'General', 8, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('Sport', 'https://www.sport.es/rss/rss.xml', 'rss', 'Deportes', 8, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('Estadio Deportivo', 'https://www.estadiodeportivo.com/rss.html', 'rss', 'Deportes', 7, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('Xataka', 'https://www.xataka.com/rss.xml', 'rss', 'Tecnología', 8, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('Genbeta', 'https://www.genbeta.com/rss.xml', 'rss', 'Tecnología', 7, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('El País Tecnología', 'https://feeds.elpais.com/mrss-s/pages/elpais/tecnologia.html', 'rss', 'Tecnología', 7, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('Cinco Días', 'https://cincodias.elpais.com/rss/cincodias/', 'rss', 'Economía', 8, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('Expansión', 'https://www.expansion.com/rss/portada.xml', 'rss', 'Economía', 8, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('El Economista', 'https://www.eleconomista.com/rss/', 'rss', 'Economía', 7, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('BBC Mundo', 'https://feeds.bbci.co.uk/mundo/rss.xml', 'rss', 'Internacional', 8, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('Vandal', 'https://vandal.elespanol.com/xml.rss', 'rss', 'Videojuegos', 6, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('Eurogamer ES', 'https://www.eurogamer.es/rss', 'rss', 'Videojuegos', 6, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('SensaCine', 'https://www.sensacine.com/rss/noticias.xml', 'rss', 'Entretenimiento', 6, true, 'es', 1800, 0, 0, '{}'::jsonb),
    ('eCartelera', 'https://www.ecartelera.com/rss/noticias.xml', 'rss', 'Entretenimiento', 6, true, 'es', 1800, 0, 0, '{}'::jsonb)
  ON CONFLICT DO NOTHING;
END $$;
