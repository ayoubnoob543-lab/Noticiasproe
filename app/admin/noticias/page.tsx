'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MoreHorizontal,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase';
import type { Article, Category } from '@/lib/types';
import { formatNumber, timeAgo } from '@/lib/format';
import { toast } from 'sonner';

export default function AdminNewsPage() {
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [articleList, setArticleList] = React.useState<Article[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('priority', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setCategories(
            data.map((c) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
              description: c.description || '',
              color: c.color || '#3b82f6',
              icon: c.icon || undefined,
              parentId: c.parent_id,
            }))
          );
        }
      });
  }, []);

  React.useEffect(() => {
    setLoading(true);
    let q = supabase
      .from('articles')
      .select('*, author:authors(*), source:sources(name)')
      .order('published_at', { ascending: false })
      .limit(200);

    if (categoryFilter !== 'all') {
      q = q.eq('category_slug', categoryFilter);
    }
    if (statusFilter === 'breaking') q = q.eq('is_breaking', true);
    if (statusFilter === 'featured') q = q.eq('is_featured', true);
    if (statusFilter === 'trending') q = q.eq('is_trending', true);

    q.then(({ data }) => {
      if (!data) {
        setArticleList([]);
        setLoading(false);
        return;
      }
      const catMap = new Map(categories.map((c) => [c.slug, c.name]));
      setArticleList(
        data.map((row: Record<string, unknown>) => ({
          id: row.id as string,
          slug: row.slug as string,
          title: row.title as string,
          subtitle: (row.subtitle as string) || '',
          summary: (row.summary as string) || '',
          content: (row.content as string) || '',
          excerpt: (row.excerpt as string) || '',
          metaDescription: (row.meta_description as string) || '',
          image: (row.image as string) || '',
          imageAlt: (row.image_alt as string) || '',
          category: catMap.get(row.category_slug as string) || (row.category_slug as string),
          categorySlug: row.category_slug as string,
          subcategory: (row.subcategory_slug as string) || undefined,
          tags: (row.tags as string[]) || [],
          author: {
            id: (row.author as { id?: string })?.id || '',
            name: (row.author as { name?: string })?.name || '',
            avatar: (row.author as { avatar?: string })?.avatar || '',
            bio: (row.author as { bio?: string })?.bio || '',
            role: (row.author as { role?: string })?.role || '',
          },
          publishedAt: row.published_at as string,
          updatedAt: (row.updated_at as string) || undefined,
          readingTime: row.reading_time as number,
          views: row.views as number,
          comments: row.comments_count as number,
          shares: row.shares as number,
          isBreaking: row.is_breaking as boolean,
          isFeatured: row.is_featured as boolean,
          isTrending: row.is_trending as boolean,
          source: (row.source as { name?: string })?.name || '',
          sourceUrl: (row.source_url as string) || '',
        }))
      );
      setLoading(false);
    });
  }, [categoryFilter, statusFilter, categories]);

  const filtered = articleList.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      toast.error('Error al eliminar el artículo');
      return;
    }
    setArticleList((prev) => prev.filter((a) => a.id !== id));
    toast.success('Artículo eliminado');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black">Noticias</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestiona todos los artículos publicados
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva noticia
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="breaking">Última hora</SelectItem>
              <SelectItem value="featured">Destacadas</SelectItem>
              <SelectItem value="trending">Tendencias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">Artículo</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Categoría</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Fecha</th>
                <th className="px-4 py-3 text-right font-medium hidden sm:table-cell">Vistas</th>
                <th className="px-4 py-3 text-center font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
                        {article.image && (
                          <img
                            src={article.image}
                            alt={article.imageAlt}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/noticia/${article.slug}`}
                          className="font-medium line-clamp-1 hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {article.author.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="secondary">{article.category}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    {timeAgo(article.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    {formatNumber(article.views)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {article.isBreaking && (
                        <Badge variant="destructive" className="text-xs">
                          <Flame className="h-3 w-3 mr-1" />
                          Última
                        </Badge>
                      )}
                      {article.isFeatured && (
                        <Badge variant="default" className="text-xs">Destacada</Badge>
                      )}
                      {article.isTrending && (
                        <Badge variant="secondary" className="text-xs">Tendencia</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/noticia/${article.slug}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Programar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(article.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="p-12 text-center text-muted-foreground">
            Cargando artículos...
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No se encontraron artículos con los filtros seleccionados.
          </div>
        )}
      </Card>

      <div className="text-sm text-muted-foreground">
        Mostrando {filtered.length} de {articleList.length} artículos
      </div>
    </div>
  );
}
