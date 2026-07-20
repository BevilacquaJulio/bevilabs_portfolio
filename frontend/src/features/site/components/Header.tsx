import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';
import { NAV_LINKS } from '../data/content';
import { useActiveSection } from '@/hooks/useActiveSection';

const NAV_IDS = NAV_LINKS.map((link) => link.id);

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(NAV_IDS);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 24));

  // Trava o scroll do body enquanto o menu mobile esta aberto.
  useEffect(() => {
    document.body.dataset.menuOpen = String(menuOpen);
    return () => {
      delete document.body.dataset.menuOpen;
    };
  }, [menuOpen]);

  // Fecha o menu ao passar para o breakpoint desktop.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const handler = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Esc fecha o menu.
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [menuOpen]);

  const desktopLinks = NAV_LINKS.slice(0, 3);
  const desktopLinksEnd = NAV_LINKS.slice(3);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-100 border-b transition-[background,border-color,padding] duration-300',
          'pt-[env(safe-area-inset-top)] backdrop-blur-xl',
          scrolled
            ? 'border-line bg-bg/85 py-3'
            : 'border-transparent bg-bg/60 py-3.5 md:py-5',
        )}
      >
        <div className="layout grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          <nav className="hidden items-center gap-8 justify-self-start md:flex" aria-label="Principal">
            {desktopLinks.map((link) => (
              <NavLink key={link.href} {...link} active={activeId === link.id} />
            ))}
          </nav>

          <a
            href="#inicio"
            className="group col-start-1 flex items-center gap-3 justify-self-start transition-opacity hover:opacity-85 md:col-start-2 md:justify-self-center"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-bg font-display text-[1.05rem] font-extrabold text-neon [box-shadow:var(--shadow-accent-glow-strong)] transition-transform duration-300 group-hover:scale-105 md:size-10">
              B
            </span>
            <span className="hidden font-display text-[0.95rem] font-bold tracking-[-0.02em] sm:inline md:text-[1.05rem]">
              Bevilacqua Labs<sup className="reg">®</sup>
            </span>
          </a>

          <nav
            className="hidden items-center gap-8 justify-self-end md:flex"
            aria-label="Secundaria"
          >
            {desktopLinksEnd.map((link) => (
              <NavLink key={link.href} {...link} active={activeId === link.id} />
            ))}
            <Link
              to="/admin"
              aria-label="Area administrativa"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-line text-fg-muted [box-shadow:var(--shadow-neon-border)] transition-all duration-200 hover:border-line-strong hover:bg-bg-subtle hover:text-fg"
            >
              <Icon name="lock" className="size-4" />
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="col-start-2 inline-flex size-11 items-center justify-center justify-self-end rounded-lg border border-line bg-bg-subtle text-fg [box-shadow:var(--shadow-neon-border)] transition-all hover:border-line-strong md:hidden"
          >
            <span className="relative block h-[0.85rem] w-[1.15rem]" aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  className="absolute left-0 h-0.5 w-full rounded-full bg-current"
                  initial={false}
                  animate={
                    menuOpen
                      ? [
                          { top: '50%', y: '-50%', rotate: 45 },
                          { opacity: 0 },
                          { top: '50%', y: '-50%', rotate: -45 },
                        ][index]
                      : [
                          { top: 0, y: 0, rotate: 0 },
                          { top: '50%', y: '-50%', opacity: 1 },
                          { top: '100%', y: '-100%', rotate: 0 },
                        ][index]
                  }
                  transition={{ duration: 0.22 }}
                />
              ))}
            </span>
          </button>
        </div>

        {/* Barra de progresso da leitura */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-neon [box-shadow:var(--shadow-accent-glow)]"
        />
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Menu mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-99 flex flex-col gap-1 overflow-y-auto border-t border-line bg-bg/97 px-[var(--layout-pad)] py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
          >
            {NAV_LINKS.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * index, duration: 0.25 }}
                className={cn(
                  'block rounded-lg px-4 py-4 text-base font-medium transition-colors',
                  activeId === link.id
                    ? 'bg-bg-subtle text-neon [text-shadow:var(--shadow-accent-text)]'
                    : 'text-fg-muted hover:bg-bg-subtle hover:text-fg',
                )}
              >
                {link.label}
              </motion.a>
            ))}

            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center gap-2 border-t border-line px-4 pt-6 pb-4 text-base font-medium text-fg-subtle transition-colors hover:text-fg"
            >
              <Icon name="lock" className="size-4" />
              Admin
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'relative text-sm font-medium transition-colors duration-200',
        active ? 'text-fg' : 'text-fg-muted hover:text-fg',
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -bottom-1 left-0 h-0.5 bg-neon transition-[width] duration-400 [box-shadow:var(--shadow-accent-glow)]',
          active ? 'w-full' : 'w-0',
        )}
      />
    </a>
  );
}
