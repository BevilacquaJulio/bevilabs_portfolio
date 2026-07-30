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
    'border border-ink bg-ink text-paper [box-shadow:0_8px_20px_rgb(16_16_15_/_0.14)] ' +
    'hover:not-disabled:-translate-y-px hover:not-disabled:[box-shadow:0_12px_28px_rgb(16_16_15_/_0.2)]',
  ghost:
    'border border-line-strong bg-bg-elevated text-fg ' +
    'hover:not-disabled:border-ink hover:not-disabled:bg-bg-subtle',
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
