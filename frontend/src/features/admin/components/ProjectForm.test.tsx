import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import { ProjectForm } from './ProjectForm';
import * as api from '@/features/projects/projects.api';

describe('ProjectForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('bloqueia o envio e mostra os erros do Zod quando o formulario esta vazio', async () => {
    const createSpy = vi.spyOn(api, 'createProject');
    const user = userEvent.setup();

    renderWithProviders(<ProjectForm editing={null} onDone={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Adicionar projeto/i }));

    expect(await screen.findByText('Informe o titulo.')).toBeInTheDocument();
    expect(screen.getByText('Informe a descricao.')).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('rejeita uma URL invalida', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectForm editing={null} onDone={vi.fn()} />);

    await user.type(screen.getByLabelText('Titulo'), 'Meu projeto');
    await user.type(screen.getByLabelText('Descricao'), 'Uma descricao');
    await user.type(screen.getByLabelText('Link'), 'nao-e-url');
    await user.click(screen.getByRole('button', { name: /Adicionar projeto/i }));

    expect(await screen.findByText(/Informe uma URL valida/i)).toBeInTheDocument();
  });

  it('envia os dados validos e limpa o formulario', async () => {
    const createSpy = vi.spyOn(api, 'createProject').mockResolvedValue({
      id: '1',
      title: 'Meu projeto',
      icon: 'folder',
      description: 'Uma descricao',
      link: 'https://example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    const onDone = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<ProjectForm editing={null} onDone={onDone} />);

    await user.type(screen.getByLabelText('Titulo'), 'Meu projeto');
    await user.type(screen.getByLabelText('Descricao'), 'Uma descricao');
    await user.type(screen.getByLabelText('Link'), 'https://example.com');
    await user.click(screen.getByRole('button', { name: /Adicionar projeto/i }));

    await vi.waitFor(() => expect(createSpy).toHaveBeenCalledOnce());
    expect(onDone).toHaveBeenCalledOnce();
  });
});
