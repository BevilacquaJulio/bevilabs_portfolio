import { Icon } from '@/components/Icon';
import { SectionHeading } from '@/components/SectionHeading';
import { getApiErrorMessage } from '@/lib/api';
import { useProjectsQuery } from '../hooks/useProjectsQuery';
import { ProjectCard } from './ProjectCard';

/**
 * Grade unica: uma coluna no celular, duas no tablet, tres no desktop.
 * Todas as celulas tem o mesmo peso — nenhum projeto ganha destaque de layout.
 */
const PROJECTS_GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5';

export function ProjectsSection() {
  const { data, isLoading, isError, error, refetch } = useProjectsQuery();
  const projects = data?.data ?? [];

  return (
    <section
      id="projetos"
      aria-labelledby="projects-title"
      className="relative z-2 scroll-mt-24 border-b border-line bg-bg-subtle py-12 sm:py-14 md:py-20"
    >
      <div className="layout">
        <SectionHeading
          eyebrow="Projetos"
          title="Sistemas que eu já construí"
          subtitle="Conheça alguns projetos que tirei do papel e as tecnologias que usei."
          align="left"
          id="projects-title"
        />

        <div>
          {isLoading && <ProjectsSkeleton />}

          {isError && (
            <EmptyState
              icon="alert"
              title="Não consegui carregar os projetos"
              text={getApiErrorMessage(error)}
              action={
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ink bg-ink px-5 text-sm font-semibold text-paper transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transform-none motion-reduce:transition-none sm:w-auto sm:px-6"
                >
                  Tentar de novo
                </button>
              }
            />
          )}

          {!isLoading && !isError && projects.length === 0 && (
            <EmptyState
              icon="folder"
              title="Nenhum projeto publicado ainda"
              text="Em breve novidades por aqui."
            />
          )}

          {!isLoading && !isError && projects.length > 0 && (
            /* Sem orquestracao na grade: cada ficha dispara pela propria posicao. */
            <div className={PROJECTS_GRID}>
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Espelha a ficha real: mesma moldura, mesmos blocos, mesmas reguas. */
function ProjectsSkeleton() {
  return (
    <div className={PROJECTS_GRID} role="status" aria-label="Carregando projetos">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex min-h-[19rem] flex-col rounded-[var(--radius-md)] border border-line bg-bg-elevated p-5 motion-safe:animate-pulse sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="size-10 rounded-[var(--radius-sm)] bg-bg-muted" />
            <span className="h-3 w-6 rounded bg-bg-muted" />
          </div>
          <span className="mt-5 h-2.5 w-20 rounded bg-bg-muted sm:mt-6" />
          <span className="mt-3 h-6 w-3/4 rounded bg-bg-muted" />
          <span className="mt-4 h-3 w-full rounded bg-bg-muted" />
          <span className="mt-2 h-3 w-11/12 rounded bg-bg-muted" />
          <span className="mt-2 h-3 w-2/3 rounded bg-bg-muted" />
          <div className="mt-5 border-t border-line pt-3.5 sm:mt-6">
            <span className="block h-3 w-2/5 rounded bg-bg-muted" />
          </div>
          <div className="mt-auto border-t border-line pt-3.5">
            <span className="block h-3 w-1/2 rounded bg-bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
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
    <div className="flex min-h-[14rem] flex-col items-center justify-center rounded-[var(--radius-md)] border border-line bg-bg-elevated px-4 py-9 text-center [box-shadow:var(--shadow-panel)] sm:min-h-[17rem] sm:px-6 sm:py-12">
      <span className="mb-4 inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-bg-subtle text-fg-subtle sm:size-12">
        <Icon name={icon} className="size-5" />
      </span>
      <p className="font-display text-lg leading-tight font-bold tracking-[-0.02em] text-fg sm:text-xl">
        {title}
      </p>
      <p className="mt-3 max-w-md text-sm leading-6 text-fg-muted">{text}</p>
      {action}
    </div>
  );
}
