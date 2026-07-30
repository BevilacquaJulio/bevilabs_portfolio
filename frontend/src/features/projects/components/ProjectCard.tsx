import { motion, type Variants } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { normalizeProjectIcon } from '@/components/project-icons';
import { useCardHover } from '@/lib/motion';
import { getSafeProjectUrl, type Project } from '../projects.types';

export type ProjectCardFormat = 'lead' | 'wide' | 'compact';
export type ProjectArtifactVariant = 'index' | 'route' | 'ledger';

type ProjectCardProps = {
  project: Project;
  format?: ProjectCardFormat;
  artifact?: ProjectArtifactVariant;
  className?: string;
};

type ProjectArtifactProps = {
  project: Project;
  host: string | null;
  dateLabel: string | null;
  variant: ProjectArtifactVariant;
  featured: boolean;
  split: boolean;
};

/** Anima `y`, e nao a string `transform`, para nao travar o hover do card. */
const projectReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.23, 1, 0.32, 1] },
  },
};

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

function getProjectInitials(title: string): string {
  return title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toLocaleUpperCase('pt-BR');
}

export function ProjectCard({
  project,
  format = 'compact',
  artifact = 'index',
  className = '',
}: ProjectCardProps) {
  const safeLink = getSafeProjectUrl(project.link);
  const host = getProjectHost(safeLink);
  const dateLabel = getProjectDate(project.createdAt);
  const technologies = getProjectTechnologies(project);
  const featured = format === 'lead';
  const split = format !== 'compact';
  const cardHover = useCardHover(featured ? -4 : -5);

  const surfaceClass = [
    'group grid h-full min-h-[20rem] overflow-hidden rounded-[var(--radius-md)] border sm:min-h-[22rem]',
    'transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out)]',
    'motion-reduce:transition-none',
    split && 'md:grid-cols-[minmax(0,1.08fr)_minmax(16rem,0.92fr)] md:grid-rows-1',
    safeLink &&
      'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current',
    featured
      ? `${safeLink ? 'focus-on-dark' : ''} border-ink bg-ink text-paper`
      : 'border-line bg-bg-elevated text-fg',
    safeLink && !featured && 'hover:border-ink hover:[box-shadow:var(--shadow-float)]',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <ProjectArtifact
        project={project}
        host={host}
        dateLabel={dateLabel}
        variant={artifact}
        featured={featured}
        split={split}
      />

      <div
        className={['flex min-w-0 flex-col p-4 sm:p-6', split && 'md:order-1 md:p-7']
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            'flex items-center justify-between gap-3 border-b pb-2.5 font-mono sm:gap-4 sm:pb-3',
            'text-[0.65rem] font-medium tracking-[0.12em] uppercase',
            featured ? 'border-white/15 text-paper/60' : 'border-line text-fg-subtle',
          ].join(' ')}
        >
          <span>Projeto</span>
          {dateLabel && <time dateTime={project.createdAt}>{dateLabel}</time>}
        </div>

        <h3
          className={[
            'mt-4 max-w-3xl [overflow-wrap:anywhere] font-display leading-[1.08] font-bold sm:mt-5 sm:leading-[1.04]',
            'tracking-[-0.04em] text-balance',
            featured
              ? 'text-[clamp(1.5rem,7vw,1.78rem)] sm:text-[clamp(1.78rem,3.8vw,2.9rem)]'
              : 'text-[clamp(1.24rem,5.8vw,1.42rem)] sm:text-[clamp(1.38rem,2.1vw,1.85rem)]',
          ].join(' ')}
        >
          {project.title}
        </h3>

        <p
          className={[
            'mt-3 max-w-2xl [overflow-wrap:anywhere] text-[0.9rem] leading-[1.6] font-light sm:mt-3.5 sm:text-[0.94rem]',
            featured
              ? 'line-clamp-4 text-paper/70 sm:line-clamp-5'
              : 'line-clamp-3 text-fg-muted sm:line-clamp-4',
          ].join(' ')}
        >
          {project.description}
        </p>

        {technologies.length > 0 && (
          <div
            aria-label="Tecnologias citadas neste projeto"
            className={[
              'mt-4 grid gap-1.5 border-y py-2.5 sm:mt-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4 sm:py-3',
              featured ? 'border-white/15' : 'border-line',
            ].join(' ')}
          >
            <span
              className={[
                'font-mono text-[0.6rem] font-medium tracking-[0.1em] uppercase',
                featured ? 'text-paper/55' : 'text-fg-subtle',
              ].join(' ')}
            >
              Stack citada
            </span>
            <span className="text-[0.82rem] font-medium sm:text-right">
              {technologies.join(', ')}
            </span>
          </div>
        )}

        <div
          className={[
            'mt-auto grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t pt-3 sm:gap-4 sm:pt-4',
            featured ? 'border-white/15' : 'border-line',
          ].join(' ')}
        >
          <span
            className={[
              'min-w-0 truncate font-mono text-[0.65rem] tracking-[0.05em]',
              featured ? 'text-paper/55' : 'text-fg-subtle',
            ].join(' ')}
          >
            {host ?? 'Destino não disponível'}
          </span>

          <span
            aria-hidden="true"
            className={[
              'inline-flex min-h-11 shrink-0 items-center gap-2 text-xs font-semibold',
              'tracking-[0.12em] uppercase',
              featured ? 'text-paper' : 'text-fg',
            ].join(' ')}
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
      </div>
    </>
  );

  return (
    <motion.article
      variants={projectReveal}
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

function ProjectArtifact({
  project,
  host,
  dateLabel,
  variant,
  featured,
  split,
}: ProjectArtifactProps) {
  const icon = normalizeProjectIcon(project.icon);
  const initials = getProjectInitials(project.title);
  const artifactBorder = featured ? 'border-ink/12' : 'border-white/15';
  const mutedText = featured ? 'text-ink/55' : 'text-paper/55';

  return (
    <div
      aria-hidden="true"
      className={[
        'relative flex min-h-[9rem] min-w-0 flex-col overflow-hidden border-b p-4 sm:min-h-[11rem] sm:p-5',
        split && 'md:order-2 md:min-h-full md:border-b-0 md:border-l',
        featured
          ? 'border-ink/15 bg-paper text-ink'
          : 'blueprint border-white/15 bg-ink text-paper',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'relative z-1 flex items-center justify-between gap-3 border-b pb-2.5 sm:gap-4 sm:pb-3',
          artifactBorder,
        ].join(' ')}
      >
        <span className="font-mono text-[0.62rem] font-medium tracking-[0.14em] uppercase">
          Ficha do projeto
        </span>
        <span
          className={[
            'inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] border sm:size-10',
            artifactBorder,
            featured ? 'bg-ink text-paper' : 'bg-paper text-ink',
          ].join(' ')}
        >
          <Icon name={icon} className="size-4.5" />
        </span>
      </div>

      {variant === 'index' && (
        <div className="relative z-1 flex flex-1 items-end justify-between gap-3 py-4 sm:gap-5 sm:py-5">
          <span className="font-display text-[clamp(2.3rem,10vw,2.9rem)] leading-[0.8] font-extrabold tracking-[-0.085em] sm:text-[clamp(2.8rem,6.2vw,5rem)] sm:leading-[0.76]">
            {initials}
          </span>
          <div className="min-w-0 max-w-[9rem] text-right sm:max-w-[13rem]">
            <p className={`font-mono text-[0.6rem] tracking-[0.12em] uppercase ${mutedText}`}>
              Destino
            </p>
            <p className="mt-2 truncate text-sm font-medium">{host ?? 'Sem link seguro'}</p>
          </div>
        </div>
      )}

      {variant === 'route' && (
        <div className="relative z-1 flex flex-1 flex-col justify-center py-4 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={[
                'inline-flex size-2.5 shrink-0 rounded-full border-2',
                featured ? 'border-ink bg-paper' : 'border-paper bg-ink',
              ].join(' ')}
            />
            <p className="line-clamp-1 min-w-0 font-display text-base leading-tight font-bold tracking-[-0.025em] sm:text-lg">
              {project.title}
            </p>
          </div>
          <span className={`ml-[0.28rem] h-8 w-px ${featured ? 'bg-ink/25' : 'bg-white/25'}`} />
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={[
                'inline-flex size-2.5 shrink-0 rounded-full',
                featured ? 'bg-ink' : 'bg-paper',
              ].join(' ')}
            />
            <p className={`min-w-0 truncate font-mono text-[0.7rem] ${mutedText}`}>
              {host ?? 'Destino não disponível'}
            </p>
          </div>
        </div>
      )}

      {variant === 'ledger' && (
        <dl className="relative z-1 grid flex-1 content-center gap-0 py-2 sm:py-3">
          {[
            ['Identificação', initials],
            ['Registro', dateLabel ?? 'Data não disponível'],
            ['Destino', host ?? 'Link não disponível'],
          ].map(([label, value]) => (
            <div
              key={label}
              className={`grid grid-cols-[5.6rem_minmax(0,1fr)] items-baseline gap-3 border-b py-2 last:border-b-0 sm:grid-cols-[6.2rem_minmax(0,1fr)] sm:py-2.5 ${artifactBorder}`}
            >
              <dt className={`font-mono text-[0.58rem] tracking-[0.1em] uppercase ${mutedText}`}>
                {label}
              </dt>
              <dd className="truncate text-right text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <span
        className={[
          'absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0',
          'transition-transform duration-200 ease-[var(--ease-out)]',
          'group-hover:scale-x-100 group-focus-visible:scale-x-100',
          'motion-reduce:transform-none motion-reduce:transition-none',
          featured ? 'bg-ink' : 'bg-paper',
        ].join(' ')}
      />
    </div>
  );
}
