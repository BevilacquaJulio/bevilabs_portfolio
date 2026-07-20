import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { SectionHeading } from '@/components/SectionHeading';
import { defaultViewport, staggerContainer } from '@/lib/motion';
import { getApiErrorMessage } from '@/lib/api';
import { useProjectsQuery } from '../hooks/useProjectsQuery';
import { ProjectCard } from './ProjectCard';

export function ProjectsSection() {
  const { data, isLoading, isError, error, refetch } = useProjectsQuery();
  const projects = data?.data ?? [];

  return (
    <section id="projetos" className="relative z-2 scroll-mt-24 py-20 md:py-28">
      <div className="layout">
        <SectionHeading
          eyebrow="Projetos"
          title="O que estou construindo"
          subtitle="Sistemas em producao e laboratorios. Clique para acessar."
        />

        {isLoading && <ProjectsSkeleton />}

        {isError && (
          <EmptyState
            icon="alert"
            title="Nao consegui carregar os projetos"
            text={getApiErrorMessage(error)}
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-full border border-line-strong px-5 py-2 text-sm font-medium transition-colors hover:border-neon/45 hover:text-neon"
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
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Carregando projetos"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="panel flex flex-col gap-3 p-6">
          <span className="skeleton size-11 rounded-lg" />
          <span className="skeleton h-5 w-2/3 rounded" />
          <span className="skeleton h-3.5 w-full rounded" />
          <span className="skeleton h-3.5 w-4/5 rounded" />
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
    <div className="panel flex flex-col items-center px-6 py-16 text-center">
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-xl bg-bg-subtle text-fg-subtle">
        <Icon name={icon} className="size-6" />
      </span>
      <p className="font-display text-[1.05rem] font-bold">{title}</p>
      <p className="mt-2 max-w-sm text-sm font-light text-fg-muted">{text}</p>
      {action}
    </div>
  );
}
