import type { Category } from './types';

export const categories: Category[] = [
  { id: 'general', slug: 'general', name: 'General', description: 'Todas las noticias de actualidad', color: '#3b82f6' },
  { id: 'espana', slug: 'espana', name: 'España', description: 'Noticias de España', color: '#dc2626' },
  { id: 'internacional', slug: 'internacional', name: 'Internacional', description: 'Noticias del mundo', color: '#0ea5e9' },
  { id: 'futbol', slug: 'futbol', name: 'Fútbol', description: 'Todo el fútbol nacional e internacional', color: '#16a34a' },
  { id: 'laliga', slug: 'laliga', name: 'LaLiga', description: 'Noticias de LaLiga EA Sports', color: '#f97316', parentId: 'futbol' },
  { id: 'premier-league', slug: 'premier-league', name: 'Premier League', description: 'Noticias de la Premier League inglesa', color: '#7c3aed', parentId: 'futbol' },
  { id: 'champions-league', slug: 'champions-league', name: 'Champions League', description: 'Noticias de la UEFA Champions League', color: '#1e40af', parentId: 'futbol' },
  { id: 'europa-league', slug: 'europa-league', name: 'Europa League', description: 'Noticias de la UEFA Europa League', color: '#f59e0b', parentId: 'futbol' },
  { id: 'real-madrid', slug: 'real-madrid', name: 'Real Madrid', description: 'Noticias del Real Madrid CF', color: '#fbbf24', parentId: 'futbol' },
  { id: 'barcelona', slug: 'barcelona', name: 'Barcelona', description: 'Noticias del FC Barcelona', color: '#1e3a8a', parentId: 'futbol' },
  { id: 'atletico-madrid', slug: 'atletico-madrid', name: 'Atlético de Madrid', description: 'Noticias del Atlético de Madrid', color: '#dc2626', parentId: 'futbol' },
  { id: 'seleccion-espanola', slug: 'seleccion-espanola', name: 'Selección Española', description: 'Noticias de la Selección Española', color: '#c81d25', parentId: 'futbol' },
  { id: 'mercado-fichajes', slug: 'mercado-fichajes', name: 'Mercado de Fichajes', description: 'Últimos fichajes y rumores del mercado', color: '#10b981', parentId: 'futbol' },
  { id: 'nba', slug: 'nba', name: 'NBA', description: 'Noticias de la NBA', color: '#f59e0b' },
  { id: 'tenis', slug: 'tenis', name: 'Tenis', description: 'Noticias del mundo del tenis', color: '#22c55e' },
  { id: 'motogp', slug: 'motogp', name: 'MotoGP', description: 'Noticias del Campeonato MotoGP', color: '#ef4444' },
  { id: 'formula-1', slug: 'formula-1', name: 'Fórmula 1', description: 'Noticias de la Fórmula 1', color: '#e11d48' },
  { id: 'tecnologia', slug: 'tecnologia', name: 'Tecnología', description: 'Noticias de tecnología e innovación', color: '#0ea5e9' },
  { id: 'ia', slug: 'ia', name: 'IA', description: 'Inteligencia Artificial y machine learning', color: '#8b5cf6', parentId: 'tecnologia' },
  { id: 'apple', slug: 'apple', name: 'Apple', description: 'Noticias de Apple, iPhone, Mac y más', color: '#64748b', parentId: 'tecnologia' },
  { id: 'android', slug: 'android', name: 'Android', description: 'Noticias del mundo Android', color: '#22c55e', parentId: 'tecnologia' },
  { id: 'videojuegos', slug: 'videojuegos', name: 'Videojuegos', description: 'Noticias de videojuegos y gaming', color: '#a855f7' },
  { id: 'economia', slug: 'economia', name: 'Economía', description: 'Noticias de economía y finanzas', color: '#0d9488' },
  { id: 'negocios', slug: 'negocios', name: 'Negocios', description: 'Noticias de empresas y negocios', color: '#0284c7', parentId: 'economia' },
  { id: 'salud', slug: 'salud', name: 'Salud', description: 'Noticias de salud y bienestar', color: '#ec4899' },
  { id: 'ciencia', slug: 'ciencia', name: 'Ciencia', description: 'Noticias científicas y descubrimientos', color: '#06b6d4' },
  { id: 'viajes', slug: 'viajes', name: 'Viajes', description: 'Noticias de viajes y turismo', color: '#14b8a6' },
  { id: 'entretenimiento', slug: 'entretenimiento', name: 'Entretenimiento', description: 'Noticias de entretenimiento y cultura', color: '#d946ef' },
  { id: 'streaming', slug: 'streaming', name: 'Streaming', description: 'Noticias de plataformas de streaming', color: '#f43f5e', parentId: 'entretenimiento' },
  { id: 'series', slug: 'series', name: 'Series', description: 'Noticias de series de TV', color: '#8b5cf6', parentId: 'entretenimiento' },
  { id: 'peliculas', slug: 'peliculas', name: 'Películas', description: 'Noticias de cine y películas', color: '#f59e0b', parentId: 'entretenimiento' },
];

export const mainNavCategories = categories.filter(c => !c.parentId);

export const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);

export const getChildCategories = (parentSlug: string) =>
  categories.filter(c => c.parentId === parentSlug);

export const footballCategories = categories.filter(c => c.parentId === 'futbol');
