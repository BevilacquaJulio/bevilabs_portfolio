import { Component, type ErrorInfo, type ReactNode } from 'react';
import { MagneticButton } from '@/components/MagneticButton';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/** Evita que um erro de render derrube a pagina inteira em branco. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Erro não tratado na UI:', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="relative z-2 flex min-h-dvh flex-col items-center justify-center px-[var(--layout-pad)] pt-[calc(2rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] text-center">
        <h1 className="font-display text-2xl leading-tight font-bold tracking-[-0.035em]">
          Algo quebrou por aqui
        </h1>
        <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-fg-muted">
          Recarregue a página. Se continuar, me avise pelo e-mail de contato.
        </p>
        <MagneticButton
          type="button"
          onClick={() => window.location.reload()}
          className="mt-7 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] active:scale-[0.97] sm:w-auto"
        >
          Recarregar
        </MagneticButton>
      </main>
    );
  }
}
