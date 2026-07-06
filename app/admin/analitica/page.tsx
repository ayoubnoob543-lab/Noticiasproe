'use client';

import * as React from 'react';
import { Eye, MessageCircle, Share2, TrendingUp, Globe, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { formatNumber } from '@/lib/format';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface ArticleStats {
  id: string;
  title: string;
  category_slug: string;
  views: number;
  comments_count: number;
  shares: number;
  published_at: string;
}

interface SourceStats {
  name: string;
  articles_fetched: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  futbol: '#16a34a',
  tecnologia: '#0ea5e9',
  internacional: '#dc2626',
  economia: '#0d9488',
  entretenimiento: '#d946ef',
  general: '#3b82f6',
  deportes: '#f97316',
  ciencia: '#06b6d4',
  salud: '#ec4899',
  videojuegos: '#a855f7',
};

export default function AdminAnalyticsPage() {
  const [articles, setArticles] = React.useState<ArticleStats[]>([]);
  const [sources, setSources] = React.useState<SourceStats[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      supabase
        .from('articles')
        .select('id, title, category_slug, views, comments_count, shares, published_at')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(500),
      supabase
        .from('sources')
        .select('name, articles_fetched')
        .order('articles_fetched', { ascending: false })
        .limit(10),
    ]).then(([artRes, srcRes]) => {
      if (artRes.data) setArticles(artRes.data as ArticleStats[]);
      if (srcRes.data) setSources(srcRes.data as SourceStats[]);
      setLoading(false);
    });
  }, []);

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalComments = articles.reduce((sum, a) => sum + a.comments_count, 0);
  const totalShares = articles.reduce((sum, a) => sum + a.shares, 0);

  const stats = [
    {
      label: 'Artículos publicados',
      value: formatNumber(articles.length),
      icon: Newspaper,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      label: 'Vistas totales',
      value: formatNumber(totalViews),
      icon: Eye,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-950',
    },
    {
      label: 'Comentarios',
      value: formatNumber(totalComments),
      icon: MessageCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-950',
    },
    {
      label: 'Compartidos',
      value: formatNumber(totalShares),
      icon: Share2,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-950',
    },
  ];

  // Category distribution
  const categoryMap = new Map<string, number>();
  for (const a of articles) {
    const cat = a.category_slug;
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  }
  const categoryData = Array.from(categoryMap.entries())
    .map(([slug, count]) => ({
      name: slug,
      value: count,
      color: CATEGORY_COLORS[slug] || '#64748b',
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Articles per day (last 7 days)
  const dayMap = new Map<string, number>();
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayMap.set(key, 0);
  }
  for (const a of articles) {
    const key = (a.published_at || '').slice(0, 10);
    if (dayMap.has(key)) {
      dayMap.set(key, dayMap.get(key)! + 1);
    }
  }
  const dayLabels: Record<string, string> = {
    0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb',
  };
  const trafficData = Array.from(dayMap.entries()).map(([date, count]) => {
    const d = new Date(date);
    return { day: dayLabels[d.getDay()] || date, articles: count };
  });

  const sourceData = sources.map((s) => ({ name: s.name, articles: s.articles_fetched }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black">Analítica</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Estadísticas y métricas reales de la plataforma
        </p>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Cargando métricas...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
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

          {/* Articles per day chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Artículos publicados (últimos 7 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="articles"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Artículos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Category distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por categoría</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {categoryData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-12">Sin datos</p>
                )}
              </CardContent>
            </Card>

            {/* Sources bar chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Artículos recopilados por fuente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sourceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sourceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-xs" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" className="text-xs" width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="articles" fill="#dc2626" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-12">Sin datos</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top performing */}
          <Card>
            <CardHeader>
              <CardTitle>Artículos con mejor rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {articles.slice(0, 10).map((article, idx) => (
                  <div
                    key={article.id}
                    className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                  >
                    <span className="font-serif text-xl font-black text-muted-foreground/30 w-8">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.category_slug}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <p className="font-semibold">{formatNumber(article.views)}</p>
                        <p className="text-xs text-muted-foreground">vistas</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="font-semibold">{formatNumber(article.comments_count)}</p>
                        <p className="text-xs text-muted-foreground">comentarios</p>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="font-semibold">{formatNumber(article.shares)}</p>
                        <p className="text-xs text-muted-foreground">compartidos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
