import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container-news py-20 text-center">
      <div className="max-w-md mx-auto">
        <p className="font-serif text-8xl font-black text-primary mb-4">404</p>
        <h1 className="font-serif text-2xl font-bold mb-3">
          Página no encontrada
        </h1>
        <p className="text-muted-foreground mb-8">
          La página que buscas no existe o ha sido movida. Quizá la noticia ya no está disponible
          o la dirección no es correcta.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/buscar">
              <Search className="h-4 w-4 mr-2" />
              Buscar noticias
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
