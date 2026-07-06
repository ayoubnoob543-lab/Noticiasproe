import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, Calendar, Flame, Tag, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import {
  getArticleBySlug,
  getRelatedArticles,
  getCommentsByArticle,
  getCategories,
} from '@/lib/db';
import { formatDateTime, formatNumber, timeAgo } from '@/lib/format';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ShareButtons } from '@/components/articles/share-buttons';
import { Comments } from '@/components/articles/comments';
import { ArticleCard } from '@/components/articles/article-card';
import { SectionHeader } from '@/components/section-header';
import { AdSlot } from '@/components/ads/ad-slot';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};

  const url = `/noticia/${article.slug}`;

  return {
    title: article.title,
    description: article.metaDescription || article.summary,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.metaDescription || article.summary,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription || article.summary,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const [related, comments, categories] = await Promise.all([
    getRelatedArticles(article, 4),
    getCommentsByArticle(article.id),
    getCategories(),
  ]);

  const category = categories.find((c) => c.slug === article.categorySlug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.metaDescription || article.summary,
    image: [article.image],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NoticiasPro',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/noticia/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.tags.join(', '),
    commentCount: article.comments,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/ViewAction',
      userInteractionCount: article.views,
    },
  };

  return (
    <article className="container-news py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: article.category, href: `/${article.categorySlug}` },
          { label: article.title },
        ]}
        className="mb-6"
      />

      {/* Header */}
      <header className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-4">
          {article.isBreaking && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Última hora
            </Badge>
          )}
          <Link
            href={`/${article.categorySlug}`}
            className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: category?.color || '#3b82f6' }}
          >
            {article.category}
          </Link>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-balance mb-4">
          {article.title}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
          {article.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {article.author.avatar ? (
                <AvatarImage src={article.author.avatar} alt={article.author.name} />
              ) : null}
              <AvatarFallback>{article.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{article.author.name || 'Redacción'}</p>
              <p className="text-xs text-muted-foreground">{article.author.role || 'NoticiasPro'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDateTime(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {article.readingTime} min
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {formatNumber(article.views)}
            </span>
          </div>
        </div>
      </header>

      {/* Featured image */}
      <figure className="mb-8 max-w-5xl mx-auto">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {article.imageAlt}{article.source && ` · Fuente: ${article.source}`}
        </figcaption>
      </figure>

      {/* Share buttons */}
      <div className="max-w-3xl mx-auto mb-8">
        <ShareButtons url={`/noticia/${article.slug}`} title={article.title} />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <AdSlot slot="article-top" format="leaderboard" className="mb-8" />

        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/buscar?q=${encodeURIComponent(tag)}`}
                className="rounded-md bg-accent px-3 py-1 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Author box */}
        {article.author.bio && (
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                {article.author.avatar ? (
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                ) : null}
                <AvatarFallback>{article.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Escrito por
                </p>
                <h3 className="font-serif text-lg font-bold">{article.author.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{article.author.role}</p>
                <p className="text-sm leading-relaxed">{article.author.bio}</p>
              </div>
            </div>
          </div>
        )}

        <AdSlot slot="article-bottom" format="leaderboard" className="my-8" />

        {/* Comments */}
        <Comments articleId={article.id} initialComments={comments} />
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeader title="Noticias relacionadas" accentColor={category?.color} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="mt-12 text-center">
        <Link
          href={`/${article.categorySlug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a {article.category}
        </Link>
      </div>
    </article>
  );
}
