import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '@/components/Icon';
import { cn } from '@/lib/cn';
import { useMagnetic } from '@/features/site/lib/magnetic';

type Variant = 'primary' | 'outline' | 'ghost-dark' | 'icon';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  children?: ReactNode;
  /** Ícone à direita do rótulo. Na variante `icon`, é o conteúdo inteiro. */
  icon?: IconName;
  variant?: Variant;
  size?: Size;
  className?: string;
  'aria-label'?: string;
};

type ActionButtonProps = CommonProps &
  (
    | { href: string; to?: undefined; external?: boolean; download?: string; onClick?: undefined }
    | { to: string; href?: undefined; external?: undefined; download?: undefined; onClick?: undefined }
    | { onClick: () => void; href?: undefined; to?: undefined; external?: undefined; download?: undefined }
  );

/**
 * Botão de ação do site.
 *
 * Todo alvo acionável de destaque passa por aqui, do CTA da hero ao cadeado do
 * header: mesma mola magnética, mesma curva, mesmo deslocamento do ícone e o
 * mesmo afundar no clique. Antes cada lugar tinha a própria versão, e o
 * conjunto reagia como cinco sistemas diferentes em vez de um.
 */
const BASE =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap ' +
  'transition-[background-color,border-color,color,box-shadow] duration-200 ease-[var(--ease-out)]';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent text-on-accent [box-shadow:var(--shadow-accent)] ' +
    'hover:bg-accent-deep hover:[box-shadow:0_16px_36px_rgb(27_79_166/0.34)]',
  outline:
    'border border-accent/40 bg-white/75 text-accent-deep backdrop-blur-sm ' +
    'hover:border-accent hover:bg-accent/10',
  'ghost-dark':
    'focus-on-dark border border-white/16 bg-white/6 text-on-dark ' +
    'hover:border-accent-soft/60 hover:bg-accent/20',
  icon:
    'border border-line bg-white/70 text-fg-subtle backdrop-blur-sm ' +
    'hover:border-accent/45 hover:bg-accent/10 hover:text-accent',
};

const SIZES: Record<Size, string> = {
  sm: 'min-h-9 px-4 text-[0.8rem]',
  md: 'min-h-11 px-5 text-[0.88rem]',
  lg: 'min-h-12 px-7 text-[0.92rem] font-bold',
};

const ICON_SIZES: Record<Size, string> = {
  sm: 'size-9',
  md: 'size-10',
  lg: 'size-12',
};

export function ActionButton({
  children,
  icon,
  variant = 'primary',
  size = 'md',
  className,
  href,
  to,
  external,
  download,
  onClick,
  ...rest
}: ActionButtonProps) {
  const magnetic = useMagnetic(0.26);
  const iconOnly = variant === 'icon';

  const classes = cn(BASE, VARIANTS[variant], iconOnly ? ICON_SIZES[size] : SIZES[size], className);

  const body = (
    <>
      {children}
      {icon && (
        <Icon
          name={icon}
          className={cn(
            'size-4 shrink-0 transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transform-none',
            !iconOnly &&
              (icon === 'arrowDown'
                ? 'group-hover:translate-y-0.5'
                : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'),
          )}
          weight="bold"
        />
      )}
    </>
  );

  const motionProps = {
    style: magnetic.style,
    onPointerMove: magnetic.onPointerMove,
    onPointerLeave: magnetic.onPointerLeave,
    whileTap: { scale: 0.96 },
    transition: { duration: 0.14 },
  } as const;

  if (to) {
    // O `Link` do router não é um componente motion, então a mola mora no
    // invólucro. `inline-flex` para o invólucro ter exatamente a caixa do link.
    return (
      <motion.span className="inline-flex" {...motionProps}>
        <Link to={to} className={classes} {...rest}>
          {body}
        </Link>
      </motion.span>
    );
  }

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={classes}
        {...motionProps}
        {...rest}
      >
        {body}
      </motion.button>
    );
  }

  return (
    <motion.a
      href={href}
      download={download}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={classes}
      {...motionProps}
      {...rest}
    >
      {body}
    </motion.a>
  );
}
