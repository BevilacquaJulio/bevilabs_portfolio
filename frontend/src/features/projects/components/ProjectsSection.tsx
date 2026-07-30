import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { SectionHeading } from '@/components/SectionHeading';
import { defaultViewport, staggerContainer } from '@/lib/motion';
import { getApiErrorMessage } from '@/lib/api';
import { useProjectsQuery } from '../hooks/useProjectsQuery';
import { ProjectCard, type ProjectArtifactVariant, type ProjectCardFormat } from './ProjectCard';

type ProjectLayout = {
  className: string;
  format: ProjectCardFormat;
  artifact: ProjectArtifactVariant;
};

const PROJECT_LAYOUTS: readonly ProjectLayout[] = [
  {
    className: 'lg:col-span-8 lg:min-h-[26rem]',
    format: 'lead',
    artifact: 'index',
  },
  {
    className: 'lg:col-span-4 lg:min-h-[26rem]',
    format: 'compact',
    artifact: 'ledger',
  },
  {
    className: 'lg:col-span-5 lg:min-h-[23rem]',
    format: 'compact',
    artifact: 'route',
  },
  {
    className: 'lg:col-span-7 lg:min-h-[23rem]',
    format: 'wide',
    artifact: 'ledger',
  },
  {
    className: 'lg:col-span-7 lg:min-h-[24rem]',
    format: 'wide',
    artifact: 'route',
  },
  {
    className: 'lg:col-span-5 lg:min-h-[24rem]',
    format: 'compact',
    artifact: 'index',
  },
] as const;

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
          subtitle="Conheça alguns projetos que tirei do papel, os problemas que eles resolvem e as tecnologias que usei."
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
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5"
            >
              {projects.map((project, index) => {
                const layout = PROJECT_LAYOUTS[index % PROJECT_LAYOUTS.length];

                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    format={layout.format}
                    artifact={layout.artifact}
                    className={layout.className}
                  />
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5"
      role="status"
      aria-label="Carregando projetos"
    >
      {Array.from({ length: 3 }).map((_, index) => {
        const layout = PROJECT_LAYOUTS[index];
        const featured = layout.format === 'lead';

        return (
          <div
            key={index}
            aria-hidden="true"
            className={[
              'grid min-h-[20rem] overflow-hidden rounded-[var(--radius-md)] border sm:min-h-[22rem]',
              'motion-safe:animate-pulse',
              layout.className,
              layout.format !== 'compact' && 'md:grid-cols-[minmax(0,1.08fr)_minmax(16rem,0.92fr)]',
              featured ? 'border-ink bg-ink' : 'border-line bg-bg-elevated',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div
              className={[
                'min-h-[9rem] border-b p-4 sm:min-h-[11rem] sm:p-5',
                layout.format !== 'compact' && 'md:order-2 md:min-h-full md:border-b-0 md:border-l',
                featured ? 'border-ink/15 bg-paper' : 'border-white/15 bg-ink',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span
                className={`block h-3 w-24 rounded ${featured ? 'bg-ink/12' : 'bg-white/15'}`}
              />
              <span
                className={`mt-8 block h-14 w-2/3 rounded sm:mt-10 sm:h-16 ${featured ? 'bg-ink/12' : 'bg-white/15'}`}
              />
            </div>
            <div
              className={['flex flex-col p-4 sm:p-6', layout.format !== 'compact' && 'md:p-7']
                .filter(Boolean)
                .join(' ')}
            >
              <span className={`h-3 w-24 rounded ${featured ? 'bg-white/15' : 'bg-bg-muted'}`} />
              <span
                className={`mt-6 h-8 w-4/5 rounded sm:mt-8 sm:h-9 ${featured ? 'bg-white/15' : 'bg-bg-muted'}`}
              />
              <span
                className={`mt-4 h-3.5 w-full rounded ${featured ? 'bg-white/15' : 'bg-bg-muted'}`}
              />
              <span
                className={`mt-2 h-3.5 w-3/4 rounded ${featured ? 'bg-white/15' : 'bg-bg-muted'}`}
              />
            </div>
          </div>
        );
      })}
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
