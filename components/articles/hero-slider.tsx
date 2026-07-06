'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import type { Article } from '@/lib/types';
import { timeAgo } from '@/lib/format';
import { getCategoryBySlug } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeroSliderProps {
  articles: Article[];
}

export function HeroSlider({ articles }: HeroSliderProps) {
  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const count = articles.length;

  const next = React.useCallback(() => {
    setCurrent((c) => (c + 1) % count);
  }, [count]);

  const prev = () => {
    setCurrent((c) => (c - 1 + count) % count);
  };

  React.useEffect(() => {
    if (isPaused || count <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next, count]);

  if (count === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[420px] sm:h-[480px] lg:h-[540px]">
        {articles.map((article, idx) => {
          const category = getCategoryBySlug(article.categorySlug);
          return (
            <div
              key={article.id}
              className={cn(
                'absolute inset-0 transition-opacity duration-700',
                idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              <Link href={`/noticia/${article.slug}`} className="group block h-full">
                <div className="absolute inset-0">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 768px) 100vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                </div>
                <div className="relative flex h-full flex-col justify-end p-6 sm:p-8 lg:p-10">
                  <div className="flex items-center gap-2 mb-3">
                    {article.isBreaking && (
                      <span className="flex items-center gap-1 rounded bg-destructive px-2.5 py-1 text-xs font-bold uppercase text-destructive-foreground">
                        <Flame className="h-3 w-3" />
                        Última hora
                      </span>
                    )}
                    <span
                      className="rounded px-2.5 py-1 text-xs font-bold uppercase text-white"
                      style={{ backgroundColor: category?.color }}
                    >
                      {article.category}
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight text-white max-w-3xl line-clamp-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-white/80 max-w-2xl line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
                    <span className="font-medium">{article.author.name}</span>
                    <span>·</span>
                    <span>{timeAgo(article.publishedAt)}</span>
                    <span>·</span>
                    <span>{article.readingTime} min de lectura</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {count > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-4 right-6 flex gap-2">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  idx === current ? 'w-8 bg-primary' : 'w-2 bg-white/50 hover:bg-white/80'
                )}
                aria-label={`Ir a slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
