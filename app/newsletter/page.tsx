import type { Metadata } from 'next';
import { Mail, CheckCircle2, Bell, Clock } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter-form';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export const metadata: Metadata = {
  title: 'Newsletter — Suscríbete a NoticiasPro',
  description: 'Recibe las noticias más importantes en tu correo cada mañana. Suscríbete gratis a nuestro newsletter.',
  alternates: { canonical: '/newsletter' },
};

export default function NewsletterPage() {
  const benefits = [
    {
      icon: Clock,
      title: 'Cada mañana',
      description: 'Recibe el resumen de noticias más importante a primera hora.',
    },
    {
      icon: Bell,
      title: 'Última hora',
      description: 'Notificaciones de noticias de última hora cuando ocurran.',
    },
    {
      icon: CheckCircle2,
      title: 'Sin spam',
      description: 'Solo noticias relevantes. Cancela tu suscripción cuando quieras.',
    },
  ];

  return (
    <div className="container-news py-12">
      <Breadcrumbs items={[{ label: 'Newsletter' }]} className="mb-6" />

      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full news-gradient text-white mb-6">
          <Mail className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black mb-4">
          Suscríbete a nuestro newsletter
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Recibe las noticias más importantes en tu correo cada mañana. Gratis y sin compromiso.
        </p>

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-8">
          <NewsletterForm />
        </div>

        <div className="grid gap-6 sm:grid-cols-3 text-left">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
