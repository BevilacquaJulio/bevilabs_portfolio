import { Reveal } from './Reveal';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: 'center' | 'left';
  id?: string;
};

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = 'center',
  id,
}: SectionHeadingProps) {
  return (
    <Reveal className={align === 'center' ? 'mb-12 text-center' : 'mb-12'}>
      {eyebrow && (
        <span className="mb-3 inline-block font-body text-xs font-medium tracking-[0.18em] text-neon uppercase">
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className="font-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.1] font-extrabold tracking-[-0.03em]"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={
            'mt-4 text-[clamp(0.9rem,2vw,1.05rem)] leading-relaxed font-light text-fg-muted ' +
            (align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl')
          }
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
