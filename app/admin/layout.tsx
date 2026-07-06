'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Rss,
  Users,
  Settings,
  BarChart3,
  AlertCircle,
  Menu,
  X,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/noticias', label: 'Noticias', icon: Newspaper },
  { href: '/admin/fuentes', label: 'Fuentes', icon: Rss },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/analitica', label: 'Analítica', icon: BarChart3 },
  { href: '/admin/errores', label: 'Errores', icon: AlertCircle },
  { href: '/admin/ajustes', label: 'Ajustes', icon: Settings },
];

const ADMIN_PASSWORD = 'noticiaspro2026';
const SESSION_KEY = 'noticiaspro_admin_auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [authed, setAuthed] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === 'true') setAuthed(true);
    setChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
      setError(false);
      setPassword('');
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl news-gradient text-white mb-4">
                <Lock className="h-7 w-7" />
              </div>
              <h1 className="font-serif text-2xl font-black mb-1">Panel de administración</h1>
              <p className="text-sm text-muted-foreground">
                Introduce la contraseña para acceder
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="h-11"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">
                  Contraseña incorrecta. Inténtalo de nuevo.
                </p>
              )}
              <Button type="submit" className="w-full h-11">
                Acceder
              </Button>
            </form>
            <div className="mt-6 pt-4 border-t border-border text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Volver al sitio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menú"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md news-gradient text-white">
                <Newspaper className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-black">
                Admin<span className="text-primary">Pro</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Ver sitio
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                A
              </div>
              <span className="hidden sm:inline text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:sticky top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-card transition-transform overflow-y-auto',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-14 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
