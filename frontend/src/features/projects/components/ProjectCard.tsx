import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { normalizeProjectIcon } from '@/components/project-icons';
import { useCardHover } from '@/lib/motion';
import { getSafeProjectUrl, type Project } from '../projects.types';

type ProjectCardProps = {
  project: Project;
  /** Posicao na listagem. Vira o numero de catalogo impresso no topo da ficha. */
  index?: number;
  className?: string;
};

/**
 * Entrada de scroll da ficha.
 *
 * Anima `y`, e nao a string `transform`, para nao travar o hover do card: uma
 * string `transform` inline vence a classe de hover do Tailwind e mata o gesto.
 *
 * O atraso vem do `custom` para a linha cascatear da esquerda para a direita.
 */
const projectReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] },
  }),
};

/**
 * Cada ficha dispara pela propria posicao, e nao pela da grade.
 *
 * Amarrado a grade, o gatilho abria com 15% dela visivel — a animacao terminava
 * antes do card aparecer, e a segunda linha nunca animava na tela.
 */
const REVEAL_VIEWPORT = { once: true, amount: 0.25 } as const;

/** Passo da cascata na linha. Tres colunas no desktop, o maior caso. */
const REVEAL_STEP = 0.07;

const PROJECT_DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const TECHNOLOGY_MATCHERS: ReadonlyArray<readonly [label: string, pattern: RegExp]> = [
  ['TypeScript', /\btypescript\b/i],
  ['JavaScript', /\bjavascript\b/i],
  ['React', /\breact(?:\.?js)?\b/i],
  ['Next.js', /\bnext(?:\.?js)?\b/i],
  ['Vue', /\bvue(?:\.?js)?\b/i],
  ['Angular', /\bangular\b/i],
  ['Vite', /\bvite\b/i],
  ['Tailwind CSS', /\btailwind(?:\s*css)?\b/i],
  ['Node.js', /\bnode(?:\.?js)?\b/i],
  ['NestJS', /\bnest(?:\.?js)?\b/i],
  ['Express', /\bexpress(?:\.?js)?\b/i],
  ['Java', /\bjava\b/i],
  ['Spring', /\bspring(?:\s*boot)?\b/i],
  ['Python', /\bpython\b/i],
  ['Django', /\bdjango\b/i],
  ['PHP', /\bphp\b/i],
  ['Laravel', /\blaravel\b/i],
  ['Prisma', /\bprisma\b/i],
  ['TypeORM', /\btypeorm\b/i],
  ['MySQL', /\bmysql\b/i],
  ['PostgreSQL', /\bpostgres(?:ql)?\b/i],
  ['MongoDB', /\bmongodb\b/i],
  ['Redis', /\bredis\b/i],
  ['Docker', /\bdocker\b/i],
  ['Traefik', /\btraefik\b/i],
  ['GraphQL', /\bgraphql\b/i],
  ['WebSocket', /\bwebsockets?\b/i],
  ['JWT', /\bjwt\b/i],
];

function getProjectTechnologies(project: Project): string[] {
  const source = `${project.title} ${project.description}`;

  return TECHNOLOGY_MATCHERS.filter(([, pattern]) => pattern.test(source))
    .map(([label]) => label)
    .slice(0, 3);
}

function getProjectHost(safeLink: string | null): string | null {
  if (!safeLink) return null;

  return new URL(safeLink).hostname.replace(/^www\./i, '');
}

function getProjectDate(value: string): string | null {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return PROJECT_DATE_FORMATTER.format(date);
}

/**
 * Ficha unica de projeto.
 *
 * Todo projeto usa exatamente este molde: mesma moldura, mesmos quatro blocos
 * (cabecalho, texto, stack, destino) e mesmas reguas de 1px separando eles. As
 * alturas minimas de titulo e descricao existem para que as reguas caiam na
 * mesma linha em todos os cards da grade, independente do tamanho do texto.
 * Nenhum card recebe tratamento especial: o padrao e a identidade.
 */
export function ProjectCard({ project, index = 0, className = '' }: ProjectCardProps) {
  const safeLink = getSafeProjectUrl(project.link);
  const host = getProjectHost(safeLink);
  const dateLabel = getProjectDate(project.createdAt);
  const technologies = getProjectTechnologies(project);
  const icon = normalizeProjectIcon(project.icon);
  const catalogNumber = String(index + 1).padStart(2, '0');
  const cardHover = useCardHover(-5);
  const shouldReduceMotion = useReducedMotion();

  const surfaceClass = [
    'group relative flex h-full min-h-[19rem] flex-col overflow-hidden rounded-[var(--radius-md)]',
    'border border-line bg-bg-elevated p-5 text-fg sm:p-6',
    'transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out)]',
    'motion-reduce:transition-none',
    safeLink && 'hover:border-ink hover:[box-shadow:var(--shadow-float)]',
    safeLink &&
      'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {/* Cabecalho: selo do projeto a esquerda, numero de catalogo a direita. */}
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden="true"
          className={[
            'inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)]',
            'border border-line bg-bg-subtle text-fg',
            'transition-colors duration-300 ease-[var(--ease-out)] motion-reduce:transition-none',
            safeLink && 'group-hover:border-ink group-hover:bg-ink group-hover:text-paper',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Icon name={icon} className="size-4.5" weight="light" />
        </span>

        <span
          aria-hidden="true"
          className="font-mono text-[0.68rem] font-medium tracking-[0.14em] text-fg-subtle"
        >
          {catalogNumber}
        </span>
      </div>

      {/* Texto: data, titulo e resumo, sempre nesta ordem e nesta escala. */}
      <p className="mt-5 font-mono text-[0.6rem] font-medium tracking-[0.14em] text-fg-subtle uppercase sm:mt-6">
        {dateLabel ? <time dateTime={project.createdAt}>{dateLabel}</time> : 'Sem data'}
      </p>

      <h3 className="mt-2 line-clamp-2 min-h-[3.05rem] [overflow-wrap:anywhere] font-display text-[1.3rem] leading-[1.15] font-bold tracking-[-0.035em] text-balance sm:min-h-[3.25rem] sm:text-[1.4rem]">
        {project.title}
      </h3>

      <p className="mt-2.5 line-clamp-3 min-h-[4.35rem] [overflow-wrap:anywhere] text-[0.9rem] leading-[1.6] font-light text-fg-muted sm:min-h-[4.55rem] sm:text-[0.94rem]">
        {project.description}
      </p>

      {/* Stack: rotulo fixo a esquerda, valores a direita. Sempre presente. */}
      <div
        aria-label="Tecnologias citadas neste projeto"
        className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-3.5 sm:mt-6"
      >
        <span className="shrink-0 font-mono text-[0.6rem] font-medium tracking-[0.1em] text-fg-subtle uppercase">
          Stack
        </span>
        <span className="min-w-0 truncate text-right text-[0.82rem] font-medium">
          {technologies.length > 0 ? technologies.join(' · ') : 'Não informada'}
        </span>
      </div>

      {/* Destino: encostado na base para alinhar a regua entre os cards. */}
      <div className="mt-auto grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-line pt-3.5">
        <span className="min-w-0 truncate font-mono text-[0.65rem] tracking-[0.05em] text-fg-subtle">
          {host ?? 'Destino não disponível'}
        </span>

        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center gap-2 text-[0.7rem] font-semibold tracking-[0.12em] uppercase"
        >
          {safeLink ? 'Abrir' : 'Link indisponível'}
          <Icon
            name={safeLink ? 'arrowUpRight' : 'lock'}
            className={[
              'size-4 transition-transform duration-200 ease-[var(--ease-out)]',
              'motion-reduce:transform-none motion-reduce:transition-none',
              safeLink && 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </span>
      </div>

      {/* Unico acento da ficha: regua de tinta que fecha a moldura no hover. */}
      <span
        aria-hidden="true"
        className={[
          'pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-ink',
          'transition-transform duration-300 ease-[var(--ease-out)]',
          'group-hover:scale-x-100 group-focus-visible:scale-x-100',
          'motion-reduce:transform-none motion-reduce:transition-none',
        ].join(' ')}
      />
    </>
  );

  return (
    <motion.article
      variants={projectReveal}
      custom={(index % 3) * REVEAL_STEP}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      {...(safeLink ? cardHover : {})}
      className={`h-full ${className}`}
    >
      {safeLink ? (
        <a
          href={safeLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir projeto ${project.title} em uma nova aba`}
          className={surfaceClass}
        >
          {content}
        </a>
      ) : (
        <div className={surfaceClass}>{content}</div>
      )}
    </motion.article>
  );
}
