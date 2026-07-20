import { Reveal } from '@/components/Reveal';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-2 py-10 text-center">
      <div className="layout">
        <Reveal>
          <p className="text-[0.8rem] text-fg-muted">
            © {year} Bevilacqua Labs<sup className="reg">®</sup>. Todos os direitos reservados.
          </p>
          <p className="mt-2 text-[0.72rem] text-fg-subtle">
            Construido com React, NestJS e TypeScript.
          </p>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-0.5 w-15 rounded-full bg-neon [box-shadow:var(--shadow-accent-glow)]"
          />
        </Reveal>
      </div>
    </footer>
  );
}
