import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/** Evita que um erro de render derrube a pagina inteira em branco. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Erro nao tratado na UI:', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-xl font-bold">Algo quebrou por aqui</h1>
        <p className="mt-2 max-w-sm text-sm font-light text-fg-muted">
          Recarregue a pagina. Se continuar, me avise pelo e-mail de contato.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full border border-line-strong px-5 py-2 text-sm font-medium transition-colors hover:border-neon/45 hover:text-neon"
        >
          Recarregar
        </button>
      </main>
    );
  }
}
