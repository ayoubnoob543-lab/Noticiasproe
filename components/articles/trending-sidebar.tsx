import Link from 'next/link';
import { Eye, MessageCircle, TrendingUp } from 'lucide-react';
import type { Article } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

interface TrendingSidebarProps {
  mostRead: Article[];
  mostCommented: Article[];
  className?: string;
}

export function TrendingSidebar({ mostRead, mostCommented, className }: TrendingSidebarProps) {
  return (
    <aside className={cn('space-y-8', className)}>
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-serif text-lg font-bold flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5 text-primary" />
          Lo más leído
        </h3>
        <ol className="space-y-4">
          {mostRead.map((article, idx) => (
            <li key={article.id} className="flex gap-3">
              <span className="font-serif text-3xl font-black text-primary/30 leading-none shrink-0 w-8">
                {idx + 1}
              </span>
              <Link
                href={`/noticia/${article.slug}`}
                className="group flex-1"
              >
                <h4 className="font-bold text-sm leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {formatNumber(article.views)} lecturas
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-serif text-lg font-bold flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-primary" />
          Lo más comentado
        </h3>
        <ol className="space-y-4">
          {mostCommented.map((article, idx) => (
            <li key={article.id} className="flex gap-3">
              <span className="font-serif text-3xl font-black text-primary/30 leading-none shrink-0 w-8">
                {idx + 1}
              </span>
              <Link
                href={`/noticia/${article.slug}`}
                className="group flex-1"
              >
                <h4 className="font-bold text-sm leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageCircle className="h-3 w-3" />
                  {formatNumber(article.comments)} comentarios
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-lg news-gradient p-5 text-white">
        <h3 className="font-serif text-lg font-bold flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5" />
          Tendencias
        </h3>
        <p className="text-sm text-white/90 mb-4">
          Las noticias que están marcando tendencia ahora mismo.
        </p>
        <Link
          href="/tendencias"
          className="inline-flex items-center text-sm font-bold underline-offset-4 hover:underline"
        >
          Ver todas las tendencias
        </Link>
      </div>
    </aside>
  );
}
