# Bevilacqua Labs® — Portfólio

Portfólio pessoal do Julio Bevilacqua, construído como um sistema real de ponta a ponta:
API em **NestJS** + **Prisma 7** + **MySQL**, interface em **React** + **Vite** + **TypeScript**,
publicado em containers **Docker** atrás do **Traefik**.

> Migração concluída em Jul/2026: o projeto era FastAPI (Python) + HTML/CSS/JS vanilla.
> A versão anterior está preservada em `_legacy_python/` (não faz parte do build).

---

## Arquitetura

```
Traefik (rede externa: traefik)
│
├── bevilabs_web   React/Vite estático via nginx   ->  ${DOMAIN}
├── bevilabs_api   NestJS                          ->  api.${DOMAIN}
│
└── mysql_shared (rede externa: mysql_shared)
    └── banco "bevilabs"
```

| Camada | Stack |
|---|---|
| Front-end | React 18, TypeScript strict, Vite 6, Tailwind CSS 4, TanStack Query, React Router, React Hook Form + Zod, Framer Motion |
| Back-end | Node 20, NestJS 11, TypeScript strict, Prisma 7 (adapter mariadb), Zod via `nestjs-zod`, JWT access + refresh, pino |
| Banco | MySQL 8 (instância compartilhada `mysql_shared`) |
| Deploy | Docker multi-stage, Docker Compose, Traefik (TLS automático), nginx |
| Testes | Vitest + Supertest (API) · Vitest + Testing Library (UI) |

---

## Estrutura

```
bevilabs_portfolio/
├── backend/                  API NestJS
│   ├── prisma/
│   │   ├── schema.prisma     Modelos AdminUser, Project, RefreshToken
│   │   ├── migrations/       Versionadas pelo Prisma Migrate
│   │   └── seed.ts           Cria o usuário admin (idempotente)
│   ├── src/
│   │   ├── config/           Validação de env (Zod) + URL do banco
│   │   ├── prisma/           PrismaService (@Global) com adapter mariadb
│   │   ├── common/           Filtro de exceções, guards, decorators, paginação
│   │   └── modules/          auth · projects · health
│   ├── prisma.config.ts      Datasource URL (Prisma 7)
│   └── Dockerfile
│
├── frontend/                 SPA React
│   ├── src/
│   │   ├── app/              App, rotas lazy, ErrorBoundary, Background
│   │   ├── components/       Button, Icon, Reveal, Badge, SectionHeading...
│   │   ├── features/
│   │   │   ├── site/         Seções do portfólio + content.ts (texto)
│   │   │   ├── projects/     API, hooks React Query, cards
│   │   │   └── admin/        Login e CRUD de projetos
│   │   ├── hooks/            useNeonGrid, useCountUp, useActiveSection...
│   │   ├── lib/              api (axios), auth-store, motion, cn
│   │   └── styles/           theme.css (design tokens) + globals.css
│   ├── nginx.conf            SPA fallback + cache de assets
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── _legacy_python/           Versão FastAPI anterior (arquivada)
```

---

## Rodando localmente

Pré-requisitos: Node 20+, MySQL acessível.

```bash
# 1. Variáveis
cp .env.example .env      # edite MYSQL_*, JWT_* e CORS_ORIGIN

# 2. Backend
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy       # banco novo
npm run build && npm run db:seed  # compila o seed e cria o usuário admin
npm run start:dev               # http://localhost:3000/api
                                # Swagger em /api/docs (fora de produção)

# 3. Frontend (outro terminal)
cd frontend
npm ci
npm run dev                     # http://localhost:5173
```

Em dev o Vite faz proxy de `/api` para `localhost:3000` — não há CORS a resolver.

---

## Deploy

Assume que Traefik, a rede `mysql_shared` e o container MySQL já existem no host.

```bash
cp .env.example .env
# Edite: DOMAIN, MYSQL_*, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN, ADMIN_PASSWORD

# 1. Criar banco e usuário no MySQL compartilhado (uma única vez, manualmente)
#    A aplicação nunca cria o database.

# 2. Build e subida
docker compose build
docker compose up -d

# 3. Migrations — manualmente, nunca no build da imagem
docker compose exec api npx prisma migrate deploy

#    Cliente Prisma: gerado no build da imagem em dist/generated/ (API) e generated/ (CLI).
#    Conferir: docker compose exec api ls dist/generated/prisma/client.js

#    Se o banco JÁ tem as tabelas admin_users e projects (deploy antigo),
#    marque a baseline como aplicada em vez de rodá-la:
#    docker compose exec api npx prisma migrate resolve --applied 00000000000000_init
#    docker compose exec api npx prisma migrate deploy

# 4. Usuário admin (primeira vez)
docker compose exec api npm run db:seed

#    Se a senha do .env nao bater com o login (deploy antigo ou .env alterado):
#    docker compose exec api npm run db:reset-admin

# 5. Verificação
docker logs bevilabs_api
curl https://api.${DOMAIN}/api/health         # {"status":"ok"}
curl https://api.${DOMAIN}/api/health/ready   # {"status":"ok","database":"up"}
```

### Gerando os segredos JWT

```bash
openssl rand -base64 48   # rode duas vezes: um para ACCESS, outro para REFRESH
```

---

## Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | — | Autentica e devolve access + refresh token |
| POST | `/api/auth/refresh` | — | Rotaciona o refresh token |
| POST | `/api/auth/logout` | — | Revoga o refresh token |
| GET | `/api/auth/me` | Bearer | Admin autenticado |
| GET | `/api/projects` | — | Lista paginada (`?page`, `?limit`) |
| GET | `/api/projects/:id` | — | Detalhe |
| POST | `/api/projects` | Bearer | Cria |
| PUT | `/api/projects/:id` | Bearer | Atualiza |
| DELETE | `/api/projects/:id` | Bearer | Remove |
| GET | `/api/health` | — | Liveness |
| GET | `/api/health/ready` | — | Readiness (`SELECT 1`) |

Erros seguem um envelope único:

```json
{ "error": { "code": "UNAUTHORIZED", "message": "Senha incorreta." } }
```

---

## Decisões técnicas

**Access token só em memória.** O access token vive numa variável do módulo, não em
`localStorage`. Um XSS não consegue lê-lo de um storage persistente. O refresh token
fica em `sessionStorage` (some ao fechar a aba) e é rotacionado a cada uso — o hash do
token anterior é revogado no banco. Reuso de um token já rotacionado revoga todas as
sessões do usuário, que é o comportamento esperado quando há indício de roubo.

**Prisma 7 exige driver adapter.** `new PrismaClient()` sem adapter lança no boot.
`PrismaService` usa `@prisma/adapter-mariadb`, o client é gerado em `generated/prisma`
(nunca importado de `@prisma/client`) e a URL do datasource vive em `prisma.config.ts`,
não no `schema.prisma`. Usuário e senha são percent-encoded para não corromper a URL.

**Zod compartilhado entre camadas.** O `projectInputSchema` do backend e o do frontend
validam as mesmas regras, então o formulário rejeita localmente o que a API rejeitaria.

**Migrations nunca rodam no build.** O banco não está acessível durante `docker build`.
`prisma migrate deploy` é executado manualmente após os containers subirem.

**Canvas de fundo reescrito.** A versão vanilla percorria todo o DOM com `TreeWalker`
a cada mutação, via `MutationObserver`, para amortecer os pontos sob texto. Custava caro
e rodava constantemente. A versão React é puramente geométrica, respeita
`devicePixelRatio`, congela o loop quando a aba está oculta e desenha um frame estático
em mobile e sob `prefers-reduced-motion`.

**Animações com Framer Motion, sempre com escape.** Todo movimento passa por
`prefers-reduced-motion`; o efeito magnético e a grade reativa também exigem ponteiro
fino (`hover: hover and pointer: fine`), então não desperdiçam CPU em touch.

---

## Testes

```bash
cd backend  && npm test      # services: auth (login, senha errada, sem usuário), projects
cd frontend && npm test      # ProjectsSection: loading/erro/vazio/sucesso
                             # ProjectForm: validação Zod, URL inválida, submit
```

---

## PENDENTE DE VALIDAÇÃO — leia antes de publicar

O conteúdo da seção **Sobre** e da **Trajetória** foi reescrito para posicionar o
portfólio como **Node.js + React developer**, conforme solicitado. Alguns itens
descrevem experiências que, na versão anterior do site, apareciam com outras
tecnologias. **Confirme cada ponto antes de publicar** — recrutadores técnicos
verificam isso em entrevista e em checagem de referência.

Editar em: `frontend/src/features/site/data/content.ts`

| Onde | Estava antes | Está agora | Ação |
|---|---|---|---|
| Trajetória → DSG Grupo | "APIs REST em **PHP**" e "aplicações **Python**" | "APIs REST e serviços de back-end" · tags Node.js, TypeScript | Confirme se você usa Node/TS no DSG. Se não, reverta as tags. |
| Trajetória → Projetos pessoais | "FastAPI e SQLAlchemy" | "Node.js, TypeScript, Prisma" | Confirme se esses sistemas foram (ou serão) migrados. |
| Trajetória → Projeto G5 | "PHP, MySQL, MVC" | "Full Stack, MySQL, arquitetura em camadas" | Removi a menção a PHP sem afirmar Node. Aceitável, mas confirme. |
| Trajetória → Ultradesc | "PHP, MySQL, HTML, CSS, JS" | "JavaScript, HTML, CSS, MySQL" | Só removi PHP. |
| Stack | Python, PHP, FastAPI, SQLAlchemy, Pydantic | Node, NestJS, React, Prisma, Vite... | Python e PHP saíram por completo. Se ainda quer sinalizá-los, adicione um grupo "Também trabalho com". |
| About stats | "4 projetos entregues" | "5 projetos entregues" | Contei este portfólio. Ajuste se discordar. |
| About stats | "15+ tecnologias dominadas" | "15+ tecnologias no dia a dia" | Confirme o número. |
| Hero stat | "100% Dedicação" | "100% TypeScript" | Verdadeiro para este repositório. |

Recomendação: a alternativa mais defensável é manter os **fatos** da Trajetória e
liderar com Node/React na headline, na Stack e no Sobre. Um recrutador que confere
o LinkedIn e encontra "PHP" onde o site diz "Node" desconfia do resto do portfólio.

---

## Licença

Projeto pessoal. Todos os direitos reservados a Julio Bevilacqua.
