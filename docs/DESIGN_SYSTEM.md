# Bevilacqua Labs: sistema visual

Fonte de verdade da interface pública, do login e do painel administrativo.
Os valores abaixo espelham `frontend/src/styles/theme.css`. Quando um dos dois mudar, o outro muda junto.

## 1. Direção

Portfólio de desenvolvedor full stack. A audiência principal é o recrutador técnico; a secundária, o cliente de freelance. As duas escaneiam antes de ler, então o site aposta em pouco texto, hierarquia forte e prova numérica.

- Linguagem: engenharia em papel branco frio com tinta azul-marinho
- Tema: claro, travado. Dois blocos navy quebram o ritmo (Stack e Contato)
- Assinatura: o lettering `BEVILACQUA` com `LABS` esticado embaixo, e o monograma que se desenha
- Destaque: um único azul. Nada de neon, nada de gradiente colorido

### Dials

| Superfície | Variação | Movimento | Densidade |
| --- | ---: | ---: | ---: |
| Portfólio público | 7/10 | 7/10 | 3/10 |
| Login | 6/10 | 4/10 | 3/10 |
| Admin | 4/10 | 3/10 | 7/10 |

## 2. Cores

Todo par de texto e fundo foi medido. Nenhum fica abaixo de 4.5:1.

| Token | Valor | Uso | Contraste |
| --- | --- | --- | --- |
| `--color-paper` / `--color-bg` | `#F7F9FC` | Canvas | base |
| `--color-bg-elevated` | `#FFFFFF` | Cards, formulários | base |
| `--color-bg-subtle` | `#EDF1F8` | Agrupamento, hover de linha | base |
| `--color-bg-muted` | `#E5EBF5` | Campos internos | base |
| `--color-ink` / `--color-fg` | `#071A31` | Texto, blocos escuros | 16.6:1 no papel |
| `--color-ink-2` | `#0C2749` | Segunda superfície navy | |
| `--color-ink-3` | `#16406F` | Terceira superfície navy | |
| `--color-fg-muted` | `#40597A` | Corpo secundário | 6.8:1 |
| `--color-fg-subtle` | `#546C8B` | Metadados | 5.1:1 |
| `--color-accent` | `#2765CC` | Único acento: links, estado ativo, CTA | 5.2:1 |
| `--color-accent-deep` | `#1B4FA6` | Hover do acento | 7.3:1 |
| `--color-accent-soft` | `#6FA3EE` | Acento sobre navy | 6.8:1 no ink |
| `--color-on-dark` | `#EAF0F8` | Texto sobre navy | 15.3:1 |
| `--color-on-dark-muted` | `#93AAC7` | Secundário sobre navy | 7.3:1 |
| `--color-line` | `#DDE5F0` | Divisores | |
| `--color-line-strong` | `#C0CDDE` | Bordas interativas | |
| `--color-danger` | `#B4231A` | Ação destrutiva | |
| `--color-success` | `#1E7A4C` | Estado real de disponibilidade | |

Regras:

- Azul é o único destaque. Nenhuma outra cor entra por motivo estético.
- Vermelho e verde só carregam estado semântico.
- Sem glow, sem neon, sem texto em gradiente.
- A página é clara. Os blocos navy são composição, não inversão de tema.

## 3. Tipografia

Entregues pelo bundle, via Fontsource. Nenhuma requisição ao Google Fonts.

| Papel | Família | Uso |
| --- | --- | --- |
| Display | Space Grotesk Variable | Marca, títulos, números de métrica |
| Corpo | Manrope Variable | Parágrafos, formulários, controles |
| Utilitária | JetBrains Mono Variable | Período, domínio, índice, rótulo curto |

Princípios:

- Título usa tracking negativo forte (`-0.035em` a `-0.055em`) e no máximo duas linhas.
- Corpo fica entre 46 e 62 caracteres de medida.
- Mono é dado, nunca decoração. O utilitário `meta` existe para isso.
- Zero sobrancelhas acima de título de seção. A posição na página já classifica a seção.

## 4. Forma

| Elemento | Raio |
| --- | ---: |
| Campo, ícone, chip | `8px` (`--radius-sm`) |
| Card, painel, linha destacada | `14px` (`--radius-md`) |
| Painel grande | `22px` (`--radius-lg`) |
| Botão, pill, status | `999px` |

Sombras: `--shadow-panel` para card claro, `--shadow-float` para elemento que flutua sobre a página, `--shadow-accent` para CTA em hover. Nenhuma sombra preta pura.

## 4.1 Partitura de superfícies

Cada seção tem a própria cor, e o fim de uma é o começo da outra. A página escurece de cima para baixo, e os dois blocos navy também são diferentes entre si. Nenhuma seção repete a cor da vizinha.

| Seção | Token | Valor |
| --- | --- | --- |
| Hero | `--surface-hero-a` a `--surface-hero-b` | `#FCFDFF` a `#E9F0FB` |
| Projetos | `--surface-projects` | `#E9F0FB` a `#FFFFFF` a `#EEF3FC` |
| Stack | `--surface-stack` | `#0D2A4D` |
| Trajetória | `--surface-journey-a/b` | `#F1F5FD` a `#FAFCFF` |
| Sobre | `--surface-about-a/b` | `#FAFCFF` a `#E8EFF9` |
| Contato e rodapé | `--surface-contact` | `#061527` |

As duas emendas para navy levam um fio de luz de 1px em `--color-accent-soft`, com degradê para transparente nas pontas. As emendas entre superfícies claras não precisam de linha: a cor já entrega uma na outra.

Contraste medido em todas: nenhum texto abaixo de 4.5:1.

## 5. Layout

- Container: `1280px`
- Gutter: `20px` no celular, `36px` no tablet, `48px` acima de `1280px`
- Header: `80px` no topo da página, `60px` depois do scroll
- Hero: `min-h-svh`, nunca `100vh`
- Abaixo de `768px` toda composição assimétrica vira uma coluna

### Ordem pública

1. Hero
2. Projetos
3. Stack
4. Trajetória
5. Sobre
6. Contato

Seis seções, seis famílias de layout diferentes. Nenhuma seção repete o assunto da outra: a hero não cita tecnologia, o Sobre não cita tecnologia, e a Stack é o único inventário do site.

## 6. Movimento

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

Regras:

- Feedback de botão: `100-200ms`. Menu e drawer: `180-260ms`. Reveal: `450-700ms`.
- Só `transform` e `opacity` são animados.
- `MotionConfig reducedMotion="user"` governa o app inteiro, e o CSS remove deslocamentos sob `prefers-reduced-motion`.
- Nenhum `addEventListener('scroll')`. Tudo passa por `useScroll` ou `IntersectionObserver`.
- Reveal anima `y`, nunca a string `transform`: um `transform` inline vence o `hover:` do Tailwind e mata o gesto em silêncio. `src/lib/motion.test.ts` prende isso.

Inventário, com o motivo de cada uma:

| Onde | O que faz | Por quê |
| --- | --- | --- |
| Cortina de abertura | Monograma se desenha, letreiro completa, barra enche | Estado de carregamento |
| Hero | Letra a letra sob máscara, e parallax do monograma | Ordem de leitura, e a marca é o visual |
| Header | Encolhe e ganha fundo passando de `48px` | Posição na página |
| Trilho lateral | Preenche conforme o scroll | Orientação |
| Fundo | Duas manchas derivam em `34s` e `46s` | Única animação atmosférica |
| Linha de projeto | Fundo acende, seta preenche, ficha segue o cursor | Feedback e prova |
| Stack | Trilho entre as estações se desenha | Conta o fluxo ponta a ponta |
| Trajetória | Linha preenche com o scroll, marcador acende | Progresso da carreira |
| Métricas | Número conta de zero até o valor | Puxa o olho para a prova |

### Cortina de abertura

Dois segundos, contados por `setTimeout` em `PRELOADER_MS`. Roda uma vez por aba (`sessionStorage`) e não roda sob movimento reduzido. Enquanto ela está na tela, a hero segura a própria entrada via `BootContext`.

### Escala de empilhamento

Todo `z-index` sai de `theme.css`.

| Token | Valor |
| --- | ---: |
| `--z-background` | `0` |
| `--z-content` | `2` |
| `--z-rail` | `40` |
| `--z-menu` | `90` |
| `--z-header` | `100` |
| `--z-drawer` | `110` |
| `--z-skip` | `120` |
| `--z-preloader` | `200` |

## 7. Componentes

### Botões

Todo alvo acionável de destaque passa por `ActionButton`, do CTA da hero ao cadeado do header. Um componente só, para o conjunto reagir como um sistema e não como cinco.

| Variante | Uso |
| --- | --- |
| `primary` | Ação principal. Azul cheio, texto branco, sombra de acento. |
| `outline` | Ação secundária sobre superfície clara. Borda e texto em azul. |
| `ghost-dark` | Ação sobre navy. |
| `icon` | Redondo, sem rótulo. Exige `aria-label`. |

- Todos carregam a mesma mola magnética (`useMagnetic`), o mesmo `scale(0.96)` no clique e o mesmo deslocamento do ícone no hover.
- Altura mínima `44px` nos tamanhos `md` e `lg`.
- Nunca aninhar `<button>` dentro de `<a>`.

### Header

Uma peça só, em três grupos: marca, menu e ações. No topo da página os três ficam afastados e o menu tem a própria pastilha branca. Passando de `48px` de scroll, a distância entre eles fecha, a pastilha do menu some e os três viram um bloco único, menor e flutuante. Voltando à hero, o movimento se desfaz.

O que anima é `gap`, `padding`, cor e sombra: tudo interpolável em CSS, sem morfose de layout. O mesmo comportamento vale no celular, onde a pastilha mostra só os ícones e abre o rótulo do item ativo.

- Indicador do item ativo e realce de hover usam `layoutId`, então correm de um item ao outro com mola em vez de piscar.
- O rótulo ativo trunca em telas estreitas: o menu nunca empurra nada para fora da tela.

### Título de seção

`SectionHeading` dimensiona o título pelo próprio comprimento, via container query. Uma linha a partir de `1024px`, duas linhas abaixo disso, sempre ocupando a largura disponível. Nada de `text-balance`: ele existe para forçar quebra equilibrada, e a regra aqui é o contrário.

### Campos

- Label sempre visível acima. Placeholder só como exemplo.
- Erro abaixo, ligado por `aria-describedby`. Foco com borda acento e ring de 3px.
- Altura mínima `46px`, `font-size: 1rem` para o Safari não dar zoom.

### Ícones

Família única: Phosphor, via `@/components/Icon`. Peso `regular` ou `bold`. Nenhum SVG desenhado à mão, com uma exceção: o monograma, que é a marca.

### Listas

- Projeto é linha, não card: a lista continua legível com 4 ou com 40, e não sobra órfão no fim da grade.
- Stack usa quatro estações ligadas por trilho.
- Admin usa lista densa.

## 8. Login e admin

- Login: só senha, rota marcada `noindex,nofollow`.
- Admin: lista mais inspector no desktop, editor em tela cheia no celular com Escape, focus trap e retorno de foco.
- Estados de loading, vazio, erro, edição e confirmação de exclusão são obrigatórios.
- Link de projeto só aceita `https`.

## 9. Acessibilidade

- Um único `<main>` na página pública, com skip link.
- Contraste AA em todo texto e controle. Alvo de toque de `44 x 44px`.
- Menu e drawer devolvem o foco. Conteúdo de fundo fica `inert` durante overlay.
- Gráfico decorativo é `aria-hidden` e tem equivalente em texto. Número animado tem `sr-only` com o valor final.

## 10. Assets

Sem fotografia e sem ilustração de banco. Todo o visual nasce em código, com os mesmos tokens da interface.

| Arquivo | Uso |
| --- | --- |
| `/favicon.svg` | Monograma BL em navy |
| `/images/meta/og-cover.png` | Cartão social, 1200 x 630, gerado com as fontes do bundle |

## 11. Checklist de entrega

- [ ] Tema claro consistente; blocos navy apenas em Stack e Contato
- [ ] Um único acento, o mesmo em todas as seções
- [ ] Uma única escala de raio
- [ ] Zero sobrancelha acima de título de seção
- [ ] Seis seções, seis famílias de layout, sem assunto repetido entre elas
- [ ] Hero cabe no viewport em desktop e em `375px`
- [ ] Nenhum em dash visível
- [ ] Nenhum `z-index` fora dos tokens
- [ ] Nenhum listener de scroll nativo
- [ ] Contraste AA verificado em texto e controle
- [ ] Validado em `375px`, `768px`, `1280px` e `1440px`
- [ ] Movimento reduzido validado, incluindo a cortina de abertura
- [ ] Login e CRUD testados
- [ ] `typecheck`, `lint`, `test` e `build` aprovados
