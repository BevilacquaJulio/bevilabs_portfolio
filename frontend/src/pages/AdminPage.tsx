import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { LoginForm } from '@/features/admin/components/LoginForm';
import { ProjectForm } from '@/features/admin/components/ProjectForm';
import { ProjectList } from '@/features/admin/components/ProjectList';
import { useAuth } from '@/features/admin/hooks/useAuth';
import { useProjectsQuery } from '@/features/projects/hooks/useProjectsQuery';
import type { Project } from '@/features/projects/projects.types';

export default function AdminPage() {
  const { isAuthenticated } = useAuth();

  // Dashboard isolado num componente proprio: assim useProjectsQuery so roda
  // depois do login. Na tela de senha nao ha o que buscar.
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}

function AdminLogin() {
  return (
    <main className="relative z-2 flex min-h-dvh items-center justify-center px-[var(--layout-pad)] py-16">
      <div className="w-full">
        <LoginForm />
        <p className="mt-7 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[0.8rem] text-fg-subtle transition-colors hover:text-neon"
          >
            <Icon name="arrowUpRight" className="size-3 rotate-[225deg]" />
            Voltar ao site
          </Link>
        </p>
      </div>
    </main>
  );
}

function AdminDashboard() {
  const { logout } = useAuth();
  const [editing, setEditing] = useState<Project | null>(null);
  const { data, isLoading } = useProjectsQuery();

  const total = data?.total ?? 0;

  return (
    <main className="relative z-2 min-h-dvh pb-24">
      <div className="admin-bar">
        <div className="layout flex h-[var(--header-h)] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 animate-pulse-dot rounded-full bg-neon"
            />
            <span className="truncate font-display text-[0.95rem] font-extrabold tracking-[-0.01em]">
              Bevilacqua Labs
            </span>
            <span className="hidden rounded-full border border-neon/25 bg-neon-soft px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.14em] text-neon uppercase sm:inline">
              Admin
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Icon name="globe" className="size-4" />
                <span className="hidden sm:inline">Ver site</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => void logout()}>
              <Icon name="logout" className="size-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="layout pt-9 md:pt-12">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4"
        >
          <div>
            <h1 className="font-display text-[1.75rem] leading-tight font-extrabold tracking-[-0.025em] md:text-[2rem]">
              Painel de <span className="neon-text">projetos</span>
            </h1>
            <p className="mt-1.5 max-w-md text-sm font-light text-fg-muted">
              Adicione, edite e remova os projetos exibidos no site.
            </p>
          </div>

          <dl className="panel-inset px-4 py-2.5">
            <dt className="text-[0.65rem] font-medium tracking-[0.12em] text-fg-subtle uppercase">
              Publicados
            </dt>
            <dd className="mt-0.5 font-display text-lg leading-none font-extrabold tabular-nums">
              {isLoading ? <span className="text-fg-subtle">—</span> : total}
            </dd>
          </dl>
        </motion.header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
          <section aria-label="Projetos cadastrados" className="min-w-0">
            <h2 className="mb-3 flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.16em] text-fg-subtle uppercase">
              <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
              Cadastrados
            </h2>
            <ProjectList onEdit={setEditing} editingId={editing?.id} />
          </section>

          <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <ProjectForm editing={editing} onDone={() => setEditing(null)} />
          </aside>
        </div>
      </div>
    </main>
  );
}
