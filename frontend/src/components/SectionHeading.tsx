import { Reveal } from './Reveal';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: 'center' | 'left';
  id?: string;
};

/**
 * Cabecalho padrao de secao: sobrancelha, titulo e apoio.
 * Todas as secoes usam a mesma escala e o mesmo respiro para o conteudo abaixo.
 */
export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = 'left',
  id,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Reveal className={centered ? 'mb-10 text-center md:mb-14' : 'mb-10 md:mb-14'}>
      {eyebrow && (
        <p
          className={`mb-4 flex items-center gap-3 font-mono text-[0.62rem] font-medium tracking-[0.12em] text-fg-muted uppercase ${
            centered ? 'justify-center' : ''
          }`}
        >
          <span aria-hidden="true" className="h-px w-9 shrink-0 bg-line-strong" />
          {eyebrow}
        </p>
      )}

      <h2
        id={id}
        className={`font-display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-balance ${
          centered ? 'mx-auto max-w-[20ch]' : 'max-w-[19ch]'
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 max-w-[56ch] text-[0.92rem] leading-[1.6] text-fg-muted sm:text-[0.96rem] md:text-base ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
