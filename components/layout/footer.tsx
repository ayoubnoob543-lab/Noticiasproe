import Link from 'next/link';
import { Newspaper, Twitter, Facebook, Instagram, Youtube, Rss, Mail } from 'lucide-react';
import { mainNavCategories, categories } from '@/lib/categories';
import { NewsletterForm } from '@/components/newsletter-form';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-news py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md news-gradient text-white">
                <Newspaper className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-black tracking-tight">
                Noticias<span className="text-primary">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Tu periódico digital de referencia. Noticias de última hora, verificadas y de calidad,
              generadas con tecnología de inteligencia artificial.
            </p>
            <div className="flex gap-2">
              <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
              <Link href="/feed.xml" aria-label="RSS" className="flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent transition-colors">
                <Rss className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Secciones</h3>
            <ul className="grid grid-cols-2 gap-2">
              {mainNavCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Football */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Fútbol</h3>
            <ul className="space-y-2">
              {categories.filter(c => c.parentId === 'futbol').slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recibe las noticias más importantes en tu correo cada mañana.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {year} NoticiasPro. Todos los derechos reservados.
            </p>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link href="/sobre-nosotros" className="hover:text-primary transition-colors">Sobre nosotros</Link>
              <Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link>
              <Link href="/privacidad" className="hover:text-primary transition-colors">Privacidad</Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
              <Link href="/terminos" className="hover:text-primary transition-colors">Términos</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
