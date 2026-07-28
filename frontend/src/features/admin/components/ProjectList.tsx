import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { normalizeProjectIcon } from '@/components/project-icons';
import { cn } from '@/lib/cn';
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
          <span key={index} className="skeleton h-[5.5rem] rounded-[var(--radius-md)]" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="panel flex items-start gap-3 border-danger/25 p-6 text-sm text-danger"
      >
        <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
        <div>
          <p className="font-medium">Nao foi possivel carregar os projetos.</p>
          <p className="mt-1 font-light opacity-80">{getApiErrorMessage(error)}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="panel flex flex-col items-center px-8 py-14 text-center">
        <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-line bg-bg-subtle text-fg-subtle">
          <Icon name="folder" className="size-5" />
        </span>
        <p className="font-display text-[0.95rem] font-bold">Nenhum projeto cadastrado</p>
        <p className="mt-1.5 max-w-xs text-sm font-light text-fg-muted">
          Use o formulario ao lado para adicionar o primeiro.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {projects.map((project, index) => {
          const isEditing = editingId === project.id;
          const isConfirming = confirmingId === project.id;

          return (
            <motion.li
              key={project.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                'panel group/item relative overflow-hidden p-4 transition-colors duration-300',
                'hover:border-line-strong',
                isEditing && 'border-neon/40 [box-shadow:var(--shadow-accent-border-soft)]',
                isConfirming && 'border-danger/35',
              )}
            >
              {/* Marcador lateral do item em edicao */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-y-0 left-0 w-0.5 bg-neon transition-opacity duration-300',
                  isEditing ? 'opacity-100' : 'opacity-0',
                )}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span
                  className={cn(
                    'relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl border text-neon transition-colors duration-300',
                    isEditing
                      ? 'border-neon/40 bg-neon-soft'
                      : 'border-line bg-bg-subtle group-hover/item:border-neon/25',
                  )}
                >
                  <Icon name={normalizeProjectIcon(project.icon)} className="size-5" />
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 -left-1.5 rounded-full bg-bg px-1.5 font-display text-[0.6rem] font-bold text-fg-subtle tabular-nums"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-[0.95rem] font-bold tracking-[-0.01em]">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-[0.8rem] font-light text-fg-muted">
                    {project.description}
                  </p>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex max-w-full items-center gap-1 text-[0.72rem] text-fg-subtle transition-colors hover:text-neon"
                  >
                    <span className="truncate">{project.link}</span>
                    <Icon name="arrowUpRight" className="size-3 shrink-0" />
                  </a>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {isConfirming ? (
                    <>
                      <span className="mr-1 hidden text-[0.75rem] font-medium text-danger sm:inline">
                        Excluir?
                      </span>
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
                        <span className="hidden sm:inline">Editar</span>
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
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
