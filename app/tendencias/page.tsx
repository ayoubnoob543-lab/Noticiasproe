import type { Metadata } from 'next';
import { TrendingUp } from 'lucide-react';
import { ArticleCard } from '@/components/articles/article-card';
import { SectionHeader } from '@/components/section-header';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getArticles } from '@/lib/db';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tendencias — Las noticias más leídas',
  description: 'Descubre las noticias que están marcando tendencia ahora mismo en NoticiasPro.',
  alternates: { canonical: '/tendencias' },
};

export default async function TrendsPage() {
  const [trending, mostRead, mostCommented] = await Promise.all([
    getArticles({ isTrending: true, limit: 6 }),
    getArticles({ orderBy: 'views', limit: 6 }),
    getArticles({ orderBy: 'comments_count', limit: 6 }),
  ]);

  return (
    <div className="container-news py-6">
      <Breadcrumbs items={[{ label: 'Tendencias' }]} className="mb-6" />

      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-black flex items-center gap-3 mb-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          Tendencias
        </h1>
        <p className="text-muted-foreground text-lg">
          Las noticias que están marcando tendencia ahora mismo.
        </p>
      </header>

      <section className="mb-12">
        <SectionHeader title="En tendencia" accentColor="#dc2626" />
        {trending.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((article) => (
              <ArticleCard key={article.id} article={article} showExcerpt />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Cargando noticias en tendencia...
          </p>
        )}
      </section>

      <section className="mb-12">
        <SectionHeader title="Lo más leído" accentColor="#0ea5e9" />
        {mostRead.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mostRead.map((article) => (
              <ArticleCard key={article.id} article={article} showExcerpt />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Cargando noticias más leídas...
          </p>
        )}
      </section>

      <section className="mb-12">
        <SectionHeader title="Lo más comentado" accentColor="#8b5cf6" />
        {mostCommented.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mostCommented.map((article) => (
              <ArticleCard key={article.id} article={article} showExcerpt />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Cargando noticias más comentadas...
          </p>
        )}
      </section>
    </div>
  );
}
