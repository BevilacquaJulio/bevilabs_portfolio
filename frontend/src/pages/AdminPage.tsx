import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { MagneticButton } from '@/components/MagneticButton';
import { LoginForm } from '@/features/admin/components/LoginForm';
import { ProjectForm } from '@/features/admin/components/ProjectForm';
import { ProjectList } from '@/features/admin/components/ProjectList';
import { useAuth } from '@/features/admin/hooks/useAuth';
import { useProjectsQuery } from '@/features/projects/hooks/useProjectsQuery';
import type { Project } from '@/features/projects/projects.types';

export default function AdminPage() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const previousTitle = document.title;
    const existingRobots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const robots = existingRobots ?? document.createElement('meta');
    const previousRobotsContent = existingRobots?.content;

    document.title = 'Admin | Bevilacqua Labs';
    robots.name = 'robots';
    robots.content = 'noindex,nofollow';

    if (!existingRobots) {
      document.head.appendChild(robots);
    }

    return () => {
      document.title = previousTitle;

      if (existingRobots) {
        existingRobots.content = previousRobotsContent ?? '';
      } else {
        robots.remove();
      }
    };
  }, []);

  // Mantem a consulta de projetos fora da tela de senha.
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}

function AdminLogin() {
  return (
    <main className="relative z-2 min-h-dvh overflow-x-clip bg-bg text-fg lg:grid lg:grid-cols-[minmax(0,1.04fr)_minmax(27rem,0.96fr)]">
      <section className="relative hidden min-h-dvh overflow-hidden bg-ink text-paper lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="blueprint absolute inset-0 opacity-70 [mask-image:radial-gradient(115%_95%_at_16%_16%,#000_12%,transparent_76%)]"
        />

        <div className="relative z-1 flex items-center justify-between px-10 py-9 xl:px-14">
          <Link
            to="/"
            className="focus-on-dark inline-flex min-h-11 items-center gap-3 rounded-full px-1 text-sm font-semibold tracking-[-0.01em] transition-opacity duration-200 hover:opacity-70"
          >
            <span className="grid size-9 place-items-center rounded-full bg-paper font-display text-sm font-bold text-ink">
              B
            </span>
            Bevilacqua Labs
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
            <Icon name="lock" className="size-3" />
            Acesso privado
          </span>
        </div>

        <div className="relative z-1 flex max-w-[48rem] flex-1 flex-col justify-center px-10 py-12 xl:px-14">
          <div>
            <p className="mb-5 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.18em] text-paper/65 uppercase">
              <span className="h-px w-9 bg-paper/45" />
              Barreira de segurança
            </p>
            <p className="max-w-[9ch] font-display text-[clamp(3.4rem,4.8vw,6.5rem)] leading-[0.86] font-semibold tracking-[-0.07em]">
              O lado privado do trabalho.
            </p>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-paper/55">
              Uma fronteira discreta entre o portfólio público e seu espaço de curadoria.
            </p>
          </div>
        </div>

        <div className="relative z-1 px-10 pb-10 xl:px-14 xl:pb-14">
          <div className="relative max-w-[34rem] border border-paper/18 bg-paper/[0.035] p-5 xl:p-6">
            <span
              aria-hidden="true"
              className="absolute -top-px -left-px size-2 border-t border-l border-paper/70"
            />
            <span
              aria-hidden="true"
              className="absolute -right-px -bottom-px size-2 border-r border-b border-paper/70"
            />

            <div className="flex items-center justify-between border-b border-paper/15 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full border border-paper/25 bg-paper/8">
                  <Icon name="shield" className="size-[1.1rem]" />
                </span>
                <div>
                  <p className="font-mono text-[0.58rem] tracking-[0.15em] text-paper/45 uppercase">
                    Limite de acesso
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">Administração restrita</p>
                </div>
              </div>
              <Icon name="lock" className="size-4 text-paper/50" />
            </div>

            <dl className="grid grid-cols-3 divide-x divide-paper/12 pt-4">
              <div className="pr-4">
                <dt className="font-mono text-[0.55rem] tracking-[0.12em] text-paper/40 uppercase">
                  Rota
                </dt>
                <dd className="mt-1.5 font-mono text-xs text-paper/85">/admin</dd>
              </div>
              <div className="px-4">
                <dt className="font-mono text-[0.55rem] tracking-[0.12em] text-paper/40 uppercase">
                  Indexação
                </dt>
                <dd className="mt-1.5 font-mono text-xs text-paper/85">noindex</dd>
              </div>
              <div className="pl-4">
                <dt className="font-mono text-[0.55rem] tracking-[0.12em] text-paper/40 uppercase">
                  Escopo
                </dt>
                <dd className="mt-1.5 font-mono text-xs text-paper/85">privado</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="flex min-h-dvh min-w-0 flex-col bg-bg px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] min-[360px]:px-5 sm:px-8 sm:pt-[calc(1.5rem+env(safe-area-inset-top))] sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] lg:px-12 lg:pt-[calc(2rem+env(safe-area-inset-top))] xl:px-18">
        <header className="flex items-center justify-between gap-2 lg:justify-end">
          <Link
            to="/"
            aria-label="Bevilacqua Labs — voltar ao site"
            className="inline-flex min-h-11 shrink-0 touch-manipulation items-center gap-2 rounded-full px-2 text-sm font-semibold text-fg-muted transition-colors duration-200 hover:text-fg lg:hidden"
          >
            <span className="grid size-8 place-items-center rounded-full bg-ink font-display text-xs font-bold text-paper">
              B
            </span>
            <span className="hidden sm:inline">Bevilacqua Labs</span>
          </Link>

          <Link
            to="/"
            className="inline-flex min-h-11 shrink-0 touch-manipulation items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-bg-subtle hover:text-fg"
          >
            <Icon name="arrowUpRight" className="size-4 rotate-[-135deg]" />
            Voltar ao site
          </Link>
        </header>

        <div className="flex min-w-0 flex-1 items-center justify-center py-7 sm:py-10 lg:py-14">
          <div className="flex w-full min-w-0 justify-center">
            <LoginForm />
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-line pt-4 text-[0.67rem] text-fg-subtle sm:pt-5">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="lock" className="size-3" />
            Painel protegido
          </span>
          <span>Bevilacqua Labs</span>
        </footer>
      </section>
    </main>
  );
}

function AdminDashboard() {
  const { logout } = useAuth();
  const reduceMotion = useReducedMotion();
  const [editing, setEditing] = useState<Project | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorAnnouncement, setEditorAnnouncement] = useState('');
  const editorRef = useRef<HTMLElement>(null);
  const desktopEditorRef = useRef<HTMLElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const { data, isLoading } = useProjectsQuery();

  const total = data?.total ?? 0;

  const isCompactViewport = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;

  const focusDesktopEditor = () => {
    requestAnimationFrame(() => {
      desktopEditorRef.current?.querySelector<HTMLInputElement>('input[name="title"]')?.focus();
    });
  };

  const editProject = (project: Project) => {
    lastFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setEditing(project);
    setEditorAnnouncement(`Editor aberto para ${project.title}.`);
    if (isCompactViewport()) {
      setIsEditorOpen(true);
    } else {
      focusDesktopEditor();
    }
  };

  const startNewProject = () => {
    lastFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setEditing(null);
    setEditorAnnouncement('Editor pronto para um novo projeto.');
    if (isCompactViewport()) {
      setIsEditorOpen(true);
    } else {
      focusDesktopEditor();
    }
  };

  const finishEditing = () => {
    setEditing(null);
    setIsEditorOpen(false);
    setEditorAnnouncement('Editor fechado.');
    if (!isCompactViewport()) {
      requestAnimationFrame(() => lastFocusedRef.current?.focus());
    }
  };

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const moveEditorToDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      lastFocusedRef.current = null;
      setIsEditorOpen(false);
      requestAnimationFrame(() => {
        desktopEditorRef.current?.querySelector<HTMLInputElement>('input[name="title"]')?.focus();
      });
    };

    desktop.addEventListener('change', moveEditorToDesktop);
    return () => desktop.removeEventListener('change', moveEditorToDesktop);
  }, []);

  useEffect(() => {
    if (
      !isEditorOpen ||
      typeof window === 'undefined' ||
      !window.matchMedia('(max-width: 1023px)').matches
    ) {
      return;
    }

    const shell = document.getElementById('admin-shell');
    const dialog = editorRef.current;
    const shellWithInert = shell as (HTMLElement & { inert: boolean }) | null;

    const focusableSelector =
      'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);

    const focusFirstControl = () => focusables()[0]?.focus({ preventScroll: true });

    focusFirstControl();
    if (shellWithInert) shellWithInert.inert = true;
    shell?.setAttribute('aria-hidden', 'true');
    document.body.dataset.drawerOpen = 'true';

    requestAnimationFrame(() => {
      if (!dialog?.contains(document.activeElement)) focusFirstControl();
    });

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditorAnnouncement('Editor fechado.');
        setEditing(null);
        setIsEditorOpen(false);
        return;
      }

      if (event.key === 'Tab') {
        const elements = focusables();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      if (shellWithInert) shellWithInert.inert = false;
      shell?.removeAttribute('aria-hidden');
      delete document.body.dataset.drawerOpen;
      window.removeEventListener('keydown', handleKeydown);
      const focusTarget = lastFocusedRef.current;
      requestAnimationFrame(() => {
        if (focusTarget?.isConnected) focusTarget.focus();
      });
    };
  }, [isEditorOpen]);

  return (
    <main className="relative z-2 min-h-dvh overflow-x-clip bg-bg pb-[calc(5rem+env(safe-area-inset-bottom))] text-fg">
      <p className="sr-only" aria-live="polite">
        {editorAnnouncement}
      </p>
      <div id="admin-shell">
        <header className="sticky top-0 z-[var(--z-header)] border-b border-line bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
          <div className="mx-auto flex min-h-[4.75rem] w-full max-w-[1440px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-sm font-bold text-paper">
                B
              </span>
              <div className="hidden min-w-0 min-[360px]:block">
                <p className="truncate font-display text-sm font-semibold tracking-[-0.02em]">
                  Bevilacqua Labs
                </p>
                <p className="flex items-center gap-1.5 text-[0.67rem] font-medium tracking-[0.11em] text-fg-subtle uppercase">
                  <Icon name="lock" className="size-3" />
                  Área privada
                </p>
              </div>
            </div>

            <nav aria-label="Ações do painel" className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Link
                to="/"
                aria-label="Ver site público"
                className="inline-flex size-11 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-full text-sm font-semibold text-fg-muted transition-colors duration-200 hover:bg-bg-subtle hover:text-fg sm:w-auto sm:px-4"
              >
                <Icon name="globe" className="size-4" />
                <span className="hidden sm:inline">Ver site</span>
              </Link>
              <MagneticButton
                type="button"
                onClick={() => void logout()}
                aria-label="Sair do painel"
                className="inline-flex size-11 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-full text-sm font-semibold text-fg-muted transition-colors duration-200 hover:bg-bg-subtle hover:text-fg sm:w-auto sm:px-4"
              >
                <Icon name="logout" className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </MagneticButton>
            </nav>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1440px] px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
          <motion.section
            aria-labelledby="admin-workspace-title"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="relative mb-9 overflow-hidden rounded-[1.5rem] bg-ink text-paper sm:rounded-[1.75rem] lg:mb-12 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem]"
          >
            <div
              aria-hidden="true"
              className="blueprint absolute inset-0 opacity-30 [mask-image:linear-gradient(110deg,#000,transparent_68%)]"
            />

            <div className="relative z-1 px-5 py-7 min-[360px]:px-6 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
              <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold tracking-[0.17em] text-paper/50 uppercase">
                <span className="h-px w-8 bg-paper/35" />
                Conteúdo público
              </p>
              <h1
                id="admin-workspace-title"
                className="max-w-[12ch] font-display text-[clamp(2rem,9vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.055em]"
              >
                Inventário de projetos.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/58">
                Selecione um trabalho para atualizar ou abra um novo registro para publicar no
                portfólio.
              </p>
              <MagneticButton
                type="button"
                onClick={startNewProject}
                className="focus-on-dark mt-7 inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-paper bg-paper px-5 text-sm font-semibold text-ink transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-white motion-reduce:hover:translate-y-0 sm:w-auto"
              >
                <Icon name="plus" className="size-4" />
                Novo projeto
              </MagneticButton>
            </div>

            <div className="relative z-1 flex items-end justify-between gap-5 border-t border-paper/15 bg-paper/[0.035] px-5 py-5 min-[360px]:px-6 sm:px-8 lg:flex-col lg:items-start lg:justify-between lg:border-t-0 lg:border-l lg:px-8 lg:py-9">
              <div>
                <p className="font-mono text-[0.58rem] tracking-[0.15em] text-paper/40 uppercase">
                  Publicados
                </p>
                <p className="mt-1 text-sm font-medium text-paper/65">no site agora</p>
              </div>
              <p
                aria-label={isLoading ? 'Carregando total de projetos' : `${total} projetos`}
                className="font-display text-[clamp(3rem,13vw,6.5rem)] leading-[0.78] font-semibold tracking-[-0.07em] tabular-nums"
              >
                {isLoading ? '-' : String(total).padStart(2, '0')}
              </p>
            </div>
          </motion.section>

          <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(23rem,28rem)] xl:gap-14">
            <section aria-labelledby="projects-list-title" className="min-w-0">
              <div className="mb-5 flex flex-col items-start justify-between gap-3 border-b border-line pb-4 min-[380px]:flex-row min-[380px]:items-end min-[380px]:gap-4">
                <div className="min-w-0">
                  <p className="mb-2 font-mono text-[0.58rem] tracking-[0.14em] text-fg-subtle uppercase">
                    Inventário
                  </p>
                  <h2
                    id="projects-list-title"
                    className="font-display text-xl font-semibold tracking-[-0.035em]"
                  >
                    Trabalhos publicados
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-fg-subtle">
                    Abra um item para levá-lo ao editor.
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-line bg-bg-elevated px-3 py-1.5 font-mono text-[0.65rem] text-fg-muted">
                  {isLoading ? '...' : `${String(total).padStart(2, '0')} itens`}
                </span>
              </div>
              <ProjectList onEdit={editProject} editingId={editing?.id} />
            </section>

            {!isEditorOpen && (
              <aside
                ref={desktopEditorRef}
                aria-label="Editor de projeto"
                className="hidden max-h-[calc(100dvh-6.5rem)] overflow-y-auto lg:sticky lg:top-[6rem] lg:block"
              >
                <div className="mb-5 border-b border-line pb-4">
                  <p className="mb-2 font-mono text-[0.58rem] tracking-[0.14em] text-fg-subtle uppercase">
                    Editor
                  </p>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-semibold tracking-[-0.035em]">
                        {editing ? 'Item selecionado' : 'Novo registro'}
                      </h2>
                      <p className="mt-1.5 text-xs text-fg-subtle">
                        {editing ? 'Alterações no projeto ativo.' : 'Pronto para uma nova entrada.'}
                      </p>
                    </div>
                    <span
                      className={`size-2 shrink-0 rounded-full ${
                        editing ? 'bg-ink' : 'border border-line-strong bg-bg-elevated'
                      }`}
                    />
                  </div>
                </div>
                <ProjectForm editing={editing} onDone={finishEditing} />
              </aside>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence initial={!reduceMotion}>
        {isEditorOpen && (
          <motion.section
            ref={editorRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-editor-title"
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 28 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[var(--z-drawer)] flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-bg lg:hidden"
          >
            <header className="z-10 flex min-h-[4.5rem] shrink-0 items-center justify-between gap-4 border-b border-line bg-bg/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
              <div className="min-w-0">
                <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-fg-subtle uppercase">
                  Editor
                </p>
                <h2
                  id="mobile-editor-title"
                  className="truncate font-display text-base font-semibold tracking-[-0.02em]"
                >
                  {editing ? 'Editar projeto' : 'Novo projeto'}
                </h2>
              </div>
              <MagneticButton
                type="button"
                onClick={finishEditing}
                aria-label="Fechar editor"
                className="inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-line bg-bg-elevated text-fg transition-colors duration-200 hover:border-line-strong hover:bg-bg-subtle"
              >
                <Icon name="x" className="size-5" />
              </MagneticButton>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] [scroll-padding-block:1rem] sm:px-5 sm:pt-5">
              <ProjectForm editing={editing} onDone={finishEditing} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
