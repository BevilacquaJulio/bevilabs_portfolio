import type { Project } from './projects.types';

/**
 * Stack exibida na lista de projetos.
 *
 * TODO(schema): isto deveria ser um campo `stack` no modelo Project do Prisma,
 * preenchido no painel admin. Enquanto ele não existe, a stack é lida do texto
 * do projeto com uma lista curada. Quando o campo entrar, apague este arquivo:
 * derivar dado de texto livre é frágil por natureza.
 */
const MATCHERS: ReadonlyArray<readonly [label: string, pattern: RegExp]> = [
  ['TypeScript', /\btypescript\b/i],
  ['JavaScript', /\bjavascript\b/i],
  ['React', /\breact(?:\.?js)?\b/i],
  ['Next.js', /\bnext(?:\.?js)?\b/i],
  ['Vite', /\bvite\b/i],
  ['Tailwind', /\btailwind(?:\s*css)?\b/i],
  ['Node.js', /\bnode(?:\.?js)?\b/i],
  ['NestJS', /\bnest(?:\.?js)?\b/i],
  ['Prisma', /\bprisma\b/i],
  ['MySQL', /\bmysql\b/i],
  ['MariaDB', /\bmariadb\b/i],
  ['PostgreSQL', /\bpostgres(?:ql)?\b/i],
  ['Docker', /\bdocker\b/i],
  ['Traefik', /\btraefik\b/i],
  ['JWT', /\bjwt\b/i],
  ['Zod', /\bzod\b/i],
  ['Canvas', /\bcanvas\b/i],
];

const MAX_VISIBLE = 3;

export function getProjectTechnologies(project: Project): string[] {
  const source = `${project.title} ${project.description}`;

  return MATCHERS.filter(([, pattern]) => pattern.test(source))
    .map(([label]) => label)
    .slice(0, MAX_VISIBLE);
}

/** Domínio do projeto, sem `www.`. Null quando o link não é seguro. */
export function getProjectHost(safeLink: string | null): string | null {
  if (!safeLink) return null;

  return new URL(safeLink).hostname.replace(/^www\./i, '');
}
