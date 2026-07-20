import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Pill "Sistema online" / "Disponivel para novos projetos". */
export function StatusBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line bg-bg-subtle px-4 py-1.5',
        'text-[0.78rem] font-medium text-fg-muted [box-shadow:var(--shadow-neon-border)]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 animate-pulse-dot rounded-full bg-neon"
      />
      {children}
    </span>
  );
}

/** Chip de tecnologia usado na Stack e na Trajetoria. */
export function TechBadge({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-[0.8rem] font-medium',
        'transition-all duration-200 ease-[var(--ease-smooth)]',
        accent
          ? 'border-neon/35 bg-neon-soft text-neon hover:border-neon/60 hover:[box-shadow:var(--shadow-accent-border-soft)]'
          : 'border-line bg-bg-subtle text-fg-muted hover:border-line-strong hover:text-fg',
      )}
    >
      {children}
    </span>
  );
}
