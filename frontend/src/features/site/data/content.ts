import type { IconName } from '@/components/Icon';
import type { TraceSpan } from '@/components/SystemTrace';

/**
 * Conteudo editorial do site em um unico lugar.
 * Trocar texto aqui nao exige mexer em componente nenhum.
 */

export const PROFILE = {
  name: 'Julio Bevilacqua',
  initials: 'JB',
  role: 'Node.js & React Developer',
  roleLong: 'Desenvolvedor Full Stack, Node.js (NestJS) e React',
  location: 'São Paulo, SP',
  email: 'juliobevi1@gmail.com',
  phone: '(11) 97710-5654',
  phoneHref: '+5511977105654',
  linkedin: 'https://linkedin.com/in/julio-bevi',
  linkedinLabel: 'linkedin.com/in/julio-bevi',
  github: 'https://github.com/BevilacquaJulio',
  githubLabel: 'github.com/BevilacquaJulio',
} as const;

export const HERO = {
  status: 'Disponível para oportunidades',
  role: 'Desenvolvedor Full Stack',
  /** As duas partes formam uma única frase no título. */
  title: ['Do', 'requisito', 'ao', 'deploy,'],
  titleAccent: ['com', 'visão', 'de', 'produto.'],
  subtitle:
    'Construo APIs em NestJS e interfaces React conectadas por TypeScript, da modelagem do banco à publicação em Docker.',
  ctaPrimary: { label: 'Ver experiência', href: '#experiencia' },
  ctaSecondary: { label: 'Ver projetos', href: '#projetos' },
  facts: [
    { label: 'Experiência', value: '2 anos em produção' },
    { label: 'Especialidade', value: 'Node.js + React' },
  ],
  focus: {
    eyebrow: 'Escopo profissional',
    title: 'TypeScript de ponta a ponta.',
    text: 'Um único ecossistema técnico, com contratos claros entre as camadas e menos ruído entre back-end e front-end.',
    areas: [
      { label: 'Back-end', value: 'Node.js, NestJS e Prisma' },
      { label: 'Front-end', value: 'React, TypeScript e Vite' },
      { label: 'Dados e entrega', value: 'MySQL, Docker e Traefik' },
    ],
    flow: ['Dados', 'API', 'Interface', 'Deploy'],
  },
} as const;

/**
 * O que acontece quando a senha do admin e enviada. Alimenta a tela de login.
 */
export const LOGIN_TRACE = {
  method: 'POST',
  route: '/api/auth/login',
  status: '200 OK',
  note: 'Tempos de referência',
  spans: [
    { service: 'traefik', op: 'tls + rate limit', start: 0, dur: 3 },
    { service: 'nestjs', op: 'validação da senha', start: 3, dur: 2 },
    { service: 'bcrypt', op: 'comparação do hash', start: 5, dur: 82 },
    { service: 'jwt', op: 'access + refresh', start: 87, dur: 4 },
    { service: 'cookie', op: 'httpOnly + sameSite', start: 91, dur: 1 },
  ] satisfies readonly TraceSpan[],
} as const;

export const ABOUT = {
  eyebrow: 'Perfil',
  title: 'Sobre mim',
  /** Frase de abertura, em destaque. Segura sozinha a hierarquia da seção. */
  lead: 'Construo sistemas full stack em Node e React, da modelagem do banco ao deploy, e mantenho cada um deles rodando em produção.',
  /** Princípios de trabalho. A numeração dos cards já dá a leitura da lista. */
  approach: [
    {
      label: 'Mesma língua',
      title: 'Front e back falam a mesma língua.',
      text: 'TypeScript do banco à tela, sem regra duplicada no caminho.',
    },
    {
      label: 'Sem bagunça',
      title: 'Cada parte fica no lugar certo.',
      text: 'Módulos claros, validação na entrada e acessos bem definidos.',
    },
    {
      label: 'No ar',
      title: 'Não deixo projeto preso no localhost.',
      text: 'Testes no que importa, Docker e deploy em Linux com HTTPS.',
    },
    {
      label: 'Junto com o time',
      title: 'Dou contexto e faço a entrega andar.',
      text: 'Referência técnica de três devs, do requisito ao deploy.',
    },
  ],
  /** Ficha rápida da coluna lateral. Cada item é uma linha alinhada à mesma grade. */
  facts: [
    { label: 'Base', value: 'São Paulo, SP' },
    { label: 'Foco', value: 'Node.js, NestJS, React, Vite e TypeScript' },
    { label: 'Formação', value: 'Análise e Desenvolvimento de Sistemas' },
    { label: 'Idiomas', value: 'Inglês avançado' },
  ],
} as const;

export const ABOUT_STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'R$200 mil+', label: 'Processados em um único evento' },
  { value: '3', label: 'Devs sob liderança técnica' },
  { value: '2 anos', label: 'Entregando sistemas em produção' },
  { value: '100%', label: 'TypeScript de ponta a ponta' },
];

export const PROCESS: ReadonlyArray<{ icon: IconName; title: string; text: string }> = [
  {
    icon: 'search',
    title: 'Entender',
    text: 'Mergulho no problema real antes de pensar em código: regras de negócio, usuários e restrições técnicas.',
  },
  {
    icon: 'compass',
    title: 'Modelar',
    text: 'Desenho o schema Prisma e os contratos da API em Zod. O tipo nasce uma vez e vale para o servidor e para o cliente.',
  },
  {
    icon: 'code',
    title: 'Construir',
    text: 'NestJS separando controller, service e repository; React com componentes pequenos e estado de servidor no TanStack Query. Testes com Vitest.',
  },
  {
    icon: 'rocket',
    title: 'Publicar',
    text: 'Build Docker multi-stage, Docker Compose e Traefik em VPS Linux, com TLS automático e migrations versionadas.',
  },
];

/**
 * Competências agrupadas nas mesmas categorias do currículo.
 * A ordem alimenta as três fileiras da seção, três grupos por fileira.
 */
export const STACK: ReadonlyArray<{
  icon: IconName;
  title: string;
  items: readonly string[];
}> = [
  // Fluxo do sistema: linguagens, API e interface.
  {
    icon: 'code',
    title: 'Linguagens',
    items: ['TypeScript', 'JavaScript (ES6+)', 'SQL'],
  },
  {
    icon: 'node',
    title: 'Back-end',
    items: [
      'Node.js',
      'NestJS',
      'APIs REST',
      'Prisma ORM',
      'Arquitetura modular (controllers, services, DTOs, guards)',
    ],
  },
  {
    icon: 'react',
    title: 'Front-end',
    items: ['React', 'Vite', 'TailwindCSS'],
  },
  {
    icon: 'database',
    title: 'Banco de Dados',
    items: ['MySQL', 'MariaDB', 'Modelagem relacional', 'Migrations'],
  },
  {
    icon: 'shield',
    title: 'Segurança & Autenticação',
    items: ['JWT', 'bcrypt', 'RBAC', 'Validação de schema (Zod)', 'Helmet', 'Rate limiting'],
  },
  {
    icon: 'check',
    title: 'Testes & Qualidade',
    items: ['Vitest', 'Supertest (e2e)', 'Testing Library', 'ESLint', 'Prettier'],
  },
  {
    icon: 'terminal',
    title: 'DevOps & Infraestrutura',
    items: [
      'Linux',
      'Docker',
      'Docker Compose',
      'Traefik',
      'Nginx',
      "SSL/Let's Encrypt",
      'Deploy em VPS',
    ],
  },
  {
    icon: 'github',
    title: 'Controle de Versão',
    items: ['Git', 'GitHub', 'Branches por ambiente (dev / homologação / produção)', 'Code review'],
  },
  {
    icon: 'layers',
    title: 'Metodologias & Gestão',
    items: ['Scrum', 'Kanban', 'Jira', 'Trello'],
  },
];

export const TIMELINE: ReadonlyArray<{
  period: string;
  title: string;
  text: string;
  tags: readonly string[];
}> = [
  {
    period: 'Set/2024 a Jul/2026',
    title: 'Desenvolvedor Full Stack · DSG Grupo',
    text: 'Referência técnica de um time de três desenvolvedores, do levantamento de requisitos ao deploy. Construí o sistema de vendas, saldo e estornos de um evento presencial que processou mais de R$ 200 mil, com permissões por perfil e trilha de estornos auditável.',
    tags: ['NestJS', 'React', 'TypeScript', 'MySQL', 'Docker'],
  },
  {
    period: 'Jul/2026',
    title: 'Bevilacqua Labs® · portfólio full stack',
    text: 'Este site: API em NestJS com Prisma e MySQL, autenticação JWT com refresh token rotativo e painel admin em React com TanStack Query. Deploy em Docker Compose atrás de Traefik com TLS automático.',
    tags: ['NestJS', 'Prisma', 'React', 'Vite', 'Docker', 'Traefik'],
  },
  {
    period: 'Jun/2026',
    title: 'Sistemas de back-end (projetos pessoais)',
    text: 'Arquiteto serviços de controle financeiro, change tracking com auditoria e controle de pedidos: API tipada, migrations versionadas e publicação em produção com Docker, Traefik e SSL automático.',
    tags: ['Node.js', 'TypeScript', 'Prisma', 'Traefik'],
  },
  {
    period: 'Fev/2026',
    title: 'Desenvolvedor Full Stack · Freelance, Atlas Stock',
    text: 'Sistema de gestão operacional, financeira e de estoque para uma empresa de blindagem de veículos: API em NestJS com MySQL, controle de custos por projeto e dashboard de indicadores em tempo real.',
    tags: ['NestJS', 'React', 'MySQL', 'Dashboard'],
  },
  {
    period: 'Jan/2026',
    title: 'Desenvolvedor Front-End · Freelance, Ultradesc Descartáveis',
    text: 'Landing page institucional e painel administrativo para a Ultradesc Descartáveis, empresa de produtos hospitalares. Projeto real em produção.',
    tags: ['JavaScript', 'HTML', 'CSS', 'MySQL'],
  },
  {
    period: 'Mar/2025',
    title: 'Desenvolvedor Front-End · Freelance, Motor Racing Performance & Consulting',
    text: 'Cliente americano (giaffone.com): animações responsivas orientadas a scroll, vídeo gerado com IA (Google Veo) integrado via Canvas e condução solo de todo o deploy em produção.',
    tags: ['JavaScript', 'Canvas', 'Animações', 'IA generativa'],
  },
];

export const TIMELINE_LINKS: Record<string, { href: string; label: string }> = {
  'Desenvolvedor Front-End · Freelance, Ultradesc Descartáveis': {
    href: 'https://ultradesc.com',
    label: 'ultradesc.com',
  },
  'Desenvolvedor Front-End · Freelance, Motor Racing Performance & Consulting': {
    href: 'https://giaffone.com',
    label: 'giaffone.com',
  },
};

export const EDUCATION = {
  eyebrow: 'Formação',
  title: 'Formação e idiomas',
  /** Linhas de uma mesma grade: período à esquerda, título ao centro, situação à direita. */
  items: [
    {
      icon: 'graduation',
      period: 'Ago/2024 a Dez/2026',
      title: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
      detail: 'Universidade Senac Santo Amaro',
      status: 'Em andamento',
    },
    {
      icon: 'globe',
      period: 'Contínuo',
      title: 'Inglês avançado',
      detail: 'Documentação técnica, escrita e atendimento a cliente internacional',
      status: 'Avançado',
    },
  ],
} as const satisfies {
  eyebrow: string;
  title: string;
  items: ReadonlyArray<{
    icon: IconName;
    period: string;
    title: string;
    detail: string;
    status: string;
  }>;
};

export const CONTACT = {
  eyebrow: 'Contato',
  title: 'O próximo sistema pode começar aqui.',
  lead: 'Se você tem uma vaga, um produto em construção ou um problema de engenharia, entre em contato comigo.',
} as const;

export const NAV_LINKS = [
  { href: '#inicio', label: 'Início', id: 'inicio' },
  { href: '#projetos', label: 'Projetos', id: 'projetos' },
  { href: '#sobre', label: 'Sobre', id: 'sobre' },
  { href: '#stack', label: 'Stack', id: 'stack' },
  { href: '#contato', label: 'Contato', id: 'contato' },
] as const;

export const SECTION_IDS = [
  'inicio',
  'sobre',
  'metodologia',
  'stack',
  'experiencia',
  'projetos',
  'contato',
] as const;
