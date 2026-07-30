import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Elemento assinatura do site.
 *
 * Desenha o caminho de uma requisicao pela arquitetura real do projeto, no
 * formato de waterfall que qualquer dev reconhece. As barras preenchem em
 * sequencia, na mesma ordem em que as camadas respondem.
 *
 * Os tempos sao de referencia e ilustram a proporcao entre as etapas, nao uma
 * medicao ao vivo. O componente deixa isso explicito no rodape e no texto
 * alternativo lido por leitores de tela.
 */

export type TraceSpan = {
  /** Camada que executa a etapa. */
  service: string;
  /** O que a camada faz. */
  op: string;
  /** Inicio da etapa, em milissegundos a partir da borda. */
  start: number;
  /** Duracao da etapa, em milissegundos. */
  dur: number;
};

type SystemTraceProps = {
  method: string;
  route: string;
  status: string;
  spans: readonly TraceSpan[];
  /** Rodape a esquerda. Descreve a natureza dos numeros. */
  note: string;
  tone?: 'light' | 'dark';
  className?: string;
};

/** Duracao da leitura completa do waterfall, em segundos. */
const CYCLE = 1.9;

const TONE = {
  light: {
    shell: 'border-line bg-bg-elevated text-fg [box-shadow:var(--shadow-panel)]',
    rule: 'border-line',
    method: 'bg-ink text-paper',
    route: 'text-fg',
    dot: 'bg-success',
    status: 'text-fg-subtle',
    service: 'text-fg',
    op: 'text-fg-subtle',
    ms: 'text-fg',
    unit: 'text-fg-subtle',
    track: 'bg-bg-subtle',
    bar: 'bg-ink',
    note: 'text-fg-subtle',
    total: 'text-fg',
  },
  dark: {
    shell: 'border-white/14 bg-white/[0.04] text-paper',
    rule: 'border-white/12',
    method: 'bg-paper text-ink',
    route: 'text-paper',
    dot: 'bg-paper',
    status: 'text-paper/55',
    service: 'text-paper',
    op: 'text-paper/50',
    ms: 'text-paper',
    unit: 'text-paper/45',
    track: 'bg-white/10',
    bar: 'bg-paper',
    note: 'text-paper/50',
    total: 'text-paper',
  },
} as const;

export function SystemTrace({
  method,
  route,
  status,
  spans,
  note,
  tone = 'light',
  className,
}: SystemTraceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.35 });
  const [started, setStarted] = useState(false);

  const total = spans.reduce((end, span) => Math.max(end, span.start + span.dur), 0);
  const count = useMotionValue(0);
  const shownTotal = useTransform(count, (value) => Math.round(value));

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  useEffect(() => {
    if (!started) return;

    if (reducedMotion) {
      count.set(total);
      return;
    }

    count.set(0);
    const controls = animate(count, total, { duration: CYCLE, ease: 'linear' });
    return () => controls.stop();
  }, [count, reducedMotion, started, total]);

  const palette = TONE[tone];
  // Sem movimento, o painel nasce pronto. Com movimento, ele espera entrar em tela.
  const filled = started || Boolean(reducedMotion);

  return (
    <figure ref={ref} className={cn('min-w-0', className)}>
      <div
        className={cn(
          'overflow-hidden rounded-[var(--radius-md)] border backdrop-blur-[2px]',
          palette.shell,
        )}
      >
        <header
          className={cn(
            'flex items-center gap-2.5 border-b px-4 py-3 font-mono text-[0.66rem] sm:px-5',
            palette.rule,
          )}
        >
          <span
            className={cn(
              'rounded-full px-2 py-[3px] text-[0.6rem] font-semibold tracking-[0.08em]',
              palette.method,
            )}
          >
            {method}
          </span>
          <span className={cn('min-w-0 truncate tracking-[0.01em]', palette.route)}>{route}</span>
          <span className={cn('ml-auto flex shrink-0 items-center gap-1.5', palette.status)}>
            <span className={cn('size-1.5 rounded-full', palette.dot)} />
            {status}
          </span>
        </header>

        <ol className="px-4 py-4 sm:px-5">
          {spans.map((span) => {
            const offset = (span.start / total) * 100;
            const width = (span.dur / total) * 100;
            const enterAt = (span.start / total) * CYCLE;
            const settleAt = ((span.start + span.dur) / total) * CYCLE;

            return (
              <li key={`${span.service}-${span.op}`} className="pt-3 first:pt-0">
                <div className="flex items-baseline gap-3 font-mono text-[0.66rem] leading-none">
                  <span className={cn('shrink-0 font-medium', palette.service)}>
                    {span.service}
                  </span>
                  <span className={cn('min-w-0 flex-1 truncate text-right', palette.op)}>
                    {span.op}
                  </span>
                  <motion.span
                    initial={reducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: filled ? 1 : 0 }}
                    transition={{ delay: settleAt, duration: 0.18 }}
                    className={cn('w-[3.1rem] shrink-0 text-right tabular-nums', palette.ms)}
                  >
                    {span.dur}
                    <span className={palette.unit}>ms</span>
                  </motion.span>
                </div>

                <div
                  aria-hidden="true"
                  className={cn(
                    'relative mt-2 h-[3px] overflow-hidden rounded-full',
                    palette.track,
                  )}
                >
                  <motion.span
                    initial={reducedMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: filled ? 1 : 0 }}
                    transition={{
                      delay: enterAt,
                      duration: Math.max((span.dur / total) * CYCLE, 0.14),
                      ease: 'linear',
                    }}
                    style={{ left: `${offset}%`, width: `max(${width}%, 6px)` }}
                    className={cn('absolute inset-y-0 origin-left rounded-full', palette.bar)}
                  />
                </div>
              </li>
            );
          })}
        </ol>

        <footer
          className={cn(
            'flex items-baseline justify-between gap-4 border-t px-4 py-3 font-mono text-[0.62rem] sm:px-5',
            palette.rule,
          )}
        >
          <span className={cn('min-w-0 truncate', palette.note)}>{note}</span>
          <span className={cn('shrink-0 tabular-nums', palette.total)}>
            <motion.span>{shownTotal}</motion.span>
            <span className={palette.unit}> ms</span>
          </span>
        </footer>
      </div>

      {/* As etapas já são lidas na lista acima. A legenda só dá o contexto. */}
      <figcaption className="sr-only">
        {`Ilustração das ${spans.length} etapas de uma requisição ${method} ${route}, ` +
          `com tempos de referência que somam ${total} milissegundos. Não é uma medição ao vivo.`}
      </figcaption>
    </figure>
  );
}
