import { ArticleCard } from '@/components/articles/article-card';
import { HeroSlider } from '@/components/articles/hero-slider';
import { SectionHeader } from '@/components/section-header';
import { TrendingSidebar } from '@/components/articles/trending-sidebar';
import { CategoryGrid } from '@/components/articles/category-grid';
import { FootballSection } from '@/components/articles/football-section';
import { AdSlot } from '@/components/ads/ad-slot';
import {
  getArticles,
  getCategories,
} from '@/lib/db';
import { Flame } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const [featured, trending, mostRead, mostCommented, latest, categories] = await Promise.all([
    getArticles({ isFeatured: true, limit: 5 }),
    getArticles({ isTrending: true, limit: 4 }),
    getArticles({ orderBy: 'views', limit: 5 }),
    getArticles({ orderBy: 'comments_count', limit: 5 }),
    getArticles({ limit: 14, orderBy: 'published_at' }),
    getCategories(),
  ]);

  const heroArticles = featured.length > 0 ? featured : latest.slice(0, 5);

  return (
    <div className="container-news py-6">
      {/* Hero section */}
      <section className="grid gap-6 lg:grid-cols-3 mb-12">
        <div className="lg:col-span-2">
          <HeroSlider articles={heroArticles} />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-serif text-xl font-bold flex items-center gap-2">
            <Flame className="h-5 w-5 text-destructive" />
            Destacadas
          </h2>
          <div className="flex flex-col gap-4">
            {(featured.length > 0 ? featured : latest.slice(0, 4)).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="horizontal"
                showCategory={false}
              />
            ))}
          </div>
        </div>
      </section>

      <AdSlot slot="home-top" className="mb-12" />

      {/* Latest news grid */}
      <section className="mb-12">
        <SectionHeader title="Últimas noticias" href="/general" accentColor="#3b82f6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.slice(0, 6).map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              priority={idx < 3}
              showExcerpt
            />
          ))}
        </div>
      </section>

      {/* Trending + sidebar */}
      <section className="grid gap-8 lg:grid-cols-3 mb-12">
        <div className="lg:col-span-2">
          <SectionHeader title="Tendencias" href="/tendencias" accentColor="#dc2626" />
          <div className="grid gap-6 sm:grid-cols-2">
            {trending.map((article) => (
              <ArticleCard key={article.id} article={article} showExcerpt />
            ))}
          </div>
        </div>
        <TrendingSidebar
          mostRead={mostRead}
          mostCommented={mostCommented}
        />
      </section>

      <AdSlot slot="home-middle" className="mb-12" />

      {/* Football section */}
      <FootballSection />

      {/* Categories grid */}
      <section className="mb-12">
        <SectionHeader title="Explora por categorías" accentColor="#0ea5e9" />
        <CategoryGrid />
      </section>

      {/* More news */}
      <section className="mb-12">
        <SectionHeader title="Más noticias" href="/general" accentColor="#16a34a" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latest.slice(6, 14).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mb-12">
        <div className="rounded-xl news-gradient p-8 sm:p-12 text-white text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-black mb-3">
            No te pierdas ninguna noticia
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-6">
            Suscríbete a nuestro newsletter y recibe las noticias más importantes cada mañana en tu correo.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center justify-center rounded-md bg-white text-primary px-6 py-3 font-bold hover:bg-white/90 transition-colors"
          >
            Suscribirme gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
