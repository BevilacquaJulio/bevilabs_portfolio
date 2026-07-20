import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { normalizeProjectIcon } from '@/components/project-icons';
import { getApiErrorMessage } from '@/lib/api';
import {
  useDeleteProjectMutation,
  useProjectsQuery,
} from '@/features/projects/hooks/useProjectsQuery';
import type { Project } from '@/features/projects/projects.types';

type ProjectListProps = {
  onEdit: (project: Project) => void;
  editingId?: string;
};

export function ProjectList({ onEdit, editingId }: ProjectListProps) {
  const { data, isLoading, isError, error } = useProjectsQuery();
  const deleteMutation = useDeleteProjectMutation();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const projects = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3" role="status" aria-label="Carregando projetos">
        {Array.from({ length: 3 }).map((_, index) => (
          <span key={index} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="panel flex items-center gap-2 p-6 text-sm text-danger">
        <Icon name="alert" className="size-4 shrink-0" />
        {getApiErrorMessage(error)}
      </p>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="panel p-8 text-center text-sm font-light text-fg-muted">
        Nenhum projeto cadastrado. Use o formulario ao lado para adicionar o primeiro.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {projects.map((project) => (
          <motion.li
            key={project.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25 }}
            className={
              'panel flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center ' +
              (editingId === project.id ? 'border-neon/40' : '')
            }
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-neon">
              <Icon name={normalizeProjectIcon(project.icon)} className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-[0.95rem] font-bold">{project.title}</h3>
              <p className="truncate text-[0.8rem] font-light text-fg-muted">
                {project.description}
              </p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-[0.75rem] text-fg-subtle transition-colors hover:text-neon"
              >
                {project.link}
                <Icon name="arrowUpRight" className="size-3" />
              </a>
            </div>

            <div className="flex shrink-0 gap-2">
              {confirmingId === project.id ? (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={deleteMutation.isPending}
                    onClick={async () => {
                      await deleteMutation.mutateAsync(project.id);
                      setConfirmingId(null);
                    }}
                  >
                    Confirmar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmingId(null)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(project)}
                    aria-label={`Editar ${project.title}`}
                  >
                    <Icon name="pencil" className="size-4" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmingId(project.id)}
                    aria-label={`Excluir ${project.title}`}
                  >
                    <Icon name="trash" className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
