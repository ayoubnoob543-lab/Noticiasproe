'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';
import { getBreakingNews } from '@/lib/data';

export function BreakingNewsBar() {
  const breakingNews = getBreakingNews();
  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-destructive text-destructive-foreground">
      <div className="container-news">
        <div className="flex items-center gap-3 py-2">
          <div className="flex items-center gap-2 font-bold uppercase text-xs tracking-wider whitespace-nowrap">
            <Zap className="h-4 w-4 fill-current animate-pulse-breaking" />
            <span>Última Hora</span>
          </div>
          <div className="marquee-container relative flex-1 overflow-hidden">
            <div className="flex animate-marquee gap-8 whitespace-nowrap">
              {[...breakingNews, ...breakingNews].map((article, idx) => (
                <Link
                  key={`${article.id}-${idx}`}
                  href={`/noticia/${article.slug}`}
                  className="text-sm hover:underline"
                >
                  {article.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
