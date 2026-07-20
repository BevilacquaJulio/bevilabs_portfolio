import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { EDUCATION } from '../data/content';

export function Education() {
  return (
    <section id="educacao" className="relative z-2 scroll-mt-24 py-20 md:py-24">
      <div className="layout">
        <SectionHeading
          eyebrow="Educacao"
          title="Formacao"
          subtitle="Academico em andamento, alinhado a pratica do dia a dia."
        />

        <Reveal className="panel flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:gap-6 sm:p-8 sm:text-left">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl bg-bg-subtle text-neon [box-shadow:var(--shadow-neon-border)]">
            <Icon name="graduation" className="size-7" />
          </span>

          <div>
            <span className="text-[0.75rem] font-medium tracking-[0.1em] text-fg-subtle uppercase">
              {EDUCATION.period}
            </span>
            <h3 className="mt-1 font-display text-[1.1rem] font-bold">{EDUCATION.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{EDUCATION.institution}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
