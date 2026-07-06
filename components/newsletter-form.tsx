'use client';

import * as React from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function NewsletterForm() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Introduce un email válido');
      return;
    }
    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/newsletter-subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        if (response.status === 409) {
          toast.error('Ya estás suscrito con este email');
        } else {
          toast.error(data.error || 'Error al suscribirse. Inténtalo de nuevo.');
        }
        return;
      }

      setSubscribed(true);
      toast.success('¡Suscripción completada! Te hemos enviado un correo de confirmación.');
      setEmail('');
    } catch {
      setLoading(false);
      toast.error('Error de conexión. Inténtalo de nuevo.');
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span>¡Suscripción confirmada!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-9"
          aria-label="Email"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Suscribiendo...' : 'Suscribirme'}
      </Button>
    </form>
  );
}
