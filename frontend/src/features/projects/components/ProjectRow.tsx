import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/cn';
import { EASE_OUT, stepDelay } from '@/lib/motion';
import { getProjectHost, getProjectTechnologies } from '../project-tech';
import { getSafeProjectUrl, type Project } from '../projects.types';

type ProjectRowProps = {
  project: Project;
  index: number;
  onEnter?: (index: number) => void;
  onLeave?: () => void;
};

/**
 * Uma linha da lista de projetos.
 *
 * Linha, e não card: a lista continua legível com 4 ou com 40 projetos, sem
 * órfão no fim da grade e sem obrigar cada projeto a ter a mesma altura.
 * O que o card mostrava a mais (a descrição) vive no painel de hover no
 * desktop e aparece direto na linha no celular, onde não existe hover.
 */
export function ProjectRow({ project, index, onEnter, onLeave }: ProjectRowProps) {
  const reducedMotion = useReducedMotion();
  const safeLink = getSafeProjectUrl(project.link);
  const host = getProjectHost(safeLink);
  const technologies = getProjectTechnologies(project);
  const number = String(index + 1).padStart(2, '0');

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-[-0.75rem] inset-y-0 rounded-[var(--radius-md)] bg-bg-subtle opacity-0 sm:inset-x-[-1.25rem]',
          'transition-opacity duration-300 ease-[var(--ease-out)]',
          safeLink && 'group-hover:opacity-100 group-focus-visible:opacity-100',
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-2 left-[-0.75rem] w-[2px] origin-center scale-y-0 rounded-full bg-accent sm:left-[-1.25rem]',
          'transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none',
          safeLink && 'group-hover:scale-y-100 group-focus-visible:scale-y-100',
        )}
      />

      <div className="relative grid gap-y-3 md:grid-cols-[3rem_minmax(0,1fr)_auto] md:items-center md:gap-x-8">
        <div className="flex items-center justify-between gap-4 md:block">
          <span
            aria-hidden="true"
            className="meta text-fg-subtle transition-colors duration-300 group-hover:text-accent"
          >
            {number}
          </span>
          <Arrow available={Boolean(safeLink)} className="md:hidden" />
        </div>

        <div className="min-w-0">
          <h3
            className={cn(
              'font-display text-[1.3rem] leading-[1.12] font-bold tracking-[-0.04em] [overflow-wrap:anywhere] text-ink sm:text-[1.55rem] md:text-[clamp(1.55rem,2.6vw,2.1rem)]',
              'transition-[color,transform] duration-300 ease-[var(--ease-out)] motion-reduce:transform-none',
              safeLink && 'group-hover:translate-x-1 group-hover:text-accent',
            )}
          >
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[0.88rem] leading-[1.55] text-fg-muted lg:hidden">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 md:flex-nowrap md:justify-end md:gap-x-4">
          {technologies.length > 0 && (
            <span
              aria-label="Tecnologias citadas neste projeto"
              className="flex flex-wrap items-center gap-1.5"
            >
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="max-w-full rounded-full border border-line bg-bg-elevated px-2.5 py-1 [overflow-wrap:anywhere] font-mono text-[0.62rem] font-medium tracking-[0.02em] text-fg-muted"
                >
                  {tech}
                </span>
              ))}
            </span>
          )}

          <span className="meta min-w-0 max-w-full [overflow-wrap:anywhere] text-fg-subtle md:shrink-0">
            {host ?? 'Link indisponível'}
          </span>

          <Arrow available={Boolean(safeLink)} className="hidden md:inline-flex" />
        </div>
      </div>
    </>
  );

  const shell = cn(
    'group relative block border-b border-line py-6 sm:py-7 md:py-8',
    safeLink
      ? 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
      : 'cursor-default',
  );

  return (
    <motion.li
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, delay: stepDelay(index, 0.07), ease: EASE_OUT }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') onEnter?.(index);
      }}
      onPointerLeave={onLeave}
    >
      {safeLink ? (
        <a
          href={safeLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir projeto ${project.title} em uma nova aba`}
          className={shell}
        >
          {content}
        </a>
      ) : (
        <div className={shell}>{content}</div>
      )}
    </motion.li>
  );
}

function Arrow({ available, className }: { available: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full border',
        'transition-[background-color,border-color,color,transform] duration-300 ease-[var(--ease-out)]',
        'motion-reduce:transform-none',
        available
          ? 'border-line-strong text-fg-muted group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent group-focus-visible:border-accent group-focus-visible:bg-accent group-focus-visible:text-on-accent'
          : 'border-line text-fg-subtle',
        className,
      )}
    >
      <Icon
        name={available ? 'arrowUpRight' : 'lock'}
        className="size-4"
        weight={available ? 'bold' : 'regular'}
      />
    </span>
  );
}
