import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
  accentColor?: string;
  className?: string;
}

export function SectionHeader({
  title,
  href,
  linkText = 'Ver todo',
  accentColor,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      <div className="flex items-center gap-3">
        {accentColor && (
          <span
            className="h-8 w-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        )}
        <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-tight">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          {linkText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
