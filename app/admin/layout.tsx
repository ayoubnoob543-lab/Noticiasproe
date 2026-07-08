'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Loader2,
  Eye,
  Globe,
  Clock,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useVisits } from '@/hooks/use-visits';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/noticias', label: 'Noticias', icon: Newspaper },
  { href: '/admin/visitas', label: 'Visitas', icon: Eye },
  { href: '/admin/fuentes', label: 'Fuentes', icon: Rss },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/analitica', label: 'Analítica', icon: BarChart3 },
  { href: '/admin/errores', label: 'Errores', icon: AlertCircle },
  { href: '/admin/ajustes', label: 'Ajustes', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const { totalStats, trackVisit } = useVisits();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [authorized, setAuthorized] = React.useState(false);

  // Admin email from env
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'ayoubnoob543@gmail.com';

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin && user.email !== adminEmail) {
        // Not admin, show access denied
        setAuthorized(false);
      } else {
        setAuthorized(true);
        if (pathname) {
          trackVisit(pathname, `Admin - ${pathname}`);
        }
      }
    }
  }, [user, loading, isAdmin, router, pathname, trackVisit, adminEmail]);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Redirigiendo a login...</p>
        </div>
      </div>
    );
  }

  if (!authorized && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-md p-8 bg-card rounded-lg shadow-lg border border-border">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">
            No tienes permisos para acceder a esta sección. 
            Solo los administradores pueden ver el panel de administración.
          </p>
          <Button asChild>
            <Link href="/">Volver al sitio</Link>
          </Button>
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
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Cerrar sesión
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {profile?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium">{profile?.email}</span>
                {isAdmin && <BadgeAdmin />}
              </div>
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
          <div className="p-4">
            <div className="rounded-lg bg-primary/10 p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Visitas del sitio</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Hoy</p>
                  <p className="font-bold text-lg">{totalStats.today.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">{totalStats.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          <nav className="px-4 space-y-1">
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

function BadgeAdmin() {
  return (
    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
      Admin
    </span>
  );
}