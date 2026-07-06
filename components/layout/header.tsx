'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Sun, Moon, Newspaper, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { mainNavCategories, footballCategories, categories } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (slug: string) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="container-news">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                  NoticiasPro
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Portada
                </Link>
                {mainNavCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-md news-gradient text-white">
              <Newspaper className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-black tracking-tight">
              Noticias<span className="text-primary">Pro</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            <Link
              href="/"
              className={cn(
                'px-3 py-2 text-sm font-semibold rounded-md transition-colors hover:bg-accent',
                pathname === '/' && 'text-primary'
              )}
            >
              Portada
            </Link>
            {mainNavCategories.slice(0, 8).map((cat) => {
              const hasChildren = categories.some((c) => c.parentId === cat.slug);
              if (hasChildren) {
                return (
                  <DropdownMenu key={cat.slug}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          'flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors hover:bg-accent',
                          isActive(cat.slug) && 'text-primary'
                        )}
                      >
                        {cat.name}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>{cat.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/${cat.slug}`} className="font-medium">
                          Ver todo
                        </Link>
                      </DropdownMenuItem>
                      {cat.slug === 'futbol'
                        ? footballCategories.map((child) => (
                            <DropdownMenuItem key={child.slug} asChild>
                              <Link href={`/${child.slug}`} className="font-medium">
                                {child.name}
                              </Link>
                            </DropdownMenuItem>
                          ))
                        : categories
                            .filter((c) => c.parentId === cat.slug)
                            .map((child) => (
                              <DropdownMenuItem key={child.slug} asChild>
                                <Link href={`/${child.slug}`} className="font-medium">
                                  {child.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className={cn(
                    'px-3 py-2 text-sm font-semibold rounded-md transition-colors hover:bg-accent',
                    isActive(cat.slug) && 'text-primary'
                  )}
                >
                  {cat.name}
                </Link>
              );
            })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors hover:bg-accent">
                  Más
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Todas las secciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mainNavCategories.slice(8).map((cat) => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link href={`/${cat.slug}`} className="font-medium">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden sm:flex relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-56 pl-9"
                aria-label="Buscar noticias"
              />
            </form>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Cambiar tema"
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button asChild variant="ghost" size="icon" className="hidden sm:flex" aria-label="Buscar">
              <Link href="/buscar">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
