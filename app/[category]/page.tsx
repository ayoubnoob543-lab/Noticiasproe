import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/articles/article-card';
import { SectionHeader } from '@/components/section-header';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { TrendingSidebar } from '@/components/articles/trending-sidebar';
import {
  getCategoryBySlug,
  getChildCategories,
  getArticles,
  getCategories,
} from '@/lib/db';
import { ChevronRight } from 'lucide-react';

interface PageProps {
  params: { category: string };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return {};

  return {
    title: `${category.name} — Noticias de ${category.name}`,
    description: category.description,
    alternates: {
      canonical: `/${category.slug}`,
    },
    openGraph: {
      type: 'website',
      url: `/${category.slug}`,
      title: `${category.name} — NoticiasPro`,
      description: category.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} — NoticiasPro`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const [childCategories, sorted, mostRead, mostCommented] = await Promise.all([
    getChildCategories(category.slug),
    getArticles({ categorySlug: category.slug, limit: 50, orderBy: 'published_at' }),
    getArticles({ orderBy: 'views', limit: 5 }),
    getArticles({ orderBy: 'comments_count', limit: 5 }),
  ]);

  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="container-news py-6">
      <Breadcrumbs items={[{ label: category.name }]} className="mb-6" />

      {/* Category header */}
      <header className="mb-8 rounded-lg overflow-hidden">
        <div
          className="h-2 w-full"
          style={{ backgroundColor: category.color }}
        />
        <div className="bg-card p-6 sm:p-8 border border-border border-t-0 rounded-b-lg">
          <h1 className="font-serif text-3xl sm:text-4xl font-black mb-2">
            {category.name}
          </h1>
          <p className="text-muted-foreground text-lg">{category.description}</p>
        </div>
      </header>

      {/* Child categories */}
      {childCategories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {childCategories.map((child) => (
            <Link
              key={child.slug}
              href={`/${child.slug}`}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              {child.name}
              <ChevronRight className="h-3 w-3" />
            </Link>
          ))}
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            No hay noticias disponibles en esta categoría en este momento.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Las noticias se actualizan automáticamente cada pocos minutos.
          </p>
        </div>
      ) : (
        <>
          {/* Featured + grid */}
          {featured && (
            <section className="grid gap-6 lg:grid-cols-3 mb-8">
              <div className="lg:col-span-2">
                <ArticleCard
                  article={featured}
                  variant="overlay"
                  priority
                  showExcerpt
                />
              </div>
              <div className="grid gap-4">
                {rest.slice(0, 4).map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="horizontal"
                    showCategory={false}
                  />
                ))}
              </div>
            </section>
          )}

          <AdSlot slot={`category-${category.slug}-top`} className="mb-8" />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeader title="Más noticias" accentColor={category.color} />
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.slice(4).map((article) => (
                  <ArticleCard key={article.id} article={article} showExcerpt />
                ))}
              </div>
            </div>
            <TrendingSidebar mostRead={mostRead} mostCommented={mostCommented} />
          </div>
        </>
      )}
    </div>
  );
}
