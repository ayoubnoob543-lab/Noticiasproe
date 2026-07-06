'use client';

import * as React from 'react';
import { Search, MoreHorizontal, Shield, Edit, Trash2, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthorUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  articleCount: number;
}

const roleLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  admin: { label: 'Administrador', variant: 'default' },
  editor: { label: 'Editor', variant: 'secondary' },
  author: { label: 'Autor', variant: 'outline' },
};

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState('');
  const [users, setUsers] = React.useState<AuthorUser[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      supabase.from('authors').select('*').order('created_at', { ascending: false }),
      supabase.from('articles').select('author_id'),
    ]).then(([authorsRes, articlesRes]) => {
      if (authorsRes.data) {
        const articleCounts = new Map<string, number>();
        for (const a of articlesRes.data || []) {
          if (a.author_id) {
            articleCounts.set(a.author_id, (articleCounts.get(a.author_id) || 0) + 1);
          }
        }
        setUsers(
          authorsRes.data.map((a, i) => ({
            id: a.id,
            name: a.name,
            avatar: a.avatar || '',
            bio: a.bio || '',
            role: i === 0 ? 'admin' : i < 3 ? 'editor' : 'author',
            articleCount: articleCounts.get(a.id) || 0,
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('authors').delete().eq('id', id);
    if (error) {
      toast.error('Error al eliminar el autor');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success('Autor eliminado');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black">Usuarios</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestiona autores, roles y permisos
          </p>
        </div>
        <Button>
          Nuevo autor
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">Autor</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Rol</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Bio</th>
                <th className="px-4 py-3 text-center font-medium hidden sm:table-cell">Artículos</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    Cargando autores...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No se encontraron autores.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : null}
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant={roleLabels[user.role].variant}>
                        {roleLabels[user.role].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground max-w-xs truncate">
                      {user.bio || 'Sin biografía'}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {user.articleCount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Cambiar rol
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(user.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
