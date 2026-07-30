import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import AdminPage from './AdminPage';

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));

vi.mock('@/features/admin/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true, logout: mocks.logout }),
}));

vi.mock('@/features/projects/hooks/useProjectsQuery', () => ({
  useProjectsQuery: () => ({
    data: { data: [], total: 0, page: 1, limit: 20 },
    isLoading: false,
    isError: false,
    error: null,
  }),
  useCreateProjectMutation: () => ({ mutateAsync: mocks.createProject }),
  useUpdateProjectMutation: () => ({ mutateAsync: mocks.updateProject }),
  useDeleteProjectMutation: () => ({ mutateAsync: mocks.deleteProject, isPending: false }),
}));

function mobileMatchMedia(query: string): MediaQueryList {
  return {
    matches:
      query.includes('max-width: 1023px') || query.includes('prefers-reduced-motion: reduce'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

describe('AdminPage no mobile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn(mobileMatchMedia),
    });
  });

  it('mantem foco preso no drawer e restaura o gatilho ao fechar com Escape', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const trigger = screen.getByRole('button', { name: 'Novo projeto' });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Novo projeto' });
    const closeButton = within(dialog).getByRole('button', { name: 'Fechar editor' });
    const submitButton = within(dialog).getByRole('button', { name: 'Adicionar projeto' });
    const shell = document.getElementById('admin-shell') as HTMLElement & { inert: boolean };

    expect(closeButton).toHaveFocus();
    expect(shell).toHaveAttribute('aria-hidden', 'true');
    expect(shell.inert).toBe(true);
    expect(document.body).toHaveAttribute('data-drawer-open', 'true');

    await user.tab({ shift: true });
    expect(submitButton).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(shell).not.toHaveAttribute('aria-hidden');
    expect(shell.inert).toBe(false);
    expect(document.body).not.toHaveAttribute('data-drawer-open');
  });
});
