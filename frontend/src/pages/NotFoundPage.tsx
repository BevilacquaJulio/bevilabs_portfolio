import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';

export default function NotFoundPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Página não encontrada | Bevilacqua Labs';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="relative z-2 grid min-h-dvh place-items-center px-[var(--layout-pad)] pt-[calc(2rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] sm:py-16">
      <div className="grid w-full max-w-4xl gap-6 border-y border-ink py-8 sm:gap-8 sm:py-10 md:grid-cols-[0.75fr_1.25fr] md:items-end md:py-14">
        <p
          aria-hidden="true"
          className="font-display text-[clamp(3.6rem,20vw,8.5rem)] leading-[0.8] font-extrabold tracking-[-0.07em]"
        >
          404
        </p>
        <div>
          <h1 className="font-display text-[clamp(1.7rem,4.2vw,3.2rem)] leading-[1] font-extrabold tracking-[-0.042em]">
            Página não encontrada
          </h1>
          <p className="mt-5 max-w-md leading-[1.65] text-fg-muted">
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-[transform,background-color,box-shadow] duration-200 ease-[var(--ease-out)] hover:bg-accent-deep hover:[box-shadow:var(--shadow-accent)] active:scale-[0.97] motion-reduce:transform-none sm:w-auto"
          >
            Voltar ao início
            <Icon name="arrowUpRight" className="size-4 rotate-[-135deg]" />
          </Link>
        </div>
      </div>
    </main>
  );
}
