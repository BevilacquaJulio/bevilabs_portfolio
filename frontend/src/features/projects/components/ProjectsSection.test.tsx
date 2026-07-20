import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { ProjectsSection } from './ProjectsSection';
import * as api from '../projects.api';
import type { Project } from '../projects.types';

const project: Project = {
  id: '1',
  title: 'Change Tracker',
  icon: 'chart',
  description: 'Auditoria de mudancas com historico completo.',
  link: 'https://example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('ProjectsSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('mostra o estado de carregamento antes da resposta', () => {
    vi.spyOn(api, 'listProjects').mockReturnValue(new Promise(() => {}));
    renderWithProviders(<ProjectsSection />);
    expect(screen.getByLabelText('Carregando projetos')).toBeInTheDocument();
  });

  it('renderiza os projetos retornados pela API', async () => {
    vi.spyOn(api, 'listProjects').mockResolvedValue({
      data: [project],
      total: 1,
      page: 1,
      limit: 50,
    });

    renderWithProviders(<ProjectsSection />);

    expect(await screen.findByText('Change Tracker')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Abrir projeto Change Tracker/i }),
    ).toHaveAttribute('href', 'https://example.com');
  });

  it('mostra o estado vazio quando nao ha projetos', async () => {
    vi.spyOn(api, 'listProjects').mockResolvedValue({ data: [], total: 0, page: 1, limit: 50 });

    renderWithProviders(<ProjectsSection />);

    expect(await screen.findByText(/Nenhum projeto publicado ainda/i)).toBeInTheDocument();
  });

  it('mostra o estado de erro com botao de retry', async () => {
    vi.spyOn(api, 'listProjects').mockRejectedValue(new Error('falha'));

    renderWithProviders(<ProjectsSection />);

    await waitFor(() =>
      expect(screen.getByText(/Nao consegui carregar os projetos/i)).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /Tentar de novo/i })).toBeInTheDocument();
  });
});
