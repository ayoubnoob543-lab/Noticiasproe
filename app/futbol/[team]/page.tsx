import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/articles/article-card';
import { SectionHeader } from '@/components/section-header';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getTeamBySlug, getTeams, getArticles, getMatches } from '@/lib/db';
import { formatDateTime } from '@/lib/format';
import { MapPin, User, Trophy, Calendar } from 'lucide-react';

interface PageProps {
  params: { team: string };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const teams = await getTeams();
  return teams.map((t) => ({ team: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const team = await getTeamBySlug(params.team);
  if (!team) return {};

  return {
    title: `${team.name} — Noticias, resultados y clasificación`,
    description: `Toda la actualidad del ${team.name}: noticias, resultados, clasificación, plantilla y más.`,
    alternates: { canonical: `/futbol/${team.slug}` },
    openGraph: {
      type: 'website',
      url: `/futbol/${team.slug}`,
      title: `${team.name} — NoticiasPro`,
      description: `Toda la actualidad del ${team.name}.`,
    },
  };
}

export default async function TeamPage({ params }: PageProps) {
  const team = await getTeamBySlug(params.team);
  if (!team) notFound();

  const [allArticles, allMatches] = await Promise.all([
    getArticles({ limit: 50, orderBy: 'published_at' }),
    getMatches(),
  ]);

  const teamArticles = allArticles
    .filter((a) => a.categorySlug === team.slug || a.tags.includes(team.name))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const teamMatches = allMatches.filter(
    (m) => m.homeTeam === team.name || m.awayTeam === team.name
  );

  return (
    <div className="container-news py-6">
      <Breadcrumbs
        items={[{ label: 'Fútbol', href: '/futbol' }, { label: team.name }]}
        className="mb-6"
      />

      {/* Team header */}
      <header
        className="mb-8 rounded-lg overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${team.colors} 0%, ${team.colors}cc 100%)` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-6 sm:p-10 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-4xl font-black">
              {team.shortName}
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-black mb-2">{team.name}</h1>
              <p className="text-white/80 mb-4">{team.league}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {team.stadium && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {team.stadium}
                  </span>
                )}
                {team.manager && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {team.manager}
                  </span>
                )}
                {team.position && (
                  <span className="flex items-center gap-1.5">
                    <Trophy className="h-4 w-4" />
                    {team.position}º en LaLiga
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Partidos jugados', value: team.played ?? '-' },
          { label: 'Ganados', value: team.won ?? '-' },
          { label: 'Empatados', value: team.drawn ?? '-' },
          { label: 'Perdidos', value: team.lost ?? '-' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-3xl font-black font-serif">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Articles */}
      {teamArticles.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Noticias" accentColor={team.colors} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamArticles.map((article) => (
              <ArticleCard key={article.id} article={article} showExcerpt />
            ))}
          </div>
        </section>
      )}

      {/* Matches */}
      {teamMatches.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Partidos" accentColor={team.colors} />
          <div className="grid gap-4 sm:grid-cols-2">
            {teamMatches.map((match) => (
              <div
                key={match.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {match.competition} · {match.venue}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{match.homeTeam}</span>
                    {match.status === 'finished' && (
                      <span className="font-bold text-lg">{match.homeScore}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{match.awayTeam}</span>
                    {match.status === 'finished' && (
                      <span className="font-bold text-lg">{match.awayScore}</span>
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
      )}
    </div>
  );
}
