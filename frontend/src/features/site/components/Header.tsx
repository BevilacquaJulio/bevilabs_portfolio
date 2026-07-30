import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/cn';
import { NAV_LINKS } from '../data/content';

const NAV_IDS = NAV_LINKS.map((link) => link.id);
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const activeId = useActiveSection(NAV_IDS);
  const reducedMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 24));

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const toggle = toggleRef.current;
    const content = document.getElementById('conteudo') as
      (HTMLElement & { inert: boolean }) | null;
    const footer = document.getElementById('site-footer') as
      (HTMLElement & { inert: boolean }) | null;

    document.body.dataset.menuOpen = 'true';
    [content, footer].forEach((element) => {
      if (!element) return;
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });

    const focusables = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (element) => element.offsetParent !== null,
      );

    requestAnimationFrame(() => focusables()[0]?.focus());

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const elements = focusables();
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      delete document.body.dataset.menuOpen;
      [content, footer].forEach((element) => {
        if (!element) return;
        element.inert = false;
        element.removeAttribute('aria-hidden');
      });
      window.removeEventListener('keydown', handleKeydown);
      requestAnimationFrame(() => toggle?.focus());
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={reducedMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-[var(--z-header)] border-b pt-[env(safe-area-inset-top)]',
          'transition-[background-color,border-color] duration-200 ease-[var(--ease-out)]',
          scrolled
            ? 'border-line bg-bg/92 backdrop-blur-xl'
            : 'border-transparent bg-bg/78 backdrop-blur-md',
        )}
      >
        <div className="layout grid min-h-[var(--header-h)] grid-cols-[1fr_auto] items-center gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          <a
            href="#inicio"
            className="group inline-flex min-h-11 min-w-11 items-center gap-2.5 justify-self-start rounded-full pr-2.5"
            aria-label="Bevilacqua Labs, início"
          >
            <span className="grid size-8 place-items-center rounded-full bg-ink font-display text-[0.78rem] font-bold text-paper transition-transform duration-200 ease-[var(--ease-out)] group-active:scale-[0.97]">
              B
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-[-0.025em] sm:inline">
              Bevilacqua Labs
            </span>
          </a>

          <nav
            className="hidden items-center gap-5 rounded-full border border-line bg-bg-elevated/90 px-4 py-1.5 shadow-[0_8px_30px_rgb(16_16_15_/_0.05)] lg:flex"
            aria-label="Navegação principal"
          >
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} active={activeId === link.id} />
            ))}
          </nav>

          <div className="hidden items-center gap-2 justify-self-end lg:flex">
            <Link
              to="/admin"
              aria-label="Área administrativa privada"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-bg-elevated text-fg-muted transition-[color,border-color,background-color,transform] duration-200 ease-[var(--ease-out)] hover:border-line-strong hover:bg-bg-subtle hover:text-fg active:scale-[0.97]"
            >
              <Icon name="lock" className="size-4" weight="bold" />
            </Link>
            <a
              href="#contato"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink bg-ink px-4 text-[0.82rem] font-semibold text-paper transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-px hover:shadow-[0_12px_28px_rgb(16_16_15_/_0.2)] active:scale-[0.97]"
            >
              Falar comigo
              <Icon name="arrowUpRight" className="size-4" weight="bold" />
            </a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="col-start-2 inline-flex size-11 items-center justify-center justify-self-end rounded-full border border-line bg-bg-elevated text-fg transition-[transform,background-color,border-color] duration-200 ease-[var(--ease-out)] active:scale-[0.97] lg:hidden"
          >
            <Icon name={menuOpen ? 'x' : 'menu'} className="size-5" weight="bold" />
          </button>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ scaleX: reducedMotion ? 0 : scrollYProgress }}
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-ink lg:hidden"
        />
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{
              duration: reducedMotion ? 0 : 0.24,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="fixed inset-x-0 bottom-0 top-[calc(var(--header-h)+env(safe-area-inset-top))] z-[var(--z-menu)] overflow-y-auto overscroll-contain bg-bg px-[var(--layout-pad)] pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pt-5 sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] lg:hidden"
          >
            <nav className="flex min-h-full flex-col" aria-label="Navegação mobile">
              <div className="flex-1 border-t border-line">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={activeId === link.id ? 'location' : undefined}
                    className="group flex min-h-14 items-center justify-between border-b border-line py-2.5 font-display text-[clamp(1.2rem,5.8vw,1.6rem)] font-semibold tracking-[-0.038em] transition-colors duration-200 hover:text-fg-muted sm:min-h-14 sm:text-[clamp(1.32rem,5.2vw,1.85rem)]"
                  >
                    <span>{link.label}</span>
                    <Icon
                      name="arrowUpRight"
                      className={cn(
                        'size-5 transition-[opacity,transform] duration-200',
                        activeId === link.id
                          ? 'opacity-100'
                          : 'translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                      )}
                    />
                  </a>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 sm:mt-6 sm:gap-4">
                <p className="min-w-0 max-w-[15rem] text-[0.7rem] leading-relaxed text-fg-subtle sm:text-xs">
                  Sistemas digitais, do banco de dados à experiência final.
                </p>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold"
                >
                  <Icon name="lock" className="size-4" />
                  Admin
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      aria-current={active ? 'location' : undefined}
      className={cn(
        'relative inline-flex min-h-7 items-center text-xs font-semibold transition-colors duration-200',
        active ? 'text-fg' : 'text-fg-muted hover:text-fg',
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 -bottom-1 h-px origin-left bg-ink transition-transform duration-200',
          active ? 'scale-x-100' : 'scale-x-0',
        )}
      />
    </a>
  );
}
