# Bevilacqua Labs: sistema visual

Fonte de verdade para a interface pública, login e painel administrativo.

## 1. Direção

O produto é um portfólio de desenvolvedor para recrutadores, clientes e outros devs. A página precisa provar capacidade técnica, facilitar a leitura rápida e conduzir para projetos e contato.

- Linguagem: editorial-tech, clara e monocromática
- Tema: claro fixo
- Assinatura: build rail com progresso real de leitura
- Destaque: preto estrutural, sem neon e sem gradientes coloridos
- Redesign: visual novo com conteúdo, rotas e contratos preservados

### Dials

| Superfície | Variação | Movimento | Densidade |
| --- | ---: | ---: | ---: |
| Portfólio público | 8/10 | 7/10 | 4/10 |
| Login | 7/10 | 4/10 | 3/10 |
| Admin | 5/10 | 3/10 | 7/10 |

## 2. Cores

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-bg` / `--color-paper` | `#F4F4F1` | Canvas principal |
| `--color-bg-elevated` | `#FFFFFF` | Superfícies e formulários |
| `--color-bg-subtle` | `#E9E9E4` | Agrupamento e hover |
| `--color-bg-muted` | `#EFEFEB` | Campos internos e skeleton |
| `--color-fg` / `--color-ink` | `#10100F` | Texto e destaque estrutural |
| `--color-fg-muted` | `#5F5F59` | Corpo secundário |
| `--color-fg-subtle` | `#696962` | Metadados com contraste AA |
| `--color-line` | `#D8D8D2` | Divisores |
| `--color-line-strong` | `#B8B8B0` | Bordas interativas |
| `--color-danger` | `#B42318` | Ações destrutivas |
| `--color-success` | `#247044` | Estado real de disponibilidade |

Regras:

- Preto é o único destaque visual global.
- Vermelho e verde são reservados a estados semânticos.
- Não usar glow, neon, purple-blue gradient ou texto em gradiente.
- Superfícies podem alternar entre paper, branco e cinza frio, sem inverter o tema da página.

## 3. Tipografia

As fontes são entregues pelo bundle com Fontsource. Não há dependência de Google Fonts no carregamento da página.

| Papel | Família | Uso |
| --- | --- | --- |
| Display | Syne Variable | Marca, hero e títulos principais |
| Corpo e UI | Outfit Variable | Parágrafos, formulários e controles |
| Utilitária | JetBrains Mono Variable | Períodos, tags e metadados curtos |

Princípios:

- Títulos usam tracking negativo e poucas linhas.
- Corpo mantém medida máxima de aproximadamente 62 a 68 caracteres.
- Mono é informação, não decoração.
- Eyebrows são limitados a uma ocorrência para cada três seções.

## 4. Forma e elevação

O sistema usa três níveis coerentes:

| Elemento | Raio |
| --- | ---: |
| Campo, ícone e controle compacto | `10px` |
| Card e mídia | `16px` |
| Painel de trabalho e formulário admin | `24px` |
| Botão, status e tag | `999px` |

Sombras:

- Cards claros: sombra difusa de baixa opacidade
- Superfície em destaque: sombra preta curta, sem glow
- Listas editoriais: preferir linhas e espaço em vez de caixas

## 5. Layout

- Container máximo: `1240px`
- Gutter mobile: `20px`
- Gutter tablet/desktop: `40px`
- Gutter amplo: `48px`
- Header: até `76px`
- Hero: `min-height: 100svh`, nunca `100vh`
- Mobile abaixo de `768px`: todas as composições assimétricas viram uma coluna

### Ordem pública

1. Hero
2. Projetos
3. Sobre
4. Processo
5. Stack
6. Experiência
7. Formação
8. Contato

Projetos aparecem cedo porque são a principal prova para a audiência técnica.

## 6. Movimento

Curvas:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

Regras:

- Feedback de botão: `100-200ms`
- Menus e drawers: `180-250ms`
- Reveals de conteúdo: `450-600ms`
- Entrada usa ease-out; movimento contínuo usa ease-in-out.
- Apenas `transform` e `opacity` são animados.
- Hover com deslocamento existe somente em ponteiro fino.
- `MotionConfig reducedMotion="user"` governa o app inteiro.
- CSS também desliga deslocamentos sob `prefers-reduced-motion`.
- Scroll nunca é observado com listener nativo para animar.

Motivação:

- Hero: título revelado palavra por palavra, dentro de máscara.
- System trace: o waterfall preenche na ordem real das camadas.
- Build rail: mostra progresso e seção ativa.
- Reveals: organizam a leitura.
- Botões: confirmam a ação.

## 6.1 Elemento assinatura: system trace

O painel `SystemTrace` é o único momento de ousadia da página. Tudo em volta permanece silencioso.

- Desenha o caminho de uma requisição pelas camadas reais do projeto.
- As barras preenchem em sequência, respeitando o offset de cada etapa.
- O total conta em tempo real durante a passada.
- Repete a cada `6,3s`, e apenas enquanto o painel está em tela.
- Sob `prefers-reduced-motion`, nasce no estado final e não repete.

Regras de integridade:

- Os tempos são de referência e ilustram proporção entre camadas. Nunca apresentar como telemetria ao vivo.
- O rodapé declara "Tempos de referência".
- O `figcaption` descreve todas as etapas em texto para leitores de tela; as barras são `aria-hidden`.

Usos:

| Superfície | Rota | Papel |
| --- | --- | --- |
| Hero | `GET /api/projects` | Prova técnica logo na abertura |
| Login | `POST /api/auth/login` | Explica o que acontece ao entrar |

## 6.2 Escala de empilhamento

Todo `z-index` sai de `theme.css`. Nenhum valor solto no JSX.

| Token | Valor | Uso |
| --- | ---: | --- |
| `--z-background` | `0` | Papel e grão |
| `--z-content` | `2` | Seções |
| `--z-rail` | `40` | Build rail lateral |
| `--z-menu` | `90` | Menu mobile |
| `--z-header` | `100` | Header fixo e barra do admin |
| `--z-drawer` | `110` | Editor fullscreen do admin |
| `--z-skip` | `120` | Skip link |

## 7. Componentes

### Botões

- Primário: tinta preta, texto paper, pill
- Secundário: superfície clara com borda
- Destrutivo: vermelho apenas em exclusão
- Altura mínima: `44px`
- Press: escala `0.97`
- Nunca aninhar `<button>` dentro de `<a>` ou `<Link>`

### Campos

- Label sempre visível acima do campo
- Placeholder apenas como exemplo
- Erro abaixo do campo e ligado com `aria-describedby`
- Focus com borda preta e ring de 3px
- Altura mínima: `46px`

### Ícones

- Família única: Phosphor Icons
- Peso padrão: regular ou light
- Ícone estrutural nunca é emoji
- O modelo de projeto mantém os nomes existentes e os mapeia para Phosphor

### Cards e listas

- Card apenas quando a superfície representa uma unidade navegável ou um painel real.
- Stack usa bento assimétrico porque os grupos são unidades distintas.
- Experiência usa scroll-snap horizontal para uma lista longa.
- Admin usa lista densa, sem transformar cada linha em um card independente.

## 8. Login e admin

### Login

- Desktop: composição split-screen
- Esquerda: painel preto com malha blueprint, marca e o trace da própria autenticação
- Direita: formulário claro e objetivo
- Mobile: marca mínima, formulário no foco e o trace em versão clara abaixo
- Somente senha, de acordo com o contrato atual
- Rota marcada com `noindex,nofollow`

### Admin

- Desktop: lista e inspector sticky
- Mobile: editor fullscreen com Escape, focus trap e retorno de foco
- Estados loading, vazio, erro, edição e confirmação de exclusão são obrigatórios
- Links de projeto aceitam somente HTTPS e respostas antigas inseguras não viram links
- CRUD e autenticação continuam usando a API existente

## 9. Acessibilidade

- Um único `<main>` na página pública
- Skip link no início
- Focus visível
- Contraste WCAG AA para texto e controles
- Alvos de toque com no mínimo `44 x 44px`
- Menu e drawer restauram o foco ao fechar
- Conteúdo de fundo fica inert durante overlays
- Gráficos decorativos são `aria-hidden` e têm equivalente em texto
- Movimento reduzido preserva fades úteis e remove deslocamentos

## 10. Assets

O site não usa fotografia nem ilustração decorativa. Todo o visual é desenhado em código, com os mesmos tokens da interface.

| Arquivo | Uso |
| --- | --- |
| `/images/og-cover.png` | Compartilhamento social, 1200 x 630 |
| `/favicon.svg` | Ícone da aba |

O card social é gerado a partir das próprias fontes do bundle (Syne, Outfit, JetBrains Mono) e repete o waterfall do hero. Não há dependência de banco de imagens.

## 11. Checklist de entrega

- [ ] Tema claro consistente em todas as seções
- [ ] Nenhum neon ou cor de destaque não semântica
- [ ] Hero cabe no viewport em desktop; no mobile o system trace é o primeiro momento de scroll
- [ ] Projetos aparecem logo após o hero
- [ ] Máximo de três eyebrows na página
- [ ] Sem botões e links aninhados
- [ ] Sem em dash visível
- [ ] Nenhum `z-index` fora dos tokens
- [ ] Nenhum utilitário CSS sem uso
- [ ] Mobile validado em `375px`
- [ ] Desktop validado em `1440px`
- [ ] Reduced motion validado
- [ ] Login e CRUD testados
- [ ] Typecheck, lint, testes e build aprovados
