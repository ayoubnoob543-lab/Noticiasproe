'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw, Trash2, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ErrorEntry {
  id: string;
  sourceName: string;
  type: string;
  message: string;
  timestamp: string;
  severity: string;
  isResolved: boolean;
}

const severityConfig: Record<string, { label: string; variant: 'destructive' | 'secondary' | 'outline' }> = {
  error: { label: 'Error', variant: 'destructive' },
  warning: { label: 'Advertencia', variant: 'secondary' },
  info: { label: 'Info', variant: 'outline' },
};

export default function AdminErrorsPage() {
  const [errors, setErrors] = React.useState<ErrorEntry[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'unresolved' | 'resolved'>('all');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase
      .from('fetch_errors')
      .select('*, source:sources(name)')
      .order('timestamp', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error || !data) {
          setLoading(false);
          return;
        }
        setErrors(
          data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            sourceName: (row.source as { name?: string })?.name || 'Desconocida',
            type: row.type as string,
            message: row.message as string,
            timestamp: row.timestamp as string,
            severity: row.severity as string,
            isResolved: row.is_resolved as boolean,
          }))
        );
        setLoading(false);
      });
  }, []);

  const filtered = errors.filter((e) => {
    if (filter === 'unresolved') return !e.isResolved;
    if (filter === 'resolved') return e.isResolved;
    return true;
  });

  const handleResolve = async (id: string) => {
    const { error } = await supabase
      .from('fetch_errors')
      .update({ is_resolved: true, resolved_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      toast.error('Error al resolver');
      return;
    }
    setErrors((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isResolved: true } : e))
    );
    toast.success('Error marcado como resuelto');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('fetch_errors').delete().eq('id', id);
    if (error) {
      toast.error('Error al eliminar');
      return;
    }
    setErrors((prev) => prev.filter((e) => e.id !== id));
    toast.success('Error eliminado');
  };

  const handleRetry = (id: string) => {
    toast.success('Reintentando conexión...');
  };

  const unresolvedCount = errors.filter((e) => !e.isResolved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black">Errores</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Registro de errores del sistema de recopilación
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-serif text-xl font-black">{unresolvedCount}</p>
              <p className="text-xs text-muted-foreground">Sin resolver</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-serif text-xl font-black">{errors.length - unresolvedCount}</p>
              <p className="text-xs text-muted-foreground">Resueltos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-serif text-xl font-black">{errors.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(['all', 'unresolved', 'resolved'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Todos' : f === 'unresolved' ? 'Sin resolver' : 'Resueltos'}
          </Button>
        ))}
      </div>

      {/* Errors list */}
      {loading ? (
        <div className="text-center text-muted-foreground py-12">Cargando errores...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((error) => {
            const sev = severityConfig[error.severity] || severityConfig.info;
            return (
              <Card key={error.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                          error.severity === 'error'
                            ? 'bg-red-100 dark:bg-red-950'
                            : error.severity === 'warning'
                            ? 'bg-orange-100 dark:bg-orange-950'
                            : 'bg-blue-100 dark:bg-blue-950'
                        }`}
                      >
                        {error.severity === 'error' ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{error.sourceName}</h3>
                          <Badge variant={sev.variant}>{sev.label}</Badge>
                          {error.isResolved && (
                            <Badge variant="outline" className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">
                              Resuelto
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium mt-1">{error.type}</p>
                        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(error.timestamp).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!error.isResolved && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(error.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Reintentar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolve(error.id)}
                          >
                            Resolver
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(error.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <p className="text-lg font-semibold">No hay errores</p>
            <p className="text-muted-foreground">El sistema funciona correctamente</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
