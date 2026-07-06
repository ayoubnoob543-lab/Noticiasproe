import Link from 'next/link';
import { mainNavCategories } from '@/lib/categories';
import { getArticles } from '@/lib/db';

export async function CategoryGrid() {
  const articles = await getArticles({ limit: 200, orderBy: 'published_at' });

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {mainNavCategories.map((cat) => {
        const count = articles.filter(
          (a) => a.categorySlug === cat.slug || a.subcategory === cat.slug
        ).length;
        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition-all hover:shadow-lg hover:border-primary/40"
          >
            <div
              className="absolute top-0 left-0 h-1 w-full transition-all group-hover:h-2"
              style={{ backgroundColor: cat.color }}
            />
            <h3 className="font-serif text-lg font-bold mb-1 group-hover:text-primary transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {cat.description}
            </p>
            <span className="text-xs font-semibold text-muted-foreground">
              {count} artículos
            </span>
          </Link>
        );
      })}
    </div>
  );
}
