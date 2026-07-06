import { cn } from '@/lib/utils';

interface AdSlotProps {
  slot: string;
  className?: string;
  format?: 'leaderboard' | 'rectangle' | 'square' | 'skyscraper';
}

export function AdSlot({ slot, className, format = 'leaderboard' }: AdSlotProps) {
  const sizes = {
    leaderboard: 'h-[90px] sm:h-[120px]',
    rectangle: 'h-[250px]',
    square: 'h-[250px] sm:h-[300px]',
    skyscraper: 'h-[600px]',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30',
        sizes[format],
        className
      )}
      data-ad-slot={slot}
      aria-label="Espacio publicitario"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Publicidad
        </p>
        <p className="text-sm text-muted-foreground mt-1">Google AdSense · {slot}</p>
      </div>
    </div>
  );
}
