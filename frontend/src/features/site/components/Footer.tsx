import { Reveal } from '@/components/Reveal';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <div className="layout">
        <Reveal className="flex flex-col gap-2 border-t border-line py-5 text-[0.8rem] text-fg-muted sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-6 sm:text-[0.84rem]">
          <p>
            © {year} Bevilacqua Labs<sup className="reg">®</sup>
          </p>
          <p className="font-mono text-[0.68rem] tracking-[0.04em]">Node.js / React / TypeScript</p>
        </Reveal>
      </div>
    </footer>
  );
}
