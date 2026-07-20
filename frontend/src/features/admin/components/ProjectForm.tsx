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

const inputClass =
  'w-full rounded-lg border border-line bg-bg-subtle px-4 py-3 text-sm text-fg outline-none ' +
  'transition-colors placeholder:text-fg-subtle focus:border-neon/50 focus:[box-shadow:var(--shadow-accent-border-soft)]';

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
    <form onSubmit={onSubmit} noValidate className="panel flex flex-col gap-5 p-6">
      <h2 className="font-display text-lg font-bold">
        {editing ? 'Editar projeto' : 'Novo projeto'}
      </h2>

      <Field label="Titulo" htmlFor="title" error={errors.title?.message}>
        <input
          id="title"
          type="text"
          className={inputClass}
          aria-invalid={Boolean(errors.title)}
          {...register('title')}
        />
      </Field>

      <fieldset className="flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 text-[0.8rem] font-medium text-fg-muted">Icone</legend>
        <div className="flex flex-wrap gap-2">
          {PROJECT_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue('icon', icon, { shouldDirty: true })}
              aria-pressed={selectedIcon === icon}
              aria-label={`Icone: ${PROJECT_ICON_LABELS[icon]}`}
              title={PROJECT_ICON_LABELS[icon]}
              className={cn(
                'inline-flex size-10 items-center justify-center rounded-lg border transition-all duration-200',
                selectedIcon === icon
                  ? 'border-neon/50 bg-neon-soft text-neon [box-shadow:var(--shadow-accent-border-soft)]'
                  : 'border-line bg-bg-subtle text-fg-muted hover:border-line-strong hover:text-fg',
              )}
            >
              <Icon name={icon} className="size-5" />
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Descricao" htmlFor="description" error={errors.description?.message}>
        <textarea
          id="description"
          rows={3}
          className={cn(inputClass, 'resize-y')}
          aria-invalid={Boolean(errors.description)}
          {...register('description')}
        />
      </Field>

      <Field label="Link" htmlFor="link" error={errors.link?.message}>
        <input
          id="link"
          type="url"
          placeholder="https://"
          className={inputClass}
          aria-invalid={Boolean(errors.link)}
          {...register('link')}
        />
      </Field>

      {serverError && (
        <p role="alert" className="flex items-center gap-2 text-[0.8rem] text-danger">
          <Icon name="alert" className="size-4 shrink-0" />
          {serverError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          className="group"
        >
          {editing ? 'Salvar alteracoes' : 'Adicionar projeto'}
        </Button>
        {editing && (
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Cancelar
          </Button>
        )}
      </div>
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
      <label htmlFor={htmlFor} className="text-[0.8rem] font-medium text-fg-muted">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[0.8rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
