import Link from 'next/link';
import { ArticleCard } from '@/components/articles/article-card';
import { SectionHeader } from '@/components/section-header';
import { getArticles, getTeams, getMatches, getCategories } from '@/lib/db';
import { formatDateTime } from '@/lib/format';
import { Trophy, Calendar, ArrowRight } from 'lucide-react';

export async function FootballSection() {
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

  const footballArticles = allArticles
    .filter(
      (a) =>
        footballCategorySlugs.includes(a.categorySlug) ||
        childFootballSlugs.includes(a.categorySlug) ||
        a.subcategory === 'futbol'
    )
    .slice(0, 4);

  return (
    <section className="mb-12">
      <SectionHeader title="Fútbol" href="/futbol" accentColor="#16a34a" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Articles */}
        <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
          {footballArticles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              priority={idx < 2}
              showExcerpt
            />
          ))}
        </div>

        {/* Sidebar: standings + matches */}
        <aside className="space-y-6">
          {/* Standings */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
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
                    <td className="px-2 py-2.5 text-center text-muted-foreground">{team.played ?? '-'}</td>
                    <td className="px-2 py-2.5 text-center font-bold">{team.points ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 border-t border-border">
              <Link
                href="/futbol"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Ver clasificación completa
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Matches */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 bg-primary/5 px-4 py-3 border-b border-border">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-serif font-bold">Próximos partidos</h3>
            </div>
            <div className="divide-y divide-border/50">
              {matches.map((match) => (
                <div key={match.id} className="px-4 py-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {match.competition} · {match.venue}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">{match.homeTeam}</span>
                    {match.status === 'finished' ? (
                      <span className="font-bold text-sm bg-primary/10 px-2 py-0.5 rounded">
                        {match.homeScore} - {match.awayScore}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">vs</span>
                    )}
                    <span className="font-semibold text-sm">{match.awayTeam}</span>
                  </div>
                  {match.status !== 'finished' && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(match.date)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Teams */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-serif font-bold mb-3">Equipos destacados</h3>
            <div className="grid grid-cols-3 gap-2">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/futbol/${team.slug}`}
                  className="group flex flex-col items-center gap-1 rounded-md p-2 hover:bg-accent transition-colors"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white font-bold text-sm"
                    style={{ backgroundColor: team.colors || '#3b82f6' }}
                  >
                    {team.shortName}
                  </div>
                  <span className="text-xs font-semibold text-center group-hover:text-primary transition-colors">
                    {team.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
