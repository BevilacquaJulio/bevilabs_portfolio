import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useActiveSection } from '@/features/site/hooks/useActiveSection';
import { cn } from '@/lib/cn';
import { RAIL_SECTIONS } from '@/features/site/data/content';

const RAIL_IDS = RAIL_SECTIONS.map((section) => section.id);

/**
 * Trilho de navegação lateral.
 *
 * É deliberadamente mudo: uma linha, cinco marcas e o preenchimento do
 * progresso. O nome da seção só aparece no hover, dentro da própria etiqueta,
 * para o trilho nunca competir com o texto da página nem invadir a coluna
 * de conteúdo. Some abaixo de 1280px, onde não há goteira para ele.
 */
export function SectionRail() {
  const activeId = useActiveSection(RAIL_IDS);
  const reducedMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();

  // Entra depois que a hero sai de cena. Sem listener: é o mesmo motion value do header.
  const opacity = useTransform(scrollY, [120, 340], [0, 1]);
  const x = useTransform(scrollY, [120, 340], [-14, 0]);

  return (
    <motion.nav
      aria-label="Índice das seções"
      style={reducedMotion ? undefined : { opacity, x }}
      className="fixed top-1/2 left-5 z-[var(--z-rail)] hidden -translate-y-1/2 xl:block"
    >
      <ol className="relative flex flex-col gap-6">
        {/* Trilho e preenchimento ficam atrás das marcas. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-[-0.75rem] left-0 w-px bg-line-strong/70"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: scrollYProgress }}
          className="absolute inset-y-[-0.75rem] left-0 w-px origin-top bg-accent"
        />

        {RAIL_SECTIONS.map((section, index) => {
          const active = activeId === section.id;

          return (
            <li key={section.id} className="relative">
              <a
                href={section.href}
                aria-current={active ? 'location' : undefined}
                className="group flex h-6 items-center gap-2 pl-px"
              >
                <span className="sr-only">{section.label}</span>

                <span
                  aria-hidden="true"
                  className={cn(
                    'h-px origin-left transition-[width,background-color] duration-300 ease-[var(--ease-out)]',
                    active
                      ? 'w-5 bg-accent'
                      : 'w-2.5 bg-line-strong group-hover:w-4 group-hover:bg-fg-muted',
                  )}
                />

                <span
                  aria-hidden="true"
                  className={cn(
                    'font-mono text-[0.6rem] font-medium tabular-nums transition-colors duration-300',
                    active ? 'text-accent' : 'text-fg-subtle/60 group-hover:text-fg-muted',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Etiqueta flutuante: só no hover, com fundo próprio. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute top-1/2 left-[3.25rem] -translate-y-1/2 rounded-full bg-ink px-2.5 py-1',
                    'font-mono text-[0.62rem] font-medium tracking-[0.08em] whitespace-nowrap text-on-dark uppercase',
                    'translate-x-[-6px] opacity-0 transition-[opacity,transform] duration-200 ease-[var(--ease-out)]',
                    'group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
                    'motion-reduce:transition-none',
                  )}
                >
                  {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
