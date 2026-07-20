import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';

export default function NotFoundPage() {
  return (
    <main className="relative z-2 flex min-h-dvh flex-col items-center justify-center px-[var(--layout-pad)] text-center">
      <p className="neon-text font-display text-6xl font-extrabold">404</p>
      <h1 className="mt-4 font-display text-xl font-bold">Pagina nao encontrada</h1>
      <p className="mt-2 max-w-sm text-sm font-light text-fg-muted">
        O endereco que voce tentou acessar nao existe ou foi movido.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="ghost">Voltar ao inicio</Button>
      </Link>
    </main>
  );
}
