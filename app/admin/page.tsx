'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Eye,
  MessageCircle,
  Rss,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Activity,
  RefreshCw,
  Users,
  UserCheck,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { formatNumber, timeAgo } from '@/lib/format';
import { useVisits } from '@/hooks/use-visits';

interface ArticleStats {
  id: string;
  slug: string;
  title: string;
  category_slug: string;
  published_at: string;
  views: number;
  comments_count: number;
  shares: number;
  is_breaking: boolean;
}

interface SourceStats {
  id: string;
  name: string;
  type: string;
  priority: number;
  is_active: boolean;
  last_fetched_at: string | null;
  articles_fetched: number;
  errors_count: number;
}

interface FetchError {
  id: string;
  is_resolved: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = React.useState<ArticleStats[]>([]);
  const [sources, setSources] = React.useState<SourceStats[]>([]);
  const [errors, setErrors] = React.useState<FetchError[]>([]);
  const [recentUsers, setRecentUsers] = React.useState<UserProfile[]>([]);
  const [connectedUsers, setConnectedUsers] = React.useState(0);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());
  const { totalStats, dailyStats, visits, refetch: refetchVisits } = useVisits();

  const fetchData = React.useCallback(async () => {
    const [artRes, srcRes, errRes, usersRes, profilesRes] = await Promise.all([
      supabase
        .from('articles')
        .select('id, slug, title, category_slug, published_at, views, comments_count, shares, is_breaking')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(500),
      supabase
        .from('sources')
        .select('id, name, type, priority, is_active, last_fetched_at, articles_fetched, errors_count')
        .order('priority', { ascending: false }),
      supabase
        .from('fetch_errors')
        .select('id, is_resolved')
        .order('timestamp', { ascending: false })
        .limit(50),
      supabase.rpc('get_connected_users_count'),
      supabase
        .from('profiles')
        .select('id, email, is_admin, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    if (artRes.data) setArticles(artRes.data as ArticleStats[]);
    if (srcRes.data) setSources(srcRes.data as SourceStats[]);
    if (errRes.data) setErrors(errRes.data as FetchError[]);
    if (usersRes.data !== null) setConnectedUsers(usersRes.data as number);
    if (profilesRes.data) {
      setRecentUsers(profilesRes.data as UserProfile[]);
      setTotalUsers((profilesRes.data as UserProfile[]).length);
    }
    
    // Get total users count
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    if (count) setTotalUsers(count);
    
    setLoading(false);
    setLastUpdate(new Date());
  }, []);

  React.useEffect(() => {
    fetchData();
    refetchVisits();
    const interval = setInterval(() => {
      fetchData();
      refetchVisits();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData, refetchVisits]);

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalComments = articles.reduce((sum, a) => sum + a.comments_count, 0);
  const totalShares = articles.reduce((sum, a) => sum + a.shares, 0);
  const activeSources = sources.filter((s) => s.is_active).length;
  const totalErrors = errors.filter((e) => !e.is_resolved).length;
  const totalArticlesFetched = sources.reduce((sum, s) => sum + s.articles_fetched, 0);

  const stats = [
    {
      label: 'Artículos publicados',
      value: formatNumber(articles.length),
      icon: Newspaper,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      label: 'Visitas totales',
      value: formatNumber(totalStats.total),
      icon: Eye,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-950',
    },
    {
      label: 'Usuarios registrados',
      value: formatNumber(totalUsers),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-950',
    },
    {
      label: 'Usuarios conectados',
      value: connectedUsers.toString(),
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-950',
      live: true,
    },
    {
      label: 'Comentarios',
      value: formatNumber(totalComments),
      icon: MessageCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-950',
    },
    {
      label: 'Compartidos',
      value: formatNumber(totalShares),
      icon: TrendingUp,
      color: 'text-pink-600',
      bg: 'bg-pink-100 dark:bg-pink-950',
    },
    {
      label: 'Fuentes activas',
      value: `${activeSources}/${sources.length}`,
      icon: Rss,
      color: 'text-cyan-600',
      bg: 'bg-cyan-100 dark:bg-cyan-950',
    },
    {
      label: 'Artículos recopilados',
      value: formatNumber(totalArticlesFetched),
      icon: Activity,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100 dark:bg-indigo-950',
    },
  ];

  const recentArticles = articles.slice(0, 6);
  const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Cargando datos en tiempo real...</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="animate-pulse">
                  <div className="h-4 w-24 bg-muted rounded mb-2" />
                  <div className="h-8 w-16 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            En tiempo real · Actualizado {timeAgo(lastUpdate.toISOString())}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { fetchData(); refetchVisits(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button asChild>
            <Link href="/admin/noticias">
              <Newspaper className="h-4 w-4 mr-2" />
              Gestionar noticias
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      {stat.label}
                      {stat.live && (
                        <span className="relative flex h-2 w-2 ml-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                      )}
                    </p>
                    <p className="font-serif text-2xl font-black mt-1">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Visit stats summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visitas Hoy</p>
              <p className="font-serif text-3xl font-black text-green-600">{formatNumber(totalStats.today)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Esta Semana</p>
              <p className="font-serif text-3xl font-black text-blue-600">{formatNumber(totalStats.thisWeek)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Este Mes</p>
              <p className="font-serif text-3xl font-black text-purple-600">{formatNumber(totalStats.thisMonth)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System status */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">Sistema operativo</p>
              <p className="text-xs text-muted-foreground">Actualización cada 10 min activa</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">Última sincronización</p>
              <p className="text-xs text-muted-foreground">
                {sources.length > 0 && sources[0].last_fetched_at
                  ? timeAgo(sources[0].last_fetched_at)
                  : 'Pendiente'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">{totalErrors} errores sin resolver</p>
              <p className="text-xs text-muted-foreground">Revisar fuentes con fallos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent articles + Top articles + Daily visits */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Artículos recientes</span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/noticias">
                  Ver todos
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/noticia/${article.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{article.category_slug}</span>
                      <span>·</span>
                      <span>{timeAgo(article.published_at)}</span>
                    </div>
                  </div>
                  {article.is_breaking && (
                    <Badge variant="destructive" className="text-xs">Última hora</Badge>
                  )}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Artículos más vistos</span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/analitica">
                  Analítica
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topArticles.map((article, idx) => (
                <Link
                  key={article.id}
                  href={`/noticia/${article.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="font-serif text-2xl font-black text-muted-foreground/30 w-8">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Eye className="h-3 w-3" />
                      {formatNumber(article.views)} vistas
                      <span>·</span>
                      <MessageCircle className="h-3 w-3" />
                      {formatNumber(article.comments_count)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Visitas diarias</span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/visitas">
                  Ver más
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {dailyStats.slice(0, 7).map((stat) => (
                <div key={stat.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(stat.date).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.authenticated_visits} auth</span>
                      <span className="text-gray-500">{stat.anonymous_visits} anon</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-lg font-bold">{stat.total_visits}</p>
                    <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{
                          width: `${Math.min((stat.total_visits / Math.max(...dailyStats.map(s => s.total_visits), 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent registrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Últimos registros</span>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/usuarios">
                Ver todos
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(user.created_at)}</p>
                </div>
                {user.is_admin && (
                  <Badge variant="default" className="text-xs">Admin</Badge>
                )}
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full text-center py-4">
                No hay usuarios registrados todavía
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sources status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Estado de fuentes</span>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/fuentes">
                Gestionar fuentes
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sources.slice(0, 8).map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      source.is_active ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{source.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {source.type.toUpperCase()} · Prioridad {source.priority}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatNumber(source.articles_fetched)} artículos</span>
                  {source.errors_count > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {source.errors_count} errores
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}