import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/articles/article-card';
import { SectionHeader } from '@/components/section-header';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { getArticles, getTeams, getMatches, getCategories } from '@/lib/db';
import { formatDateTime } from '@/lib/format';
import { Trophy, Calendar } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Fútbol — Noticias de fútbol, LaLiga, Champions y más',
  description:
    'Toda la actualidad del fútbol: LaLiga, Premier League, Champions League, Real Madrid, Barcelona, Atlético de Madrid, Selección Española, mercado de fichajes y más.',
  alternates: { canonical: '/futbol' },
};

export default async function FootballPage() {
  const [allArticles, teams, matches, categories] = await Promise.all([
    getArticles({ limit: 50, orderBy: 'published_at' }),
    getTeams(),
    getMatches(),
    getCategories(),
  ]);

  const footballCategorySlugs = categories
    .filter((c) => c.parentId === null && c.slug === 'futbol')
    .map((c) => c.slug);
  const footballParent = categories.find((c) => c.parentId === null && c.slug === 'futbol');
  const childFootballSlugs = footballParent
    ? categories.filter((c) => c.parentId === footballParent.id).map((c) => c.slug)
    : [];

  const footballArticles = allArticles.filter(
    (a) =>
      footballCategorySlugs.includes(a.categorySlug) ||
      childFootballSlugs.includes(a.categorySlug) ||
      a.subcategory === 'futbol'
  );

  const footballCategories = categories.filter((c) => c.parentId === null && c.slug === 'futbol')
    .flatMap((parent) => categories.filter((c) => c.parentId === parent.id));

  return (
    <div className="container-news py-6">
      <Breadcrumbs items={[{ label: 'Fútbol' }]} className="mb-6" />

      <header className="mb-8 rounded-lg overflow-hidden">
        <div className="h-2 w-full bg-green-600" />
        <div className="bg-card p-6 sm:p-8 border border-border border-t-0 rounded-b-lg">
          <h1 className="font-serif text-3xl sm:text-4xl font-black mb-2">Fútbol</h1>
          <p className="text-muted-foreground text-lg">
            Toda la actualidad del fútbol nacional e internacional: LaLiga, Champions, Premier League y más.
          </p>
        </div>
      </header>

      {/* Subcategories */}
      <div className="mb-8 flex flex-wrap gap-2">
        {footballCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Hero + standings */}
      <section className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          {footballArticles[0] && (
            <ArticleCard article={footballArticles[0]} variant="overlay" priority showExcerpt />
          )}
        </div>
        <aside className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 bg-primary/5 px-4 py-3 border-b border-border">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-serif font-bold">Clasificación LaLiga</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-2 text-left font-medium">#</th>
                <th className="px-3 py-2 text-left font-medium">Equipo</th>
                <th className="px-2 py-2 text-center font-medium">PJ</th>
                <th className="px-2 py-2 text-center font-medium">G</th>
                <th className="px-2 py-2 text-center font-medium">E</th>
                <th className="px-2 py-2 text-center font-medium">P</th>
                <th className="px-2 py-2 text-center font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr
                  key={team.id}
                  className="border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors"
                >
                  <td className="px-3 py-2.5 font-bold text-muted-foreground">{idx + 1}</td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/futbol/${team.slug}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {team.name}
                    </Link>
                  </td>
                  <td className="px-2 py-2.5 text-center text-muted-foreground">{team.played}</td>
                  <td className="px-2 py-2.5 text-center text-muted-foreground">{team.won}</td>
                  <td className="px-2 py-2.5 text-center text-muted-foreground">{team.drawn}</td>
                  <td className="px-2 py-2.5 text-center text-muted-foreground">{team.lost}</td>
                  <td className="px-2 py-2.5 text-center font-bold">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </section>

      <AdSlot slot="football-top" className="mb-8" />

      {/* Articles grid */}
      <section className="mb-8">
        <SectionHeader title="Últimas noticias de fútbol" accentColor="#16a34a" />
        {footballArticles.length > 1 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {footballArticles.slice(1, 7).map((article) => (
              <ArticleCard key={article.id} article={article} showExcerpt />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Cargando noticias de fútbol...
          </p>
        )}
      </section>

      {/* Matches */}
      <section className="mb-8">
        <SectionHeader title="Partidos" accentColor="#16a34a" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {match.competition}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{match.homeTeam}</span>
                  {match.status === 'finished' && (
                    <span className="font-bold text-sm">{match.homeScore}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{match.awayTeam}</span>
                  {match.status === 'finished' && (
                    <span className="font-bold text-sm">{match.awayScore}</span>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                {match.status === 'finished'
                  ? 'Finalizado'
                  : match.status === 'live'
                  ? 'En directo'
                  : formatDateTime(match.date)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teams */}
      <section className="mb-8">
        <SectionHeader title="Equipos" accentColor="#16a34a" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/futbol/${team.slug}`}
              className="group rounded-lg border border-border bg-card p-5 hover:shadow-lg hover:border-primary/40 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-white font-bold"
                  style={{ backgroundColor: team.colors || '#3b82f6' }}
                >
                  {team.shortName}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold group-hover:text-primary transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{team.league}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Posición</p>
                  <p className="font-bold">{team.position}º</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Puntos</p>
                  <p className="font-bold">{team.points}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">PJ</p>
                  <p className="font-bold">{team.played}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
