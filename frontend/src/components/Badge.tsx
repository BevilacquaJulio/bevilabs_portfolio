import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Pill "Sistema online" / "Disponivel para novos projetos". */
export function StatusBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg-elevated px-3.5 py-1.5',
        'font-mono text-[0.68rem] font-medium tracking-[0.04em] text-fg-muted',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-success" />
      {children}
    </span>
  );
}

/** Chip de tecnologia usado na Stack e na Trajetoria. */
export function TechBadge({
  children,
  accent = false,
  className,
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[0.72rem] font-medium',
        accent ? 'border-ink bg-ink text-paper' : 'border-line bg-bg-muted text-fg-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
