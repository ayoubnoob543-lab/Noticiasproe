import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, MessageCircle, Flame } from 'lucide-react';
import type { Article } from '@/lib/types';
import { timeAgo, formatNumber } from '@/lib/format';
import { getCategoryBySlug } from '@/lib/categories';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'horizontal' | 'compact' | 'overlay' | 'minimal';

interface ArticleCardProps {
  article: Article;
  variant?: Variant;
  priority?: boolean;
  showCategory?: boolean;
  showExcerpt?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  variant = 'default',
  priority = false,
  showCategory = true,
  showExcerpt = false,
  className,
}: ArticleCardProps) {
  const category = getCategoryBySlug(article.categorySlug);

  if (variant === 'overlay') {
    return (
      <Link
        href={`/noticia/${article.slug}`}
        className={cn('group relative block overflow-hidden rounded-lg', className)}
      >
        <div className="absolute inset-0">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        <div className="relative flex h-full min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] flex-col justify-end p-5 sm:p-6">
          {showCategory && (
            <span
              className="category-pill mb-3 self-start"
              style={{ backgroundColor: `${category?.color}20`, color: category?.color }}
            >
              {article.category}
            </span>
          )}
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-white mb-2 line-clamp-3 group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          {showExcerpt && (
            <p className="text-sm text-white/80 line-clamp-2 mb-3">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-white/70">
            <span>{article.author.name}</span>
            <span>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
            {article.isBreaking && (
              <span className="ml-auto flex items-center gap-1 rounded bg-destructive px-2 py-0.5 font-bold uppercase text-destructive-foreground">
                <Flame className="h-3 w-3" />
                Última hora
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/noticia/${article.slug}`}
        className={cn('group flex gap-4', className)}
      >
        <div className="relative w-32 sm:w-40 shrink-0 overflow-hidden rounded-md aspect-[4/3]">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          {showCategory && (
            <span
              className="text-xs font-bold uppercase tracking-wide mb-1 inline-block"
              style={{ color: category?.color }}
            >
              {article.category}
            </span>
          )}
          <h3 className="font-serif font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/noticia/${article.slug}`}
        className={cn('group flex gap-3 items-start', className)}
      >
        <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-md">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm leading-snug line-clamp-3 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'minimal') {
    return (
      <Link
        href={`/noticia/${article.slug}`}
        className={cn('group block', className)}
      >
        {showCategory && (
          <span
            className="text-xs font-bold uppercase tracking-wide mb-1 inline-block"
            style={{ color: category?.color }}
          >
            {article.category}
          </span>
        )}
        <h3 className="font-serif font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{timeAgo(article.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatNumber(article.views)}
          </span>
        </div>
      </Link>
    );
  }

  // default
  return (
    <Link
      href={`/noticia/${article.slug}`}
      className={cn('news-card group flex flex-col', className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {article.isBreaking && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded bg-destructive px-2 py-1 text-xs font-bold uppercase text-destructive-foreground">
            <Flame className="h-3 w-3" />
            Última hora
          </span>
        )}
        {showCategory && (
          <span
            className="absolute bottom-3 left-3 rounded px-2 py-1 text-xs font-bold uppercase text-white"
            style={{ backgroundColor: category?.color }}
          >
            {article.category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {showExcerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
        )}
        <div className="mt-auto pt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium">{article.author.name}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <span className="ml-auto flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
