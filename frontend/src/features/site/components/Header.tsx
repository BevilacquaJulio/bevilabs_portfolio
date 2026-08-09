import { useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { ActionButton } from '@/features/site/components/ActionButton';
import { Icon } from '@/components/Icon';
import { useActiveSection } from '@/features/site/hooks/useActiveSection';
import { cn } from '@/lib/cn';
import { EASE_OUT } from '@/lib/motion';
import { NAV_LINKS, PROFILE } from '../data/content';

const NAV_IDS = NAV_LINKS.map((link) => link.id);

/**
 * Ponto em que o header deixa de ser parte da hero e vira barra.
 * Baixo de propósito: a mudança acontece no primeiro gesto de scroll.
 */
const COMPACT_AT = 48;

/** Mola do indicador que corre entre os itens do menu. */
const PILL_SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 0.7 } as const;

/**
 * Header.
 *
 * Uma peça só, em três grupos: marca, menu e ações. No topo da página os três
 * ficam afastados e o menu tem a própria pastilha. Ao rolar, a distância entre
 * eles fecha e a pastilha migra para fora: os três viram um bloco único, menor
 * e flutuante. Voltando à hero, o movimento se desfaz.
 *
 * O que anima é `gap`, `padding`, cor e sombra, tudo interpolável em CSS. Não
 * há morfose de layout nem FLIP: o mesmo comportamento vale no celular, onde a
 * pastilha mostra só os ícones e abre o rótulo do item ativo.
 */
export function Header() {
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const activeId = useActiveSection(NAV_IDS);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Sem listener de scroll nativo: o Framer já observa o documento por nós.
  useMotionValueEvent(scrollY, 'change', (value) => {
    // Histerese de 12px para o header não piscar quando o scroll para no limite.
    setCompact((previous) => (previous ? value > COMPACT_AT - 12 : value > COMPACT_AT));
  });

  return (
    <motion.header
      data-compact={compact || undefined}
      initial={reducedMotion ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
      className="site-header fixed inset-x-0 top-0 z-[var(--z-header)] px-3 pt-[calc(0.6rem+env(safe-area-inset-top))] sm:px-[var(--layout-pad)] sm:pt-[calc(0.85rem+env(safe-area-inset-top))]"
    >
      <div
        className={cn(
          'mx-auto flex w-fit max-w-full items-center rounded-full border',
          'transition-[gap,padding,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-out)]',
          compact
            ? 'gap-1 border-line bg-white/80 p-1.5 backdrop-blur-xl [box-shadow:0_1px_0_rgb(255_255_255/0.8)_inset,0_14px_34px_rgb(7_26_49/0.1)] sm:gap-1.5'
            : 'gap-2 border-transparent bg-transparent p-0 min-[400px]:gap-3 sm:gap-[clamp(1.25rem,5vw,5rem)] xl:gap-[clamp(1.5rem,4vw,4rem)]',
        )}
      >
        <a
          href="#inicio"
          aria-label={`${PROFILE.brand}, início`}
          className="group inline-flex shrink-0 items-center rounded-full py-0.5 pr-1"
        >
          <img
            src="/images/brand/logo-blabs.png"
            alt=""
            aria-hidden="true"
            width={937}
            height={254}
            style={{
              height: compact ? '22px' : '30px',
              width: 'auto',
              maxWidth: compact ? '7.75rem' : '10rem',
              objectFit: 'contain',
              objectPosition: 'left center',
            }}
            className="block max-[399px]:!h-6 max-[399px]:!max-w-[5.75rem] transition-[height,max-width] duration-500 ease-[var(--ease-out)] group-active:scale-[0.97]"
          />
        </a>

        <nav
          aria-label="Navegação principal"
          onMouseLeave={() => setHovered(null)}
          className={cn(
            'flex min-w-0 shrink items-center rounded-full border',
            'transition-[gap,padding,background-color,border-color,box-shadow] duration-500 ease-[var(--ease-out)]',
            compact
              ? 'gap-0.5 border-transparent bg-transparent p-0 shadow-none'
              : 'gap-0.5 border-line bg-white/70 p-0.5 backdrop-blur-md [box-shadow:0_1px_0_rgb(255_255_255/0.8)_inset,0_12px_30px_rgb(7_26_49/0.08)] min-[400px]:p-1 sm:p-1.5',
          )}
        >
          {NAV_LINKS.map((link) => (
            <NavItem
              key={link.id}
              {...link}
              active={activeId === link.id}
              hovered={hovered === link.id}
              onHover={() => setHovered(link.id)}
            />
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <ActionButton
            to="/admin"
            variant="icon"
            size={compact ? 'sm' : 'md'}
            icon="lock"
            aria-label="Área administrativa privada"
          />
          <ActionButton href="#contato" variant="primary" size="sm" icon="arrowUpRight">
            Falar comigo
          </ActionButton>
        </div>
      </div>
    </motion.header>
  );
}

type NavItemProps = (typeof NAV_LINKS)[number] & {
  active: boolean;
  hovered: boolean;
  onHover: () => void;
};

function NavItem({ href, label, icon, active, hovered, onHover }: NavItemProps) {
  const reducedMotion = useReducedMotion();

  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={onHover}
      onFocus={onHover}
      aria-current={active ? 'location' : undefined}
      className={cn(
        'group relative isolate inline-flex min-h-11 min-w-0 items-center gap-2 rounded-full',
        'px-1.5 text-[0.76rem] font-semibold whitespace-nowrap min-[360px]:px-2',
        'sm:px-2.5 sm:text-[0.8rem] xl:px-4 xl:text-[0.82rem]',
        'transition-colors duration-200 ease-[var(--ease-out)]',
        active ? 'text-on-accent' : 'text-fg-muted hover:text-ink',
      )}
    >
      {/* Pastilha do item ativo. Corre de um item ao outro com mola. */}
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          transition={reducedMotion ? { duration: 0 } : PILL_SPRING}
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-accent [box-shadow:0_6px_16px_rgb(27_79_166/0.32)]"
        />
      )}

      {/* Realce do hover. Também corre, mas só entre os itens inativos. */}
      {!active && hovered && (
        <motion.span
          layoutId="nav-hover-pill"
          transition={reducedMotion ? { duration: 0 } : PILL_SPRING}
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-ink/[0.06]"
        />
      )}

      <Icon
        name={icon}
        className={cn(
          'size-4 shrink-0 transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transform-none',
          !active && 'group-hover:-translate-y-px',
        )}
        weight={active ? 'fill' : 'regular'}
      />

      {/*
       * No celular só o item ativo mostra o rótulo, e ele trunca se precisar.
       * É o que mantém as cinco seções em uma linha só desde 320px, sem
       * empurrar nada para fora da tela.
       */}
      <span className={cn('truncate max-[359px]:hidden', active ? 'inline' : 'hidden xl:inline')}>
        {label}
      </span>
    </a>
  );
}
