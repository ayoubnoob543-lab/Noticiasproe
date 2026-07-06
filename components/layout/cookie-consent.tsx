'use client';

import * as React from 'react';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COOKIE_KEY = 'noticiaspro_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-4xl m-4">
        <div className="rounded-xl border border-border bg-card shadow-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950">
              <Cookie className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-bold text-base mb-1">
                Uso de cookies
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Puedes aceptar todas las cookies, rechazar las no esenciales o gestionar tus preferencias en cualquier momento.
              </p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:justify-end">
            <Button variant="outline" size="sm" onClick={handleReject}>
              Rechazar
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Aceptar todas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
