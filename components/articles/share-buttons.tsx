'use client';

import { useState } from 'react';
import { Twitter, Facebook, Link2, MessageCircle, Send, Instagram, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: 'horizontal' | 'vertical';
}

export function ShareButtons({ url, title, variant = 'horizontal' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar el enlace');
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="h-4 w-4" />,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`,
      color: 'hover:bg-green-500 hover:text-white',
    },
    {
      name: 'Telegram',
      icon: <Send className="h-4 w-4" />,
      href: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
      color: 'hover:bg-blue-500 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'X',
      icon: <Twitter className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      color: 'hover:bg-black hover:text-white',
    },
    {
      name: 'Instagram',
      icon: <Instagram className="h-4 w-4" />,
      href: 'https://instagram.com',
      color: 'hover:bg-pink-500 hover:text-white',
    },
  ];

  const containerClass =
    variant === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-2 flex-wrap';

  return (
    <div className={`flex ${containerClass} items-center`}>
      <span className="text-sm font-semibold text-muted-foreground mr-1">Compartir:</span>
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          size="icon"
          asChild
          className={link.color}
          aria-label={`Compartir en ${link.name}`}
        >
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.icon}
          </a>
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopy}
        aria-label="Copiar enlace"
        className="hover:bg-primary hover:text-primary-foreground"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
