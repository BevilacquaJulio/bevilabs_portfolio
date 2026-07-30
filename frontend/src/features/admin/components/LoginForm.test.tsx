import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import { LoginForm } from './LoginForm';

vi.mock('../admin.api', () => ({ login: vi.fn() }));

describe('LoginForm no mobile', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('nao abre o teclado ao carregar e permite revelar a senha por um alvo acessivel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const password = screen.getByLabelText('Senha');
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' });

    expect(password).not.toHaveFocus();
    expect(password).toHaveAttribute('type', 'password');
    expect(password).toHaveAttribute('enterkeyhint', 'go');

    await user.click(toggle);

    expect(password).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
