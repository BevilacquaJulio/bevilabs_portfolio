import { useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { PROJECT_ICONS, PROJECT_ICON_LABELS, normalizeProjectIcon } from '@/components/project-icons';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/lib/api';
import {
  projectInputSchema,
  type Project,
  type ProjectInput,
} from '@/features/projects/projects.types';
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '@/features/projects/hooks/useProjectsQuery';

type ProjectFormProps = {
  editing: Project | null;
  onDone: () => void;
};

const EMPTY: ProjectInput = { title: '', icon: 'folder', description: '', link: '' };

export function ProjectForm({ editing, onDone }: ProjectFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({ resolver: zodResolver(projectInputSchema), defaultValues: EMPTY });

  const selectedIcon = watch('icon');

  useEffect(() => {
    reset(
      editing
        ? {
            title: editing.title,
            icon: normalizeProjectIcon(editing.icon),
            description: editing.description,
            link: editing.link,
          }
        : EMPTY,
    );
    setServerError(null);
  }, [editing, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, input: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      reset(EMPTY);
      onDone();
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Nao foi possivel salvar o projeto.'));
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn(
        'panel edge-top flex flex-col overflow-hidden transition-colors duration-300',
        editing && 'border-neon/30',
      )}
    >
      <header className="flex items-center gap-3 border-b border-line px-6 py-4">
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300',
            editing
              ? 'border-neon/40 bg-neon-soft text-neon'
              : 'border-line bg-bg-subtle text-fg-muted',
          )}
        >
          <Icon name={editing ? 'pencil' : 'plus'} className="size-4" />
        </span>

        <div className="min-w-0">
          <h2 className="font-display text-[1.05rem] leading-tight font-bold tracking-[-0.015em]">
            {editing ? 'Editar projeto' : 'Novo projeto'}
          </h2>
          <p className="truncate text-[0.72rem] font-light text-fg-subtle">
            {editing ? editing.title : 'Preencha os campos e adicione ao site.'}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-5 px-6 py-6">
        <Field label="Titulo" htmlFor="title" error={errors.title?.message}>
          <input
            id="title"
            type="text"
            className="field"
            placeholder="Nome do projeto"
            aria-invalid={Boolean(errors.title)}
            {...register('title')}
          />
        </Field>

        <fieldset className="flex flex-col border-0 p-0">
          <legend className="mb-2.5 text-[0.7rem] font-semibold tracking-[0.12em] text-fg-subtle uppercase">
            Icone
          </legend>
          {/* 10 icones: 5 colunas fecham exatamente 2 fileiras. */}
          <div className="grid grid-cols-5 gap-2">
            {PROJECT_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setValue('icon', icon, { shouldDirty: true })}
                aria-pressed={selectedIcon === icon}
                aria-label={`Icone: ${PROJECT_ICON_LABELS[icon]}`}
                title={PROJECT_ICON_LABELS[icon]}
                className={cn(
                  'inline-flex aspect-square items-center justify-center rounded-lg border transition-all duration-200',
                  selectedIcon === icon
                    ? 'border-neon/50 bg-neon-soft text-neon [box-shadow:var(--shadow-accent-border-soft)]'
                    : 'border-line bg-bg-subtle text-fg-muted hover:border-line-strong hover:bg-bg-muted hover:text-fg',
                )}
              >
                <Icon name={icon} className="size-[1.15rem]" />
              </button>
            ))}
          </div>
        </fieldset>

        <Field label="Descricao" htmlFor="description" error={errors.description?.message}>
          <textarea
            id="description"
            rows={3}
            className="field resize-y"
            placeholder="O que este projeto faz"
            aria-invalid={Boolean(errors.description)}
            {...register('description')}
          />
        </Field>

        <Field label="Link" htmlFor="link" error={errors.link?.message}>
          <input
            id="link"
            type="url"
            placeholder="https://"
            className="field"
            aria-invalid={Boolean(errors.link)}
            {...register('link')}
          />
        </Field>

        {serverError && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-danger/25 bg-danger/8 px-3 py-2.5 text-[0.78rem] leading-snug text-danger"
          >
            <Icon name="alert" className="mt-px size-4 shrink-0" />
            {serverError}
          </p>
        )}
      </div>

      <footer className="flex flex-wrap gap-2.5 border-t border-line bg-bg-muted px-6 py-4">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          className="group flex-1"
        >
          {editing ? 'Salvar alteracoes' : 'Adicionar projeto'}
        </Button>
        {editing && (
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Cancelar
          </Button>
        )}
      </footer>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[0.7rem] font-semibold tracking-[0.12em] text-fg-subtle uppercase"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[0.78rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
