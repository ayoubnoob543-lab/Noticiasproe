import './globals.css';
import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BreakingNewsBar } from '@/components/layout/breaking-news-bar';
import { CookieConsent } from '@/components/layout/cookie-consent';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/use-auth';
import { VisitTracker } from '@/components/visit-tracker';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://noticiaspro.com'),
  title: {
    default: 'NoticiasPro — Noticias de última hora, deportes, tecnología y más',
    template: '%s | NoticiasPro',
  },
  description:
    'NoticiasPro es tu periódico digital de referencia. Última hora de España e internacional, fútbol, LaLiga, Champions, tecnología, IA, economía y más. Información de calidad, actualizada y verificada.',
  keywords: [
    'noticias',
    'última hora',
    'deportes',
    'fútbol',
    'LaLiga',
    'Champions League',
    'Real Madrid',
    'Barcelona',
    'tecnología',
    'IA',
    'economía',
    'España',
  ],
  authors: [{ name: 'NoticiasPro' }],
  creator: 'NoticiasPro',
  publisher: 'NoticiasPro',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://noticiaspro.com',
    siteName: 'NoticiasPro',
    title: 'NoticiasPro — Noticias de última hora, deportes, tecnología y más',
    description:
      'Tu periódico digital de referencia. Última hora, deportes, fútbol, tecnología, IA, economía y más.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NoticiasPro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoticiasPro — Noticias de última hora',
    description: 'Tu periódico digital de referencia. Última hora, deportes, tecnología y más.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7661325462568451"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <BreakingNewsBar />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <CookieConsent />
            <Toaster />
            <VisitTracker />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
