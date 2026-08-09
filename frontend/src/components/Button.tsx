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
  'relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold ' +
  'transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-[var(--ease-out)] ' +
  'disabled:cursor-not-allowed disabled:opacity-55 ' +
  'active:scale-[0.97] motion-reduce:active:scale-100';

const VARIANTS: Record<Variant, string> = {
  primary:
    'border border-accent bg-accent text-on-accent ' +
    'hover:not-disabled:border-accent-deep hover:not-disabled:bg-accent-deep hover:not-disabled:text-on-accent ' +
    'hover:not-disabled:[box-shadow:var(--shadow-accent)]',
  ghost:
    'border border-line-strong bg-bg-elevated text-fg ' +
    'hover:not-disabled:border-accent hover:not-disabled:bg-bg-subtle hover:not-disabled:text-accent',
  danger:
    'border border-danger/35 bg-bg-elevated text-danger ' +
    'hover:not-disabled:border-danger hover:not-disabled:bg-danger/7',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2.5 text-[0.82rem]',
  md: 'px-7 py-3 text-[0.95rem]',
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
    </button>
  );
});
