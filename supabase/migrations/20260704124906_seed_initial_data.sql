/*
# NoticiasPro — Seed Initial Data

## Overview
Populates the database with:
1. All 31 categories (General, España, Fútbol, LaLiga, Real Madrid, Barcelona,
   Tecnología, IA, Apple, Android, etc.)
2. 8 authors (journalists + AI editors)
3. 16 news sources (RSS, NewsAPI, GNews, TheNewsAPI, Mediastack, Currents,
   Guardian, NYT, Bing News, Google News, Marca, AS, BBC, etc.)
4. 3 football teams (Real Madrid, Barcelona, Atlético de Madrid)
5. 4 sample matches

## Notes
- Uses INSERT ... ON CONFLICT DO NOTHING for idempotency.
- Authors use generated UUIDs, referenced by name in articles.
*/

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (slug, name, description, color, parent_id, priority) VALUES
  ('general', 'General', 'Todas las noticias de actualidad', '#3b82f6', NULL, 100),
  ('espana', 'España', 'Noticias de España', '#dc2626', NULL, 95),
  ('internacional', 'Internacional', 'Noticias del mundo', '#0ea5e9', NULL, 90),
  ('futbol', 'Fútbol', 'Todo el fútbol nacional e internacional', '#16a34a', NULL, 99),
  ('nba', 'NBA', 'Noticias de la NBA', '#f59e0b', NULL, 70),
  ('tenis', 'Tenis', 'Noticias del mundo del tenis', '#22c55e', NULL, 65),
  ('motogp', 'MotoGP', 'Noticias del Campeonato MotoGP', '#ef4444', NULL, 65),
  ('formula-1', 'Fórmula 1', 'Noticias de la Fórmula 1', '#e11d48', NULL, 65),
  ('tecnologia', 'Tecnología', 'Noticias de tecnología e innovación', '#0ea5e9', NULL, 85),
  ('videojuegos', 'Videojuegos', 'Noticias de videojuegos y gaming', '#a855f7', NULL, 60),
  ('economia', 'Economía', 'Noticias de economía y finanzas', '#0d9488', NULL, 80),
  ('salud', 'Salud', 'Noticias de salud y bienestar', '#ec4899', NULL, 55),
  ('ciencia', 'Ciencia', 'Noticias científicas y descubrimientos', '#06b6d4', NULL, 55),
  ('viajes', 'Viajes', 'Noticias de viajes y turismo', '#14b8a6', NULL, 50),
  ('entretenimiento', 'Entretenimiento', 'Noticias de entretenimiento y cultura', '#d946ef', NULL, 75)
ON CONFLICT (slug) DO NOTHING;

-- Child categories (parent = futbol)
INSERT INTO categories (slug, name, description, color, parent_id, priority)
SELECT slug, name, description, color, parent.id, priority
FROM (VALUES
  ('laliga', 'LaLiga', 'Noticias de LaLiga EA Sports', '#f97316', 90),
  ('premier-league', 'Premier League', 'Noticias de la Premier League inglesa', '#7c3aed', 85),
  ('champions-league', 'Champions League', 'Noticias de la UEFA Champions League', '#1e40af', 88),
  ('europa-league', 'Europa League', 'Noticias de la UEFA Europa League', '#f59e0b', 80),
  ('real-madrid', 'Real Madrid', 'Noticias del Real Madrid CF', '#fbbf24', 95),
  ('barcelona', 'Barcelona', 'Noticias del FC Barcelona', '#1e3a8a', 95),
  ('atletico-madrid', 'Atlético de Madrid', 'Noticias del Atlético de Madrid', '#dc2626', 90),
  ('seleccion-espanola', 'Selección Española', 'Noticias de la Selección Española', '#c81d25', 87),
  ('mercado-fichajes', 'Mercado de Fichajes', 'Últimos fichajes y rumores del mercado', '#10b981', 92)
) AS v(slug, name, description, color, priority)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'futbol') parent
ON CONFLICT (slug) DO NOTHING;

-- Child categories (parent = tecnologia)
INSERT INTO categories (slug, name, description, color, parent_id, priority)
SELECT slug, name, description, color, parent.id, priority
FROM (VALUES
  ('ia', 'IA', 'Inteligencia Artificial y machine learning', '#8b5cf6', 90),
  ('apple', 'Apple', 'Noticias de Apple, iPhone, Mac y más', '#64748b', 85),
  ('android', 'Android', 'Noticias del mundo Android', '#22c55e', 80)
) AS v(slug, name, description, color, priority)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'tecnologia') parent
ON CONFLICT (slug) DO NOTHING;

-- Child categories (parent = economia)
INSERT INTO categories (slug, name, description, color, parent_id, priority)
SELECT slug, name, description, color, parent.id, priority
FROM (VALUES
  ('negocios', 'Negocios', 'Noticias de empresas y negocios', '#0284c7', 80)
) AS v(slug, name, description, color, priority)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'economia') parent
ON CONFLICT (slug) DO NOTHING;

-- Child categories (parent = entretenimiento)
INSERT INTO categories (slug, name, description, color, parent_id, priority)
SELECT slug, name, description, color, parent.id, priority
FROM (VALUES
  ('streaming', 'Streaming', 'Noticias de plataformas de streaming', '#f43f5e', 85),
  ('series', 'Series', 'Noticias de series de TV', '#8b5cf6', 80),
  ('peliculas', 'Películas', 'Noticias de cine y películas', '#f59e0b', 80)
) AS v(slug, name, description, color, priority)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'entretenimiento') parent
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AUTHORS
-- ============================================================
INSERT INTO authors (name, avatar, bio, role) VALUES
  ('Carlos Martínez', 'https://images.pexels.com/photos/2206170/pexels-photo-2206170.jpeg?auto=compress&cs=tinysrgb&w=150', 'Editor jefe de Deportes. Especialista en fútbol internacional y LaLiga.', 'Editor Jefe Deportes'),
  ('Laura Sánchez', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', 'Periodista de tecnología e IA. Cubre los avances en inteligencia artificial.', 'Editora Tecnología'),
  ('Javier Ruiz', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', 'Corresponsal internacional. Cubre Europa y Oriente Medio.', 'Corresponsal Internacional'),
  ('María García', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150', 'Especialista en economía y mercados financieros.', 'Editora Economía'),
  ('Diego Fernández', 'https://images.pexels.com/photos/1222298/pexels-photo-1222298.jpeg?auto=compress&cs=tinysrgb&w=150', 'Periodista de motor. Apasionado de la Fórmula 1 y MotoGP.', 'Editor Motor'),
  ('Sofía López', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150', 'Cubre el mundo del entretenimiento, cine y streaming.', 'Editora Entretenimiento'),
  ('Pablo Ortega', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150', 'Especialista en NBA y baloncesto internacional.', 'Editor NBA'),
  ('Elena Torres', 'https://images.pexels.com/photos/38554/girls-fashion-fashion-photography-38554.jpeg?auto=compress&cs=tinysrgb&w=150', 'Periodista de ciencia y salud. Doctora en biomedicina.', 'Editora Ciencia y Salud')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SOURCES
-- ============================================================
INSERT INTO sources (name, url, type, category, priority, is_active, language, fetch_interval_seconds, config) VALUES
  ('Marca', 'https://e00-marca.com/rss/portada.xml', 'rss', 'Deportes', 10, true, 'es', 1800, '{}'),
  ('AS', 'https://as.com/rss/portada.html', 'rss', 'Deportes', 9, true, 'es', 1800, '{}'),
  ('Mundo Deportivo', 'https://www.mundodeportivo.com/feed', 'rss', 'Deportes', 8, true, 'es', 1800, '{}'),
  ('BBC News', 'https://feeds.bbci.co.uk/news/rss.xml', 'rss', 'Internacional', 9, true, 'en', 1800, '{}'),
  ('The Guardian', 'https://content.guardianapis.com', 'guardian', 'Internacional', 8, true, 'en', 3600, '{}'),
  ('New York Times', 'https://api.nytimes.com/svc/news/v3/content/all/all.json', 'nyt', 'Internacional', 9, true, 'en', 3600, '{}'),
  ('NewsAPI', 'https://newsapi.org/v2/top-headlines', 'newsapi', 'General', 7, true, 'es', 1800, '{"country": "es"}'),
  ('GNews', 'https://gnews.io/api/v4/top-headlines', 'gnews', 'General', 7, true, 'es', 1800, '{"country": "es"}'),
  ('TheNewsAPI', 'https://api.thenewsapi.com/v1/news/top', 'thenewsapi', 'General', 6, true, 'es', 1800, '{"language": "es"}'),
  ('Mediastack', 'http://api.mediastack.com/v1/news', 'mediastack', 'General', 6, true, 'es', 1800, '{"countries": "es"}'),
  ('Currents API', 'https://api.currentsapi.services/v1/latest-news', 'currents', 'General', 5, true, 'es', 1800, '{"language": "es"}'),
  ('Bing News', 'https://api.bing.microsoft.com/v7.0/news/search', 'bing', 'General', 7, true, 'es', 1800, '{"mkt": "es-ES"}'),
  ('Google News ES', 'https://news.google.com/rss?hl=es&gl=ES&ceid=ES:es', 'google', 'General', 8, true, 'es', 1800, '{}'),
  ('ESPN Deportes', 'https://www.espn.com/es/deportes/rss', 'rss', 'Deportes', 7, true, 'es', 1800, '{}'),
  ('The Verge', 'https://www.theverge.com/rss/index.xml', 'rss', 'Tecnología', 8, true, 'en', 1800, '{}'),
  ('TechCrunch', 'https://techcrunch.com/feed', 'rss', 'Tecnología', 7, false, 'en', 1800, '{}')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TEAMS
-- ============================================================
INSERT INTO teams (name, short_name, slug, league, logo, colors, stadium, manager, position, played, won, drawn, lost, points) VALUES
  ('Real Madrid', 'RMA', 'real-madrid', 'LaLiga', 'https://images.pexels.com/photos/46798/pexels-photo-46798.jpeg?auto=compress&cs=tinysrgb&w=200', '#FEBE10', 'Santiago Bernabéu', 'Carlo Ancelotti', 1, 38, 28, 6, 4, 90),
  ('FC Barcelona', 'BAR', 'barcelona', 'LaLiga', 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=200', '#A50044', 'Spotify Camp Nou', 'Xavi Hernández', 2, 38, 26, 7, 5, 85),
  ('Atlético de Madrid', 'ATM', 'atletico-madrid', 'LaLiga', 'https://images.pexels.com/photos/47730/pexels-photo-47730.jpeg?auto=compress&cs=tinysrgb&w=200', '#CB3524', 'Cívitas Metropolitano', 'Diego Simeone', 3, 38, 24, 8, 6, 80)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- MATCHES
-- ============================================================
INSERT INTO matches (home_team, away_team, home_score, away_score, date, status, competition, venue) VALUES
  ('Real Madrid', 'FC Barcelona', 3, 1, '2026-07-04T20:00:00Z', 'finished', 'LaLiga', 'Santiago Bernabéu'),
  ('Atlético de Madrid', 'Sevilla', 2, 0, '2026-07-04T18:00:00Z', 'finished', 'LaLiga', 'Cívitas Metropolitano'),
  ('Manchester City', 'Liverpool', NULL, NULL, '2026-07-05T17:30:00Z', 'scheduled', 'Premier League', 'Etihad Stadium'),
  ('Bayern Munich', 'Borussia Dortmund', NULL, NULL, '2026-07-05T20:00:00Z', 'scheduled', 'Bundesliga', 'Allianz Arena')
ON CONFLICT DO NOTHING;
