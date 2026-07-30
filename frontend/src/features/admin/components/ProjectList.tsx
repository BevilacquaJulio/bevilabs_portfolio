import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { normalizeProjectIcon } from '@/components/project-icons';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/lib/api';
import {
  useDeleteProjectMutation,
  useProjectsQuery,
} from '@/features/projects/hooks/useProjectsQuery';
import { getSafeProjectUrl, type Project } from '@/features/projects/projects.types';

type ProjectListProps = {
  onEdit: (project: Project) => void;
  editingId?: string;
};

type DeleteError = {
  projectId: string;
  message: string;
};

export function ProjectList({ onEdit, editingId }: ProjectListProps) {
  const { data, isLoading, isError, error } = useProjectsQuery();
  const deleteMutation = useDeleteProjectMutation();
  const reduceMotion = useReducedMotion();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<DeleteError | null>(null);
  const deleteTriggersRef = useRef(new Map<string, HTMLButtonElement>());
  const restoreDeleteFocusRef = useRef<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const projects = data?.data ?? [];

  const requestDelete = (projectId: string) => {
    setDeleteError(null);
    setConfirmingId(projectId);
  };

  const cancelDelete = () => {
    const projectId = confirmingId;
    restoreDeleteFocusRef.current = projectId;
    setDeleteError(null);
    setConfirmingId(null);
  };

  const confirmDelete = async (project: Project) => {
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(project.id);
      setConfirmingId(null);
      requestAnimationFrame(() => listRef.current?.focus());
    } catch (mutationError) {
      setDeleteError({
        projectId: project.id,
        message: getApiErrorMessage(
          mutationError,
          `Não foi possível excluir ${project.title}. Tente novamente.`,
        ),
      });
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-w-0 overflow-hidden rounded-[1.25rem] border border-line bg-bg-elevated sm:rounded-[1.5rem]"
        role="status"
        aria-label="Carregando projetos"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-w-0 items-center gap-3 border-b border-line p-4 last:border-b-0 sm:gap-4 sm:p-5"
          >
            <span className="skeleton size-12 shrink-0 rounded-xl" />
            <span className="flex flex-1 flex-col gap-2.5">
              <span className="skeleton h-4 w-2/5 rounded-full" />
              <span className="skeleton h-3 w-4/5 rounded-full" />
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex min-w-0 items-start gap-3 rounded-[1.25rem] border border-danger/30 bg-bg-elevated p-4 text-sm text-danger sm:rounded-[1.5rem] sm:p-6"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-danger/10">
          <Icon name="alert" className="size-4" />
        </span>
        <div className="min-w-0 pt-1 break-words">
          <p className="font-semibold">Não foi possível carregar os projetos.</p>
          <p className="mt-1 font-normal opacity-80">{getApiErrorMessage(error)}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex min-h-64 min-w-0 flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-line-strong bg-bg-elevated px-5 py-10 text-center sm:min-h-72 sm:rounded-[1.5rem] sm:px-7 sm:py-12">
        <span className="mb-5 flex size-14 items-center justify-center rounded-full border border-line bg-bg-subtle text-fg-muted">
          <Icon name="folder" className="size-5" />
        </span>
        <p className="font-display text-lg font-semibold tracking-[-0.025em]">
          O portfólio está pronto para começar
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
          Use “Novo projeto” para publicar o primeiro trabalho nesta coleção.
        </p>
      </div>
    );
  }

  return (
    <ul
      ref={listRef}
      tabIndex={-1}
      aria-label="Projetos publicados"
      className="min-w-0 overflow-hidden rounded-[1.2rem] border border-line bg-bg-elevated shadow-[0_14px_40px_rgb(16_16_15_/_0.045)] sm:rounded-[1.35rem]"
    >
      <AnimatePresence initial={false}>
        {projects.map((project, index) => {
          const safeLink = getSafeProjectUrl(project.link);
          const isEditing = editingId === project.id;
          const isConfirming = confirmingId === project.id;
          const currentDeleteError =
            deleteError?.projectId === project.id ? deleteError.message : null;

          return (
            <motion.li
              key={project.id}
              layout={!reduceMotion}
              aria-current={isEditing ? 'true' : undefined}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                'group/item relative min-w-0 border-b border-line p-3.5 transition-[background-color,box-shadow] duration-200 last:border-b-0 min-[360px]:p-4 sm:p-5',
                isEditing
                  ? 'z-1 bg-bg-subtle shadow-[inset_0_0_0_1px_var(--color-line-strong)]'
                  : 'bg-bg-elevated hover:bg-bg-muted',
                isConfirming && 'bg-danger/4',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-y-0 left-0 w-[3px] bg-ink transition-opacity duration-200',
                  isEditing ? 'opacity-100' : 'opacity-0',
                )}
              />

              <div className="flex items-start gap-3 sm:gap-4">
                <span
                  aria-hidden="true"
                  className="hidden w-5 shrink-0 pt-3.5 text-center font-mono text-[0.58rem] text-fg-subtle sm:block"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'inline-flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 sm:size-12',
                    isEditing
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line bg-bg-subtle text-fg group-hover/item:border-line-strong',
                  )}
                >
                  <Icon name={normalizeProjectIcon(project.icon)} className="size-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-col items-start gap-1.5 sm:flex-row sm:justify-between sm:gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-semibold tracking-[-0.02em]">
                        {project.title}
                      </h3>
                      <p className="mt-1 line-clamp-3 text-sm leading-relaxed break-words text-fg-muted sm:line-clamp-2 sm:text-[0.82rem]">
                        {project.description}
                      </p>
                    </div>

                    {isEditing && (
                      <span className="shrink-0 rounded-full bg-ink px-2.5 py-1 text-[0.58rem] font-semibold tracking-[0.1em] text-paper uppercase">
                        No editor
                      </span>
                    )}
                  </div>

                  {safeLink ? (
                    <a
                      href={safeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="-ml-1 mt-1 inline-flex min-h-11 min-w-11 max-w-full touch-manipulation items-center gap-1.5 rounded-lg px-1 text-sm font-medium text-fg-subtle transition-colors duration-200 hover:text-fg sm:mt-2 sm:text-[0.75rem]"
                    >
                      <span className="truncate">{project.link}</span>
                      <Icon name="arrowUpRight" className="size-3.5 shrink-0" />
                    </a>
                  ) : (
                    <p className="mt-1 inline-flex min-h-11 max-w-full items-center gap-1.5 text-sm font-medium break-words text-danger sm:mt-2 sm:text-[0.75rem]">
                      <Icon name="alert" className="size-3.5" />
                      Link inseguro bloqueado
                    </p>
                  )}
                </div>
              </div>

              <AnimatePresence initial={false} mode="wait">
                {isConfirming ? (
                  <motion.div
                    key="confirm"
                    role="group"
                    aria-labelledby={`delete-title-${project.id}`}
                    initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 border-t border-danger/20 pt-4 sm:ml-[5.25rem]">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p
                            id={`delete-title-${project.id}`}
                            className="text-sm font-semibold break-words text-danger"
                          >
                            Excluir “{project.title}”?
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                            O projeto sairá do site. Esta ação não pode ser desfeita.
                          </p>
                        </div>
                        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                          <Button
                            autoFocus
                            variant="ghost"
                            size="sm"
                            onClick={cancelDelete}
                            className="min-h-11 flex-1 touch-manipulation sm:flex-none"
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            isLoading={deleteMutation.isPending}
                            onClick={() => void confirmDelete(project)}
                            className="min-h-11 flex-1 touch-manipulation sm:flex-none"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>

                      {currentDeleteError && (
                        <motion.p
                          role="alert"
                          initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.18 }}
                          className="mt-3 flex min-w-0 items-start gap-2 rounded-xl border border-danger/30 bg-danger/8 px-3 py-2.5 text-[0.82rem] leading-snug break-words text-danger"
                        >
                          <Icon name="alert" className="mt-px size-4 shrink-0" />
                          {currentDeleteError}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="actions"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.15 }}
                    onAnimationComplete={() => {
                      if (restoreDeleteFocusRef.current !== project.id) return;
                      deleteTriggersRef.current.get(project.id)?.focus();
                      restoreDeleteFocusRef.current = null;
                    }}
                    className="mt-3 grid grid-cols-[minmax(0,1fr)_2.75rem] gap-2 border-t border-line pt-3 sm:mt-2 sm:flex sm:justify-end sm:border-0 sm:pt-0"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(project)}
                      aria-label={`Editar ${project.title}`}
                      className="min-h-11 w-full touch-manipulation sm:w-auto"
                    >
                      <Icon name="pencil" className="size-4" />
                      Editar
                    </Button>
                    <Button
                      ref={(element) => {
                        if (element) {
                          deleteTriggersRef.current.set(project.id, element);
                        } else {
                          deleteTriggersRef.current.delete(project.id);
                        }
                      }}
                      variant="danger"
                      size="sm"
                      onClick={() => requestDelete(project.id)}
                      aria-label={`Excluir ${project.title}`}
                      className="size-11 touch-manipulation p-0"
                    >
                      <Icon name="trash" className="size-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
