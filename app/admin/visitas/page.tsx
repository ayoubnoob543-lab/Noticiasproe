'use client';

import * as React from 'react';
import { useVisits } from '@/hooks/use-visits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, TrendingUp, Users, Globe, Clock, RefreshCw } from 'lucide-react';
import { formatNumber, timeAgo } from '@/lib/format';

export default function VisitsPage() {
  const { visits, dailyStats, totalStats, loading, refetch } = useVisits();

  const stats = [
    {
      label: 'Visitas Totales',
      value: formatNumber(totalStats.total),
      icon: Eye,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      label: 'Hoy',
      value: formatNumber(totalStats.today),
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-950',
    },
    {
      label: 'Esta Semana',
      value: formatNumber(totalStats.thisWeek),
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-950',
    },
    {
      label: 'Este Mes',
      value: formatNumber(totalStats.thisMonth),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-950',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black">Visitas del Sitio</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Seguimiento en tiempo real de todas las visitas
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent visits */}
        <Card>
          <CardHeader>
            <CardTitle>Visitas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {visits.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No hay visitas registradas
                </p>
              ) : (
                visits.slice(0, 20).map((visit) => (
                  <div key={visit.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {visit.page_title || 'Página sin título'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {visit.page_url}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(visit.visited_at)}
                        </span>
                        {visit.country && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {visit.city ? `${visit.city}, ` : ''}{visit.country}
                          </span>
                        )}
                        {visit.user_id ? (
                          <Badge variant="secondary" className="text-xs">
                            Autenticado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Anónimo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Diarias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {dailyStats.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Sin datos disponibles
                </p>
              ) : (
                dailyStats.map((stat) => (
                  <div key={stat.id} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {new Date(stat.date).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span className="font-bold text-primary">
                        {formatNumber(stat.total_visits)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{
                          width: `${
                            stat.total_visits > 0
                              ? (stat.authenticated_visits / stat.total_visits) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>
                        <span className="text-green-500">{stat.authenticated_visits}</span> auth
                      </span>
                      <span>
                        <span className="text-muted-foreground">{stat.anonymous_visits}</span> anónimo
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}