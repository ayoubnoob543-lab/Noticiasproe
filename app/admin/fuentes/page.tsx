'use client';

import * as React from 'react';
import {
  Plus,
  Search,
  Rss,
  Globe,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import type { Source } from '@/lib/types';
import { formatNumber, timeAgo } from '@/lib/format';
import { toast } from 'sonner';

const sourceTypeLabels: Record<string, string> = {
  rss: 'RSS',
  newsapi: 'NewsAPI',
  gnews: 'GNews',
  thenewsapi: 'TheNewsAPI',
  mediastack: 'Mediastack',
  currents: 'Currents API',
  guardian: 'The Guardian',
  nyt: 'NY Times',
  bing: 'Bing News',
  google: 'Google News',
  custom: 'Personalizada',
};

export default function AdminSourcesPage() {
  const [sources, setSources] = React.useState<Source[]>([]);
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase
      .from('sources')
      .select('*')
      .order('priority', { ascending: false })
      .then(({ data, error }) => {
        if (error || !data) {
          setLoading(false);
          return;
        }
        setSources(
          data.map((row) => ({
            id: row.id,
            name: row.name,
            url: row.url,
            type: row.type,
            category: row.category || '',
            priority: row.priority,
            isActive: row.is_active,
            lastFetched: row.last_fetched_at || '',
            articlesFetched: row.articles_fetched,
            errors: row.errors_count,
            language: row.language,
          }))
        );
        setLoading(false);
      });
  }, []);

  const filtered = sources.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const toggleActive = async (id: string) => {
    const source = sources.find((s) => s.id === id);
    if (!source) return;
    const { error } = await supabase
      .from('sources')
      .update({ is_active: !source.isActive })
      .eq('id', id);
    if (error) {
      toast.error('Error al actualizar la fuente');
      return;
    }
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    toast.success(`Fuente ${source.isActive ? 'desactivada' : 'activada'}: ${source.name}`);
  };

  const handleRefresh = (id: string) => {
    toast.success('Sincronización iniciada');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('sources').delete().eq('id', id);
    if (error) {
      toast.error('Error al eliminar la fuente');
      return;
    }
    setSources((prev) => prev.filter((s) => s.id !== id));
    toast.success('Fuente eliminada');
  };

  const totalActive = sources.filter((s) => s.isActive).length;
  const totalErrors = sources.reduce((sum, s) => sum + s.errors, 0);
  const totalArticles = sources.reduce((sum, s) => sum + s.articlesFetched, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black">Fuentes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestiona las fuentes de noticias automatizadas
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Añadir fuente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                <Rss className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-serif text-xl font-black">{sources.length}</p>
                <p className="text-xs text-muted-foreground">Total fuentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-serif text-xl font-black">{totalActive}</p>
                <p className="text-xs text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-serif text-xl font-black">{formatNumber(totalArticles)}</p>
                <p className="text-xs text-muted-foreground">Artículos recopilados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-serif text-xl font-black">{totalErrors}</p>
                <p className="text-xs text-muted-foreground">Errores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fuente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {Object.entries(sourceTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Sources list */}
      {loading ? (
        <div className="text-center text-muted-foreground py-12">Cargando fuentes...</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((source) => (
            <Card key={source.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        source.isActive
                          ? 'bg-green-100 dark:bg-green-950'
                          : 'bg-red-100 dark:bg-red-950'
                      }`}
                    >
                      {source.isActive ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{source.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {sourceTypeLabels[source.type] || source.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Prioridad {source.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {source.url}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {source.category && <span>{source.category}</span>}
                        <span>·</span>
                        <span>{source.language.toUpperCase()}</span>
                        <span>·</span>
                        <span>{formatNumber(source.articlesFetched)} artículos</span>
                        {source.lastFetched && (
                          <>
                            <span>·</span>
                            <span>Actualizada {timeAgo(source.lastFetched)}</span>
                          </>
                        )}
                        {source.errors > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-destructive">{source.errors} errores</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefresh(source.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Sincronizar
                    </Button>
                    <Button
                      variant={source.isActive ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleActive(source.id)}
                    >
                      {source.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(source.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
