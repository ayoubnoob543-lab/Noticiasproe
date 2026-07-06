'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { ArticleCard } from '@/components/articles/article-card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { Article, Category } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = React.useState(query);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [results, setResults] = React.useState<Article[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setInputValue(query);
  }, [query]);

  React.useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('priority', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setCategories(
            data.map((c) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
              description: c.description || '',
              color: c.color || '#3b82f6',
              icon: c.icon || undefined,
              parentId: c.parent_id,
            }))
          );
        }
      });
  }, []);

  React.useEffect(() => {
    setLoading(true);
    let q = supabase
      .from('articles')
      .select('*, author:authors(*), source:sources(name)')
      .eq('status', 'published');

    if (query) {
      q = q.or(`title.ilike.%${query}%,summary.ilike.%${query}%`);
    }
    if (selectedCategory) {
      q = q.eq('category_slug', selectedCategory);
    }

    q.order('published_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!data) {
          setResults([]);
          setLoading(false);
          return;
        }
        const catMap = new Map(categories.map((c) => [c.slug, c.name]));
        setResults(
          data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            slug: row.slug as string,
            title: row.title as string,
            subtitle: (row.subtitle as string) || '',
            summary: (row.summary as string) || '',
            content: (row.content as string) || '',
            excerpt: (row.excerpt as string) || '',
            metaDescription: (row.meta_description as string) || '',
            image: (row.image as string) || '',
            imageAlt: (row.image_alt as string) || '',
            category: catMap.get(row.category_slug as string) || (row.category_slug as string),
            categorySlug: row.category_slug as string,
            subcategory: (row.subcategory_slug as string) || undefined,
            tags: (row.tags as string[]) || [],
            author: {
              id: (row.author as { id?: string })?.id || '',
              name: (row.author as { name?: string })?.name || '',
              avatar: (row.author as { avatar?: string })?.avatar || '',
              bio: (row.author as { bio?: string })?.bio || '',
              role: (row.author as { role?: string })?.role || '',
            },
            publishedAt: row.published_at as string,
            updatedAt: (row.updated_at as string) || undefined,
            readingTime: row.reading_time as number,
            views: row.views as number,
            comments: row.comments_count as number,
            shares: row.shares as number,
            isBreaking: row.is_breaking as boolean,
            isFeatured: row.is_featured as boolean,
            isTrending: row.is_trending as boolean,
            source: (row.source as { name?: string })?.name || '',
            sourceUrl: (row.source_url as string) || '',
          }))
        );
        setLoading(false);
      });
  }, [query, selectedCategory, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="container-news py-6">
      <Breadcrumbs items={[{ label: 'Buscar' }]} className="mb-6" />

      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-black mb-4">
          Buscar noticias
        </h1>
        <form onSubmit={handleSubmit} className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Busca noticias, equipos, temas..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-11 h-12 text-base"
            autoFocus
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
            Buscar
          </Button>
        </form>
      </header>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filtrar por categoría:
        </span>
        <button
          onClick={() => setSelectedCategory('')}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent hover:bg-accent/80'
          }`}
        >
          Todas
        </button>
        {categories.filter((c) => !c.parentId).map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              selectedCategory === cat.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent hover:bg-accent/80'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-muted-foreground">
        {loading ? (
          <p>Buscando...</p>
        ) : query ? (
          <p>
            {results.length} resultado{results.length !== 1 ? 's' : ''} para{' '}
            <span className="font-semibold text-foreground">"{query}"</span>
          </p>
        ) : (
          <p>{results.length} noticias disponibles</p>
        )}
      </div>

      {results.length === 0 && !loading ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">No se encontraron resultados</p>
          <p className="text-muted-foreground">
            Prueba con otros términos de búsqueda o explora nuestras categorías.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} showExcerpt />
          ))}
        </div>
      )}
    </div>
  );
}
