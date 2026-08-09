import { useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import {
  PROJECT_ICONS,
  PROJECT_ICON_LABELS,
  normalizeProjectIcon,
} from '@/features/projects/project-icons';
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
      setServerError(getApiErrorMessage(error, 'Não foi possível salvar o projeto.'));
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={isSubmitting}
      aria-describedby={serverError ? 'project-form-error' : undefined}
      onChange={() => {
        if (serverError) setServerError(null);
      }}
      className={cn(
        'min-w-0 overflow-hidden rounded-[1.35rem] border bg-bg-elevated transition-[border-color,box-shadow] duration-200',
        editing
          ? 'border-ink shadow-[0_18px_52px_rgb(16_16_15_/_0.1)]'
          : 'border-line shadow-[0_12px_36px_rgb(16_16_15_/_0.04)]',
      )}
    >
      <header
        className={cn(
          'flex items-start gap-3 border-b px-5 py-4 transition-colors duration-200 sm:px-6 sm:py-5',
          editing ? 'border-ink bg-ink text-paper' : 'border-line bg-bg-elevated text-fg',
        )}
      >
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
            editing
              ? 'border-paper/20 bg-paper text-ink'
              : 'border-line-strong bg-bg-subtle text-fg',
          )}
        >
          <Icon name={editing ? 'pencil' : 'plus'} className="size-[1.1rem]" />
        </span>

        <div className="min-w-0 pt-0.5">
          <p
            className={cn(
              'text-[0.62rem] font-semibold tracking-[0.14em] uppercase',
              editing ? 'text-paper/50' : 'text-fg-subtle',
            )}
          >
            {editing ? 'Em edição' : 'Adicionar ao portfólio'}
          </p>
          <h2 className="mt-1 truncate font-display text-lg leading-tight font-semibold tracking-[-0.025em]">
            {editing ? editing.title : 'Novo projeto'}
          </h2>
          <p
            className={cn(
              'mt-1 text-xs leading-relaxed',
              editing ? 'text-paper/55' : 'text-fg-muted',
            )}
          >
            {editing ? 'Atualize o registro selecionado.' : 'Crie uma nova entrada pública.'}
          </p>
        </div>
      </header>

      <div className="flex min-w-0 flex-col gap-4 px-4 py-5 min-[360px]:px-5 sm:px-6">
        <Field label="Título" htmlFor="title" error={errors.title?.message}>
          <input
            id="title"
            type="text"
            className="field min-h-12 scroll-mt-24 text-base sm:text-[0.9rem]"
            placeholder="Nome do projeto"
            autoComplete="off"
            enterKeyHint="next"
            maxLength={255}
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title')}
          />
        </Field>

        <fieldset
          className="flex flex-col border-0 p-0"
          aria-invalid={Boolean(errors.icon)}
          aria-describedby={errors.icon ? 'icon-error' : undefined}
        >
          <legend className="mb-2.5 text-[0.7rem] font-semibold tracking-[0.08em] text-fg uppercase">
            Ícone
          </legend>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {PROJECT_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => {
                  setServerError(null);
                  setValue('icon', icon, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                aria-pressed={selectedIcon === icon}
                aria-label={`Ícone: ${PROJECT_ICON_LABELS[icon]}`}
                title={PROJECT_ICON_LABELS[icon]}
                className={cn(
                  'inline-flex aspect-square min-h-11 touch-manipulation items-center justify-center rounded-[0.7rem] border transition-[background-color,border-color,color,transform] duration-200 active:scale-95 motion-reduce:active:scale-100',
                  selectedIcon === icon
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line bg-bg-subtle text-fg-muted hover:border-line-strong hover:bg-bg-muted hover:text-fg',
                )}
              >
                <Icon name={icon} className="size-[1.15rem]" />
              </button>
            ))}
          </div>
          {errors.icon && (
            <p id="icon-error" role="alert" className="mt-2 text-[0.78rem] text-danger">
              {errors.icon.message}
            </p>
          )}
        </fieldset>

        <Field label="Descrição" htmlFor="description" error={errors.description?.message}>
          <textarea
            id="description"
            rows={3}
            className="field min-h-28 scroll-mt-24 resize-y text-base sm:min-h-24 sm:text-[0.9rem]"
            placeholder="Explique o que este projeto entrega"
            autoCapitalize="sentences"
            maxLength={5000}
            aria-required="true"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'description-error' : undefined}
            {...register('description')}
          />
        </Field>

        <Field label="Link" htmlFor="link" error={errors.link?.message}>
          <div className="relative">
            <Icon
              name="link"
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-subtle"
            />
            <input
              id="link"
              type="url"
              placeholder="https://seu-projeto.com"
              className="field min-h-12 scroll-mt-24 pl-11 text-base sm:text-[0.9rem]"
              inputMode="url"
              enterKeyHint="done"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={2048}
              aria-required="true"
              aria-invalid={Boolean(errors.link)}
              aria-describedby={errors.link ? 'link-error' : undefined}
              {...register('link')}
            />
          </div>
        </Field>

        {serverError && (
          <p
            id="project-form-error"
            role="alert"
            className="flex min-w-0 items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/8 px-4 py-3 text-[0.82rem] leading-snug break-words text-danger"
          >
            <Icon name="alert" className="mt-px size-4 shrink-0" />
            {serverError}
          </p>
        )}
      </div>

      <footer className="flex flex-col-reverse gap-2 border-t border-line bg-bg-muted px-4 py-3.5 min-[360px]:px-5 sm:flex-row sm:px-6">
        {editing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDone}
            className="min-h-11 w-full touch-manipulation sm:w-auto sm:px-5"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          className="group min-h-11 w-full flex-1 touch-manipulation"
        >
          {editing ? 'Salvar alterações' : 'Adicionar projeto'}
        </Button>
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
        className="text-[0.7rem] font-semibold tracking-[0.08em] text-fg uppercase"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-[0.78rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
