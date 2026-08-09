import type { IconName } from '@/components/Icon';
import type { TechSlug } from '@/features/site/components/tech-glyphs';

/**
 * Todo o texto do site em um lugar só.
 *
 * Regra de divisão, para nenhuma seção repetir a outra:
 *   Hero        quem é e o que faz, em três linhas.
 *   Projetos    o trabalho entregue. Vem do banco, via API.
 *   Stack       o inventário de tecnologias, com marca e categoria.
 *   Trajetória  onde, quando e o resultado de cada passagem.
 *   Sobre       como trabalha, e os números que sustentam.
 *   Contato     os canais.
 */

export const PROFILE = {
  name: 'Julio Bevilacqua',
  fullName: 'Julio Cesar Ferreira Bevilacqua',
  brand: 'Bevilacqua Labs',
  initials: 'BL',
  role: 'Desenvolvedor Full Stack',
  stackLine: 'Node + React',
  location: 'São Paulo, SP',
  country: 'Brasil',
  email: 'juliobevi1@gmail.com',
  phoneLabel: '(11) 97710-5654',
  whatsapp: 'https://wa.me/5511977105654',
  linkedin: 'https://linkedin.com/in/julio-bevi',
  linkedinLabel: 'linkedin.com/in/julio-bevi',
  github: 'https://github.com/BevilacquaJulio',
  githubLabel: 'github.com/BevilacquaJulio',
} as const;

export const HERO = {
  status: {
    lead: 'Disponível',
    detail: 'para novas oportunidades',
  },
  /** Cada letra sobe de dentro da própria máscara. */
  wordmark: ['Bevilacqua', 'Labs'] as const,
  greeting: 'por Julio Bevilacqua',
  role: 'Desenvolvedor Full Stack',
  stackLine: 'Node.js + React',
  statement:
    'Aplicações completas, da modelagem de dados e APIs NestJS à interface React e ao deploy com Docker.',
  ctaPrimary: { label: 'Ver projetos', href: '#projetos' },
  ctaSecondary: { label: 'Falar comigo', href: '#contato' },
  /** Três provas curtas na régua abaixo da apresentação. */
  proof: [
    { icon: 'code', value: '2+ anos', label: 'em produção' },
    { icon: 'chart', value: 'R$ 200 mil+', label: 'processados' },
    { icon: 'pin', value: 'São Paulo', label: 'Brasil' },
  ],
} as const satisfies {
  status: { lead: string; detail: string };
  wordmark: readonly [string, string];
  greeting: string;
  role: string;
  stackLine: string;
  statement: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  proof: ReadonlyArray<{ icon: IconName; value: string; label: string }>;
};

export const PROJECTS_SECTION = {
  label: 'Meus projetos',
  title: 'Projetos em produção',
  subtitle:
    'Sistemas no ar, com usuários reais. Em cada um eu fui do modelo de dados até a publicação.',
} as const;

export const STACK_SECTION = {
  label: 'Stacks',
  title: 'Minhas habilidades e stacks que eu uso',
  subtitle:
    'TypeScript conecta banco, API e interface. Filtre por camada para ver o que cada uma resolve.',
} as const;

export type TechGroupId = 'backend' | 'frontend' | 'dados' | 'infra';

export const TECH_GROUPS: ReadonlyArray<{ id: TechGroupId; name: string; role: string }> = [
  { id: 'backend', name: 'Back-end', role: 'Regra de negócio, contrato e autenticação' },
  { id: 'frontend', name: 'Front-end', role: 'Interface, estado e formulário' },
  { id: 'dados', name: 'Dados', role: 'Modelagem, migração e persistência' },
  { id: 'infra', name: 'Infra e qualidade', role: 'Publicação, proxy, TLS e testes' },
];

export type TechItem = { slug: TechSlug; name: string; group: TechGroupId };

export const TECH_ITEMS: readonly TechItem[] = [
  { slug: 'nodedotjs', name: 'Node.js', group: 'backend' },
  { slug: 'nestjs', name: 'NestJS', group: 'backend' },
  { slug: 'typescript', name: 'TypeScript', group: 'backend' },
  { slug: 'jsonwebtokens', name: 'JWT', group: 'backend' },

  { slug: 'react', name: 'React', group: 'frontend' },
  { slug: 'vite', name: 'Vite', group: 'frontend' },
  { slug: 'tailwindcss', name: 'Tailwind', group: 'frontend' },

  { slug: 'mysql', name: 'MySQL', group: 'dados' },
  { slug: 'mariadb', name: 'MariaDB', group: 'dados' },
  { slug: 'prisma', name: 'Prisma', group: 'dados' },

  { slug: 'docker', name: 'Docker', group: 'infra' },
  { slug: 'traefikproxy', name: 'Traefik', group: 'infra' },
  { slug: 'nginx', name: 'Nginx', group: 'infra' },
  { slug: 'linux', name: 'Linux', group: 'infra' },
  { slug: 'git', name: 'Git', group: 'infra' },
  { slug: 'vitest', name: 'Vitest', group: 'infra' },
];

export const JOURNEY_SECTION = {
  label: 'Trajetória',
  title: 'Minha trajetória profissional',
  subtitle: 'Onde eu trabalhei, o que construí e o que ficou de resultado em cada passagem.',
} as const;

export type JourneyEntry = {
  id: string;
  period: string;
  role: string;
  org: string;
  summary: string;
  /** Um número só por entrada, e apenas quando existe um de verdade. */
  highlight?: { value: string; label: string };
  tags: readonly string[];
  link?: { href: string; label: string };
  kind?: 'work' | 'education';
};

export const JOURNEY: readonly JourneyEntry[] = [
  {
    id: 'dsg',
    period: 'Set/2024 · Jul/2026',
    role: 'Desenvolvedor Full Stack',
    org: 'DSG Grupo',
    summary:
      'Referência técnica de um time de três desenvolvedores, do levantamento de requisitos ao deploy. Construí o sistema de vendas, saldo e estornos de um evento presencial, com permissão por perfil e trilha auditável, e padronizei o versionamento por ambiente.',
    highlight: { value: 'R$ 200 mil+', label: 'processados em um único evento' },
    tags: ['NestJS', 'React', 'TypeScript', 'MySQL', 'Docker'],
  },
  {
    id: 'atlas',
    period: 'Fev/2026',
    role: 'Full Stack · Freelance',
    org: 'Atlas Stock',
    summary:
      'Sistema de gestão operacional, financeira e de estoque para uma empresa de blindagem de veículos, com controle de custo por projeto, rastreabilidade de material e dashboard de indicadores em tempo real.',
    tags: ['NestJS', 'Prisma', 'React', 'MySQL'],
  },
  {
    id: 'motor-racing',
    period: 'Mar/2025',
    role: 'Front-End · Freelance',
    org: 'Motor Racing Performance, cliente americano',
    summary:
      'Abertura orientada a scroll com 49 quadros desenhados em Canvas, interpolados por requestAnimationFrame e mantidos em refs para não re-renderizar o React. Player de vídeo, carrossel e deploy conduzidos sozinho.',
    highlight: { value: '60 fps', label: 'na animação de abertura' },
    tags: ['React', 'TypeScript', 'Canvas API', 'Vite'],
    link: { href: 'https://giaffone.com', label: 'giaffone.com' },
  },
  {
    id: 'labs',
    period: 'Contínuo',
    role: 'Projetos próprios',
    org: 'Bevilacqua Labs',
    summary:
      'Sistemas conteinerizados que eu modelo, construo, publico e mantenho na minha própria VPS, com TLS automático, migrations versionadas, logs estruturados e documentação de API.',
    tags: ['NestJS', 'Prisma', 'React', 'Traefik'],
  },
  {
    id: 'senac',
    period: 'Ago/2024 · Dez/2026',
    role: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
    org: 'Universidade Senac Santo Amaro',
    summary:
      'Em andamento. Inglês avançado, usado na leitura de documentação técnica e no atendimento a cliente internacional.',
    tags: [],
    kind: 'education',
  },
];

export const ABOUT = {
  label: 'Sobre mim',
  title: 'Construindo software que resolve problemas reais',
  paragraphs: [
    'Desenvolvedor Full Stack com experiência na criação de aplicações web completas, da arquitetura do back-end até interfaces modernas, bonitas e responsivas.',
    'Desenvolvo sistemas utilizados em produção, com foco em performance, segurança e experiência do usuário.',
    'Trabalho com Node.js, NestJS, React, TypeScript, MySQL, Docker e Linux, construindo APIs REST, autenticação, controle de permissões, dashboards e integrações.',
  ],
} as const;

/**
 * O número conta de zero até o valor quando o card entra na tela.
 * Quando o dado não é numérico, `text` entra no lugar e não há contagem.
 */
export type Metric = {
  icon: IconName;
  prefix?: string;
  value?: number;
  suffix?: string;
  text?: string;
  label: string;
  /** Um só por seção: o número mais forte ganha o card em azul cheio. */
  featured?: boolean;
};

export const ABOUT_METRICS: readonly Metric[] = [
  { icon: 'calendar', value: 2, suffix: '+', label: 'anos de experiência profissional' },
  { icon: 'squares', value: 6, suffix: '+', label: 'sistemas desenvolvidos' },
  {
    icon: 'chart',
    prefix: 'R$ ',
    value: 200,
    suffix: ' mil+',
    label: 'em transações processadas nos sistemas que auxiliei em desenvolvimento',
    featured: true,
  },
  { icon: 'gear', text: 'Full Stack', label: 'React · NestJS · Docker' },
];

export const CONTACT = {
  label: 'Contato',
  title: 'Se interessou no meu perfil?',
  lead: 'Aberto a vagas full stack e a projetos freelance. Escolha o canal que preferir.',
  availability: 'Disponível para novas oportunidades',
} as const;

export type ContactChannel = {
  id: string;
  icon: IconName;
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: 'email',
    icon: 'mail',
    label: 'E-mail',
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
  },
  {
    id: 'whatsapp',
    icon: 'whatsapp',
    label: 'WhatsApp',
    value: PROFILE.phoneLabel,
    href: PROFILE.whatsapp,
    external: true,
  },
  {
    id: 'linkedin',
    icon: 'linkedin',
    label: 'LinkedIn',
    value: PROFILE.linkedinLabel,
    href: PROFILE.linkedin,
    external: true,
  },
  {
    id: 'github',
    icon: 'github',
    label: 'GitHub',
    value: PROFILE.githubLabel,
    href: PROFILE.github,
    external: true,
  },
];

export const NAV_LINKS = [
  { href: '#projetos', label: 'Projetos', id: 'projetos', icon: 'folder' },
  { href: '#stack', label: 'Stacks', id: 'stack', icon: 'layers' },
  { href: '#trajetoria', label: 'Trajetória', id: 'trajetoria', icon: 'path' },
  { href: '#sobre', label: 'Sobre Mim', id: 'sobre', icon: 'user' },
  { href: '#contato', label: 'Contato', id: 'contato', icon: 'mail' },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  id: string;
  icon: IconName;
}>;

/** As cinco paradas do trilho lateral. A hero não entra: ela é o ponto de partida. */
export const RAIL_SECTIONS = NAV_LINKS;

export const SECTION_IDS = ['inicio', ...NAV_LINKS.map((link) => link.id)] as const;
