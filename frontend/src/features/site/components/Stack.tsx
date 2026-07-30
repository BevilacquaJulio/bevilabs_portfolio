import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { defaultViewport, staggerContainer, staggerItem } from '@/lib/motion';
import { STACK } from '../data/content';

type StackGroup = (typeof STACK)[number];
type StackRowData = {
  label: string;
  groups: readonly StackGroup[];
  /** Na fileira do fluxo, as setas ocupam os vãos entre as colunas. */
  flow?: true;
};

const ROWS: readonly StackRowData[] = [
  { label: 'Fluxo do sistema', groups: STACK.slice(0, 3), flow: true },
  { label: 'Dados & camadas', groups: STACK.slice(3, 6) },
  { label: 'Entrega & processo', groups: STACK.slice(6, 9) },
];

function StackCell({ group, hasNext }: { group: StackGroup; hasNext?: boolean }) {
  return (
    <motion.article
      variants={staggerItem}
      className="relative flex min-h-0 flex-col p-4 min-[390px]:p-5 md:min-h-[10.5rem] md:p-6"
    >
      <header className="flex min-w-0 items-start justify-between gap-3 md:min-h-10">
        <h3 className="max-w-[18ch] font-display text-[1rem] leading-[1.15] font-bold tracking-[-0.025em] text-balance min-[390px]:text-[1.05rem] md:text-[1.08rem]">
          {group.title}
        </h3>
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-bg text-fg"
        >
          <Icon name={group.icon} className="size-[1.1rem]" weight="light" />
        </span>
      </header>

      <ul className="mt-4 font-mono text-[0.74rem] leading-[1.65] font-medium text-fg min-[390px]:text-[0.76rem]">
        {group.items.map((item, index) => (
          <li key={item} className="inline">
            {item}
            {index < group.items.length - 1 ? (
              <>
                {/* Espaço fixo antes da barra evita que ela abra a linha seguinte. */}
                <span aria-hidden="true" className="font-normal text-fg-subtle/45">
                  {'\u00a0|'}
                </span>{' '}
              </>
            ) : null}
          </li>
        ))}
      </ul>

      {hasNext ? (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 z-1 flex size-6 -translate-x-1/2 translate-y-1/2 rotate-90 items-center justify-center rounded-full border border-line bg-bg-elevated font-mono text-[0.7rem] leading-none text-fg-subtle md:top-1/2 md:right-0 md:bottom-auto md:left-auto md:-translate-y-1/2 md:translate-x-1/2 md:rotate-0"
        >
          →
        </span>
      ) : null}
    </motion.article>
  );
}

function StackRow({ row, shouldReduceMotion }: { row: StackRowData; shouldReduceMotion: boolean }) {
  return (
    <div className="grid lg:grid-cols-[8.25rem_minmax(0,1fr)]">
      <div className="flex items-center border-b border-line bg-bg-muted px-4 py-3.5 min-[390px]:px-5 lg:items-start lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
        <p className="font-mono text-[0.6rem] leading-[1.45] font-medium tracking-[0.1em] text-fg-subtle uppercase lg:max-w-[14ch]">
          {row.label}
          {row.flow ? <span className="sr-only">, de linguagens ao front-end</span> : null}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={defaultViewport}
        className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0"
      >
        {row.groups.map((group, index) => (
          <StackCell
            key={group.title}
            group={group}
            hasNext={row.flow && index < row.groups.length - 1}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function Stack() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="relative z-2 scroll-mt-24 py-12 md:py-20"
    >
      <div className="layout">
        <Reveal>
          <h2
            id="stack-title"
            className="max-w-[18ch] font-display text-[1.34rem] leading-[1.08] font-extrabold tracking-[-0.038em] text-balance min-[360px]:text-[1.44rem] min-[390px]:text-[1.54rem] md:text-[clamp(1.7rem,3vw,2.55rem)] md:leading-[1.04] md:tracking-[-0.042em]"
          >
            Competências que sustentam meu trabalho
          </h2>
          <p className="mt-4 max-w-[48ch] text-[0.92rem] leading-[1.6] text-fg-muted sm:text-[0.96rem] md:text-base">
            TypeScript conecta banco, API e interface. Cada tecnologia ocupa uma função específica
            dentro do mesmo sistema.
          </p>
        </Reveal>

        <div className="mt-8 divide-y divide-line overflow-hidden rounded-[var(--radius-md)] border border-ink bg-bg-elevated md:mt-12 md:rounded-[var(--radius-lg)]">
          {ROWS.map((row) => (
            <StackRow key={row.label} row={row} shouldReduceMotion={shouldReduceMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
