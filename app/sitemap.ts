import type { MetadataRoute } from 'next';
import { getArticles, getCategories, getTeams } from '@/lib/db';

export const runtime = 'nodejs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://noticiaspro.com';
  const now = new Date();

  const [articles, categories, teams] = await Promise.all([
    getArticles({ limit: 500, orderBy: 'published_at' }),
    getCategories(),
    getTeams(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'always', priority: 1 },
    { url: `${baseUrl}/buscar`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/futbol`, lastModified: now, changeFrequency: 'always', priority: 0.9 },
    { url: `${baseUrl}/newsletter`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }));

  const teamPages: MetadataRoute.Sitemap = teams.map((team) => ({
    url: `${baseUrl}/futbol/${team.slug}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/noticia/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...teamPages, ...articlePages];
}