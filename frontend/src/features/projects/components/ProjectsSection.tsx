import { useCallback, useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { MagneticButton } from '@/components/MagneticButton';
import { SectionHeading } from '@/components/SectionHeading';
import { getApiErrorMessage } from '@/lib/api';
import { cursorSpring, EASE_OUT } from '@/lib/motion';
import { PROJECTS_SECTION } from '@/features/site/data/content';
import { useProjectsQuery } from '../hooks/useProjectsQuery';
import { getProjectHost, getProjectTechnologies } from '../project-tech';
import { getSafeProjectUrl, type Project } from '../projects.types';
import { ProjectRow } from './ProjectRow';

const PREVIEW = { width: 304, height: 214, offset: 28, pad: 16 } as const;

export function ProjectsSection() {
  const { data, isLoading, isError, error, refetch } = useProjectsQuery();
  const projects = data?.data ?? [];

  const [hovered, setHovered] = useState<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, cursorSpring);
  const y = useSpring(rawY, cursorSpring);

  // O painel que segue o cursor só existe onde há cursor de verdade.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const sync = () => setFinePointer(media.matches);

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  /**
   * A posição vive em motion values, fora do ciclo de render do React.
   * Guardar isso em estado dispararia um render a cada pixel de movimento.
   */
  const trackPointer = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!finePointer || event.pointerType !== 'mouse') return;

      const maxLeft = window.innerWidth - PREVIEW.width - PREVIEW.pad;
      const maxTop = window.innerHeight - PREVIEW.height - PREVIEW.pad;

      rawX.set(Math.min(event.clientX + PREVIEW.offset, maxLeft));
      rawY.set(Math.min(Math.max(event.clientY - PREVIEW.height / 2, PREVIEW.pad), maxTop));
    },
    [finePointer, rawX, rawY],
  );

  const handleEnter = useCallback(
    (index: number) => {
      if (finePointer) setHovered(index);
    },
    [finePointer],
  );

  const handleLeave = useCallback(() => setHovered(null), []);

  const preview = hovered !== null ? projects[hovered] : undefined;

  return (
    <section
      id="projetos"
      aria-labelledby="projetos-title"
      className="surface-projects surface-texture relative z-[var(--z-content)] scroll-mt-24 py-14 sm:py-20 md:py-28"
    >
      <div className="layout">
        <SectionHeading
          id="projetos-title"
          label={PROJECTS_SECTION.label}
          title={PROJECTS_SECTION.title}
          subtitle={PROJECTS_SECTION.subtitle}
        />

        <div className="mt-10 md:mt-14">
          {isLoading && <ProjectsSkeleton />}

          {isError && (
            <Placeholder
              icon="alert"
              title="Não consegui carregar os projetos"
              text={getApiErrorMessage(error)}
              action={
                <MagneticButton
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-on-accent transition-[transform,background-color] duration-200 ease-[var(--ease-out)] hover:bg-accent-deep active:scale-[0.97] motion-reduce:transform-none sm:w-auto"
                >
                  Tentar de novo
                </MagneticButton>
              }
            />
          )}

          {!isLoading && !isError && projects.length === 0 && (
            <Placeholder
              icon="folder"
              title="Nenhum projeto publicado ainda"
              text="Os sistemas aparecem aqui assim que forem publicados."
            />
          )}

          {!isLoading && !isError && projects.length > 0 && (
            <ul
              className="border-t border-line"
              onPointerMove={trackPointer}
              onPointerLeave={handleLeave}
            >
              {projects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={index}
                  onEnter={handleEnter}
                  onLeave={handleLeave}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <AnimatePresence>
        {finePointer && preview && (
          <ProjectPreview key={preview.id} project={preview} index={hovered ?? 0} x={x} y={y} />
        )}
      </AnimatePresence>
    </section>
  );
}

type PreviewProps = {
  project: Project;
  index: number;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
};

/**
 * Ficha do projeto que acompanha o cursor.
 *
 * Ela existe para dar ao desktop a informação que a linha não carrega: a
 * descrição inteira e o destino. É uma ficha, não uma simulação de tela.
 */
function ProjectPreview({ project, index, x, y }: PreviewProps) {
  const host = getProjectHost(getSafeProjectUrl(project.link));
  const technologies = getProjectTechnologies(project);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y, width: PREVIEW.width }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.16 } }}
      transition={{ duration: 0.24, ease: EASE_OUT }}
      className="pointer-events-none fixed top-0 left-0 z-[var(--z-rail)] hidden overflow-hidden rounded-[var(--radius-md)] bg-ink [box-shadow:var(--shadow-float)] lg:block"
    >
      <span aria-hidden="true" className="blueprint absolute inset-0 opacity-70" />

      <div className="relative flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="meta text-accent-soft">{String(index + 1).padStart(2, '0')}</span>
          <Icon name="arrowUpRight" className="size-4 text-on-dark-muted" weight="bold" />
        </div>

        <p className="mt-5 font-display text-[1.05rem] leading-[1.15] font-bold tracking-[-0.03em] text-on-dark">
          {project.title}
        </p>

        <p className="mt-2.5 line-clamp-3 text-[0.8rem] leading-[1.5] text-on-dark-muted">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/16 px-2 py-0.5 font-mono text-[0.58rem] font-medium text-on-dark-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="mt-3 border-t border-white/12 pt-3 font-mono text-[0.62rem] tracking-[0.06em] text-on-dark-muted">
          {host ?? 'Link indisponível'}
        </p>
      </div>
    </motion.div>
  );
}

/** Espelha o ritmo real da lista: mesma altura de linha, mesmas réguas. */
function ProjectsSkeleton() {
  return (
    <div className="border-t border-line" role="status" aria-label="Carregando projetos">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="grid gap-y-3 border-b border-line py-6 sm:py-7 md:grid-cols-[3rem_minmax(0,1fr)_auto] md:items-center md:gap-x-8 md:py-8"
        >
          <span className="skeleton block h-2.5 w-6 rounded-full" />
          <span className="skeleton block h-6 w-3/5 rounded-full md:h-8" />
          <span className="skeleton block h-2.5 w-32 rounded-full md:justify-self-end" />
        </div>
      ))}
    </div>
  );
}

function Placeholder({
  icon,
  title,
  text,
  action,
}: {
  icon: 'folder' | 'alert';
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="panel flex min-h-[13rem] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[15rem] sm:px-8">
      <span className="mb-4 inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-bg-subtle text-fg-subtle">
        <Icon name={icon} className="size-5" />
      </span>
      <p className="font-display text-lg leading-tight font-bold tracking-[-0.025em] text-ink sm:text-xl">
        {title}
      </p>
      <p className="mt-2.5 max-w-md text-sm leading-6 text-fg-muted">{text}</p>
      {action}
    </div>
  );
}
