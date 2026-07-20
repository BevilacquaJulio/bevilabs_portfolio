import type { IconName } from '@/components/Icon';

/**
 * Conteudo editorial do site em um unico lugar.
 * Trocar texto aqui nao exige mexer em componente nenhum.
 */

export const PROFILE = {
  name: 'Julio Bevilacqua',
  initials: 'JB',
  role: 'Node.js & React Developer',
  roleLong: 'Desenvolvedor Full Stack — Node.js (NestJS) & React',
  location: 'Sao Paulo, SP — Brasil',
  email: 'contato@bevilabs.com.br',
  phone: '(11) 97710-5654',
  phoneHref: '+5511977105654',
  linkedin: 'https://linkedin.com/in/julio-bevi',
  linkedinLabel: 'linkedin.com/in/julio-bevi',
  github: 'https://github.com/BevilacquaJulio',
  githubLabel: 'github.com/BevilacquaJulio',
} as const;

export const HERO = {
  badge: 'Disponivel para novos projetos',
  kicker: 'Node.js & React Developer',
  brand: 'Bevilacqua Labs',
  subtitle:
    'Construo APIs em NestJS e interfaces em React com TypeScript de ponta a ponta — do modelo de dados ao deploy em producao com Docker.',
  ctaPrimary: { label: 'Ver projetos', href: '#projetos' },
  ctaSecondary: { label: 'Falar comigo', href: '#contato' },
} as const;

export const PILLARS: ReadonlyArray<{
  icon: IconName;
  title: string;
  text: string;
  highlight?: boolean;
}> = [
  {
    icon: 'node',
    title: 'Back-end Node',
    text: 'APIs REST em NestJS e TypeScript, com Prisma, validacao por Zod e autenticacao JWT.',
  },
  {
    icon: 'react',
    title: 'Front-end React',
    text: 'Interfaces tipadas com React, Vite e TanStack Query — rapidas, acessiveis e responsivas.',
    highlight: true,
  },
  {
    icon: 'terminal',
    title: 'Deploy',
    text: 'Containers Docker atras de Traefik em VPS Linux, com TLS automatico e rollout reproduzivel.',
  },
];

export const HERO_STATS: ReadonlyArray<{
  value: number | string;
  suffix?: string;
  label: string;
  countUp: boolean;
}> = [
  { value: 0, label: 'Projetos', countUp: true },
  { value: 100, suffix: '%', label: 'TypeScript', countUp: true },
  { value: '∞', label: 'Possibilidades', countUp: false },
];

export const ABOUT = {
  badge: 'Disponivel para novos projetos',
  title: 'Sobre',
  subtitle: 'Quem esta por tras do Bevilacqua Labs®.',
  paragraphs: [
    'Sou o Julio, desenvolvedor full stack focado em Node.js e React. Trabalho o dia inteiro dentro de um unico ecossistema: TypeScript no servidor com NestJS e TypeScript no cliente com React — o mesmo tipo de dado atravessa a API, o schema Zod e o componente, sem tradução no meio do caminho.',
    'No back-end, monto APIs REST modulares em NestJS com Prisma sobre MySQL, validacao de toda entrada externa por Zod, autenticacao JWT com refresh token rotativo e controle de acesso por papeis em guards. No front-end, uso React com Vite, TanStack Query para estado de servidor e React Hook Form com Zod nos formularios — sempre tratando carregamento, erro e lista vazia, que e onde a maioria das interfaces quebra.',
    'Fecho o ciclo no deploy: imagens Docker multi-stage, orquestracao com Docker Compose e Traefik cuidando de TLS em VPS Linux. Versiono tudo em Git, escrevo testes com Vitest e apoio o fluxo com IA (Claude, GPT, Cursor) para ganhar velocidade sem abrir mao de revisar cada linha.',
    'Atuo como desenvolvedor full stack no DSG Grupo, atendo projetos freelance e curso Analise e Desenvolvimento de Sistemas na Universidade Senac Santo Amaro. Este laboratorio e onde coloco em pratica — e em publico — tudo o que construo.',
  ],
} as const;

export const ABOUT_STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'R$200k+', label: 'Processados em producao' },
  { value: '5', label: 'Projetos & freelances entregues' },
  { value: '15+', label: 'Tecnologias no dia a dia' },
  { value: '100%', label: 'TypeScript de ponta a ponta' },
];

export const PROCESS: ReadonlyArray<{ icon: IconName; title: string; text: string }> = [
  {
    icon: 'search',
    title: 'Entender',
    text: 'Mergulho no problema real antes de pensar em codigo: regras de negocio, usuarios e restricoes tecnicas.',
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
    text: 'Build Docker multi-stage, Docker Compose e Traefik em VPS Linux, com TLS automatico e migrations versionadas.',
  },
];

export const STACK: ReadonlyArray<{
  icon: IconName;
  title: string;
  items: readonly string[];
  accent?: boolean;
}> = [
  {
    icon: 'node',
    title: 'Back-end',
    items: ['Node.js', 'NestJS', 'TypeScript', 'Express', 'REST APIs', 'Zod', 'Swagger/OpenAPI'],
    accent: true,
  },
  {
    icon: 'react',
    title: 'Front-end',
    items: [
      'React',
      'TypeScript',
      'Vite',
      'TanStack Query',
      'React Router',
      'React Hook Form',
      'Tailwind CSS',
      'Framer Motion',
    ],
    accent: true,
  },
  {
    icon: 'database',
    title: 'Dados & ORM',
    items: ['Prisma', 'MySQL', 'PostgreSQL', 'MongoDB', 'Migrations'],
  },
  {
    icon: 'shield',
    title: 'Seguranca',
    items: ['JWT (access + refresh)', 'RBAC', 'bcrypt', 'Helmet', 'Rate limiting', 'CORS'],
  },
  {
    icon: 'terminal',
    title: 'DevOps',
    items: ['Docker', 'Docker Compose', 'Traefik', 'Nginx', 'Linux', 'VPS', 'Git', 'GitHub'],
  },
  {
    icon: 'zap',
    title: 'Qualidade & Gestao',
    items: ['Vitest', 'Testing Library', 'ESLint', 'Prettier', 'Scrum', 'Kanban', 'Jira', 'Cursor AI'],
  },
];

export const TIMELINE: ReadonlyArray<{
  period: string;
  title: string;
  text: string;
  tags: readonly string[];
}> = [
  {
    period: 'Set/2024 — Atual',
    title: 'Desenvolvedor Full Stack · DSG Grupo',
    text: 'Desenvolvo APIs REST e servicos de back-end para vendas, saldo e estornos — mais de R$ 200 mil processados em um unico evento — alem de painéis internos de gestao financeira e controle operacional.',
    tags: ['Node.js', 'TypeScript', 'REST APIs', 'MySQL', 'Docker'],
  },
  {
    period: 'Jul/2026',
    title: 'Bevilacqua Labs® — portfolio full stack (projeto proprio)',
    text: 'Este site: API em NestJS com Prisma e MySQL, autenticacao JWT com refresh token rotativo e painel admin em React com TanStack Query. Deploy em Docker Compose atras de Traefik com TLS automatico.',
    tags: ['NestJS', 'Prisma', 'React', 'Vite', 'Docker', 'Traefik'],
  },
  {
    period: 'Jun/2026',
    title: 'Sistemas de back-end (projetos pessoais)',
    text: 'Arquiteto servicos de controle financeiro, change tracking com auditoria e controle de pedidos — API tipada, migrations versionadas e publicacao em producao com Docker, Traefik e SSL automatico.',
    tags: ['Node.js', 'TypeScript', 'Prisma', 'Traefik'],
  },
  {
    period: 'Fev/2026',
    title: 'Desenvolvedor Full Stack · Freelance — Projeto G5',
    text: 'Sistema de gestao operacional, financeira e de estoque para uma empresa de blindagem de veiculos, com arquitetura em camadas, controle de custos e dashboard de indicadores em tempo real.',
    tags: ['Full Stack', 'MySQL', 'Dashboard', 'Arquitetura em camadas'],
  },
  {
    period: 'Jan/2026',
    title: 'Desenvolvedor Front-End · Freelance — Ultradesc Descartaveis',
    text: 'Landing page institucional e painel administrativo para a Ultradesc Descartaveis, empresa de produtos hospitalares. Projeto real em producao.',
    tags: ['JavaScript', 'HTML', 'CSS', 'MySQL'],
  },
  {
    period: 'Mar/2025',
    title: 'Desenvolvedor Front-End · Freelance — Motor Racing Performance & Consulting',
    text: 'Cliente americano (giaffone.com): animacoes responsivas orientadas a scroll, video gerado com IA (Google Veo) integrado via Canvas e conducao solo de todo o deploy em producao.',
    tags: ['JavaScript', 'Canvas', 'Animacoes', 'IA generativa'],
  },
];

export const TIMELINE_LINKS: Record<string, { href: string; label: string }> = {
  'Desenvolvedor Front-End · Freelance — Ultradesc Descartaveis': {
    href: 'https://ultradesc.com',
    label: 'ultradesc.com',
  },
  'Desenvolvedor Front-End · Freelance — Motor Racing Performance & Consulting': {
    href: 'https://giaffone.com',
    label: 'giaffone.com',
  },
};

export const EDUCATION = {
  period: 'Ago/2024 — Dez/2026 (em andamento)',
  title: 'Tecnologo em Analise e Desenvolvimento de Sistemas',
  institution: 'Universidade Senac Santo Amaro',
} as const;

export const CONTACT = {
  title: 'Contato',
  subtitle: 'Quer conversar sobre o seu proximo projeto?',
  paragraphs: [
    'Quer falar sobre um projeto em Node e React, uma proposta de trabalho ou so trocar uma ideia sobre TypeScript? Fico a disposicao — costumo responder rapido.',
    'Estou baseado em Sao Paulo, SP, e atendo remotamente para todo o Brasil.',
  ],
} as const;

export const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio', id: 'inicio' },
  { href: '#sobre', label: 'Sobre', id: 'sobre' },
  { href: '#stack', label: 'Stack', id: 'stack' },
  { href: '#projetos', label: 'Projetos', id: 'projetos' },
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
