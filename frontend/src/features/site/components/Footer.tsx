import { Icon } from '@/components/Icon';
import { PROFILE } from '../data/content';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="surface-contact relative z-[var(--z-content)] text-on-dark-muted">
      <div className="layout flex flex-col gap-4 border-t border-white/12 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8rem]">
          <img
            src="/images/brand/logo-blabs.png"
            alt="B.Labs"
            width={937}
            height={254}
            className="h-[1.35rem] w-auto shrink-0 object-contain brightness-0 invert sm:h-6"
          />
          <span aria-hidden="true" className="text-white/25">
            /
          </span>
          <span>
            © {YEAR} {PROFILE.name}
          </span>
        </p>

        <a
          href="#inicio"
          className="group focus-on-dark inline-flex min-h-11 items-center gap-2 self-start font-mono text-[0.68rem] tracking-[0.1em] uppercase transition-colors duration-200 hover:text-on-dark sm:self-auto"
        >
          Voltar ao topo
          <Icon
            name="arrowUpRight"
            className="size-3.5 transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-0.5 motion-reduce:transform-none"
            weight="bold"
          />
        </a>
      </div>
    </footer>
  );
}
