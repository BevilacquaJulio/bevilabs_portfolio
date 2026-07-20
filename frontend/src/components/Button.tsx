import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
};

const BASE =
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold ' +
  'transition-all duration-300 ease-[var(--ease-smooth)] disabled:cursor-not-allowed disabled:opacity-55 ' +
  'active:scale-[0.97] motion-reduce:active:scale-100';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-bg text-neon [box-shadow:var(--shadow-accent-glow-strong)] ' +
    'hover:not-disabled:-translate-y-0.5 hover:not-disabled:[box-shadow:0_0_15px_rgba(0,240,255,0.9),0_0_40px_rgba(0,240,255,0.55),0_8px_25px_rgba(0,240,255,0.3)]',
  ghost:
    'border-[1.5px] border-white/12 bg-transparent text-fg [box-shadow:var(--shadow-neon-border)] ' +
    'hover:not-disabled:border-line-strong hover:not-disabled:bg-bg-subtle hover:not-disabled:[box-shadow:var(--shadow-neon-glow)]',
  danger:
    'border-[1.5px] border-danger/30 bg-transparent text-danger ' +
    'hover:not-disabled:border-danger/50 hover:not-disabled:bg-danger/8',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-[0.8rem]',
  md: 'px-8 py-3.5 text-[0.95rem]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'ghost', size = 'md', isLoading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={props.type ?? 'button'}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.12)_50%,transparent_60%)] transition-transform duration-600 group-hover:translate-x-full"
        />
      )}
    </button>
  );
});
