import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { defaultViewport, staggerContainer, staggerItem } from '@/lib/motion';
import { PROCESS } from '../data/content';

const STEP_OUTPUTS = [
  'Problema definido',
  'Contrato tipado',
  'Sistema testado',
  'Deploy observável',
] as const;

export function Process() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="metodologia"
      aria-labelledby="metodologia-title"
      className="relative z-2 scroll-mt-24 border-y border-line bg-bg-elevated py-12 md:py-20"
    >
      <div className="layout">
        <Reveal>
          <p className="font-mono text-[0.66rem] font-medium tracking-[0.12em] text-fg-muted uppercase">
            Do requisito ao deploy
          </p>
          <h2
            id="metodologia-title"
            className="mt-3 max-w-[10ch] font-display text-[1.55rem] leading-[1.06] font-extrabold tracking-[-0.042em] text-balance md:mt-3.5 md:text-[clamp(1.7rem,3.2vw,2.5rem)] md:leading-[1.02] md:tracking-[-0.046em]"
          >
            Como eu desenvolvo
          </h2>
          <p className="mt-4 max-w-[40ch] text-[0.92rem] leading-[1.62] text-fg-muted sm:text-[0.95rem] md:mt-5 md:text-[1.02rem]">
            Decisões claras antes do código e validação contínua até a produção.
          </p>
        </Reveal>

        <div className="relative mt-8 md:mt-14">
          <motion.span
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={defaultViewport}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-5 bottom-7 left-[1.35rem] w-px origin-top bg-line-strong md:hidden"
          />
          <motion.span
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={defaultViewport}
            transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-[1.35rem] right-[calc(25%-1.35rem)] left-[1.35rem] hidden h-px origin-left bg-line-strong md:block"
          />

          <motion.ol
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={defaultViewport}
            className="relative grid gap-4 md:grid-cols-4 md:gap-0"
          >
            {PROCESS.map((step, index) => (
              <motion.li
                key={step.title}
                variants={staggerItem}
                className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3.5 md:block md:pr-7"
              >
                <span
                  aria-hidden="true"
                  className="relative z-1 flex size-11 items-center justify-center rounded-full bg-ink font-mono text-[0.68rem] font-semibold text-paper ring-8 ring-bg-elevated"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 pb-5 md:mt-7 md:pb-0">
                  <p className="font-mono text-[0.58rem] font-medium tracking-[0.1em] text-fg-subtle uppercase">
                    {STEP_OUTPUTS[index]}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2.5">
                    <Icon name={step.icon} className="size-[1.1rem] shrink-0" weight="light" />
                    <h3 className="font-display text-[1.08rem] leading-tight font-bold tracking-[-0.025em]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3.5 max-w-[36ch] text-[0.86rem] leading-[1.62] text-fg-muted">
                    {step.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
