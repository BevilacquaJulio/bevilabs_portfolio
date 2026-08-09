import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DottedSectionBackground } from '@/features/site/components/DottedSectionBackground';
import { SectionHeading } from '@/components/SectionHeading';
import { TechGlyph } from '@/features/site/components/TechGlyph';
import { useDottedFieldPointer } from '@/features/site/hooks/useDottedFieldPointer';
import { cn } from '@/lib/cn';
import { defaultViewport, EASE_OUT, hoverSpring, stepDelay } from '@/lib/motion';
import { STACK_SECTION, TECH_GROUPS, TECH_ITEMS, type TechGroupId } from '../data/content';

/**
 * Stack.
 *
 * Dezesseis tecnologias, todas visíveis de uma vez, cada uma com a marca real.
 * Nada fica escondido atrás de hover: o recrutador escaneia a grade inteira em
 * um golpe de vista e só usa o filtro se quiser entender a divisão por camada.
 *
 * Filtrar não remove nenhuma peça da grade. As que estão fora da camada apenas
 * recuam, então a leitura não muda de forma e o layout não pula.
 */
export function TechStack() {
  const [active, setActive] = useState<TechGroupId | null>(null);
  const reducedMotion = useReducedMotion();
  const dots = useDottedFieldPointer();

  const activeGroup = TECH_GROUPS.find((group) => group.id === active);

  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      onPointerMove={dots.onPointerMove}
      onPointerLeave={dots.onPointerLeave}
      className="surface-stack relative isolate z-[var(--z-content)] scroll-mt-24 overflow-hidden py-14 text-on-dark sm:py-20 md:py-28"
    >
      <DottedSectionBackground x={dots.x} y={dots.y} presence={dots.presence} />
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_75%_60%_at_20%_0%,rgb(39_101_204/0.3),transparent_66%)]"
      />
      {/* Fio de luz na emenda: marca onde a página escurece. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-soft/50 to-transparent"
      />

      <div className="layout relative z-[1]">
        <SectionHeading
          id="stack-title"
          label={STACK_SECTION.label}
          title={STACK_SECTION.title}
          subtitle={STACK_SECTION.subtitle}
          tone="dark"
        />

        {/* Filtro por camada. */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE_OUT }}
          role="group"
          aria-label="Filtrar tecnologias por camada"
          className="mt-10 flex flex-wrap gap-2 md:mt-14"
        >
          <FilterChip active={active === null} onClick={() => setActive(null)}>
            Tudo
          </FilterChip>
          {TECH_GROUPS.map((group) => (
            <FilterChip
              key={group.id}
              active={active === group.id}
              onClick={() => setActive(active === group.id ? null : group.id)}
            >
              {group.name}
            </FilterChip>
          ))}
        </motion.div>

        {/* Linha de contexto da camada selecionada. */}
        <div className="mt-4 min-h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeGroup?.id ?? 'all'}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: EASE_OUT }}
              className="font-mono text-[0.7rem] tracking-[0.06em] text-on-dark-muted"
            >
              {activeGroup
                ? activeGroup.role
                : `${TECH_ITEMS.length} tecnologias em uso, das quatro camadas`}
            </motion.p>
          </AnimatePresence>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-8">
          {TECH_ITEMS.map((item, index) => {
            const dimmed = active !== null && item.group !== active;

            return (
              <motion.li
                key={item.slug}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={defaultViewport}
                transition={{ duration: 0.5, delay: stepDelay(index, 0.045, 10), ease: EASE_OUT }}
              >
                <motion.div
                  animate={{
                    opacity: dimmed ? 0.22 : 1,
                    scale: dimmed ? 0.95 : 1,
                  }}
                  whileHover={reducedMotion || dimmed ? undefined : { y: -5 }}
                  transition={hoverSpring}
                  className={cn(
                    'group flex h-full flex-col items-center justify-center gap-2.5 rounded-[var(--radius-md)] px-2 py-5',
                    'border border-white/12 bg-white/[0.035]',
                    'transition-[border-color,background-color] duration-300 ease-[var(--ease-out)]',
                    !dimmed && 'hover:border-accent-soft/55 hover:bg-accent/14',
                  )}
                >
                  <TechGlyph
                    slug={item.slug}
                    className="size-6 shrink-0 text-on-dark-muted transition-[color,transform] duration-300 ease-[var(--ease-out)] group-hover:scale-110 group-hover:text-accent-soft motion-reduce:transform-none sm:size-7"
                  />
                  <span className="text-center font-mono text-[0.68rem] leading-tight font-medium text-on-dark sm:text-[0.72rem]">
                    {item.name}
                  </span>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'focus-on-dark relative inline-flex min-h-10 items-center rounded-full px-4 text-[0.82rem] font-semibold',
        'transition-[color,border-color,background-color] duration-300 ease-[var(--ease-out)]',
        active
          ? 'border border-accent-soft/60 bg-accent/20 text-on-dark'
          : 'border border-white/14 text-on-dark-muted hover:border-white/30 hover:text-on-dark',
      )}
    >
      {children}
    </button>
  );
}
