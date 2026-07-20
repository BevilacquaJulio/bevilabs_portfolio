import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { LoginForm } from '@/features/admin/components/LoginForm';
import { ProjectForm } from '@/features/admin/components/ProjectForm';
import { ProjectList } from '@/features/admin/components/ProjectList';
import { useAuth } from '@/features/admin/hooks/useAuth';
import type { Project } from '@/features/projects/projects.types';

export default function AdminPage() {
  const { isAuthenticated, logout } = useAuth();
  const [editing, setEditing] = useState<Project | null>(null);

  if (!isAuthenticated) {
    return (
      <main className="relative z-2 flex min-h-dvh items-center justify-center px-[var(--layout-pad)] py-16">
        <div className="w-full">
          <LoginForm />
          <p className="mt-6 text-center">
            <Link
              to="/"
              className="text-[0.85rem] text-fg-subtle transition-colors hover:text-neon"
            >
              Voltar ao site
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-2 min-h-dvh py-10 md:py-16">
      <div className="layout">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em]">
              Painel de projetos
            </h1>
            <p className="mt-1 text-sm font-light text-fg-muted">
              Adicione, edite e remova os projetos exibidos no site.
            </p>
          </div>

          <div className="flex gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Ver site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => void logout()}>
              <Icon name="logout" className="size-4" />
              Sair
            </Button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-label="Projetos cadastrados">
            <ProjectList onEdit={setEditing} editingId={editing?.id} />
          </section>

          <aside className="lg:sticky lg:top-24">
            <ProjectForm editing={editing} onDone={() => setEditing(null)} />
          </aside>
        </div>
      </div>
    </main>
  );
}
