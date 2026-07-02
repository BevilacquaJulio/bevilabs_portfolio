# Bevilacqua Labs — Design System

> Fonte de verdade visual do projeto. Consulte este documento antes de criar qualquer tela, componente ou página nova.

---

## 1. Identidade

| Item | Valor |
|------|-------|
| Marca | Bevilacqua Labs® |
| Tom | Tecnológico, minimalista, premium |
| Modo | Escuro (dark-first) |
| Estética | Monocromático com destaques em neon preto |

---

## 2. Cores

### Superfícies

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#0a0a0a` | Fundo principal |
| `--color-bg-elevated` | `#141414` | Cards, inputs, painéis |
| `--color-bg-subtle` | `#1a1a1a` | Hover, badges, ícones |
| `--color-bg-muted` | `#111111` | Áreas secundárias |

### Texto

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-text` | `#f8f8f8` | Texto principal |
| `--color-text-muted` | `#a3a3a3` | Subtítulos, labels |
| `--color-text-subtle` | `#525252` | Placeholders, hints |

### Acentos (neon preto)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-accent` | `#0a0a0a` | Botões primários, destaques |
| `--color-accent-text` | `#ffffff` | Texto sobre accent |
| `--color-border` | `rgba(255,255,255,0.08)` | Bordas padrão |
| `--color-border-strong` | `rgba(255,255,255,0.15)` | Bordas em hover/focus |

### Efeitos glow (neon preto)

```css
--neon-glow: 0 0 20px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.3);
--neon-glow-strong: 0 0 10px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5), 0 0 60px rgba(0,0,0,0.2);
--neon-border: 0 0 0 1px rgba(255,255,255,0.08), 0 0 15px rgba(0,0,0,0.4);
--neon-ring: 0 0 0 2px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5);
```

---

## 3. Tipografia

| Token | Fonte | Uso |
|-------|-------|-----|
| `--font-display` | Syne | Títulos, logo, números |
| `--font-body` | Outfit | Corpo, UI, formulários |

### Escala

| Classe / Uso | Tamanho | Peso |
|--------------|---------|------|
| Hero brand | `clamp(2.5rem, 7vw, 4.5rem)` | 800 |
| H1 seção | `clamp(1.75rem, 4vw, 2.5rem)` | 700 |
| H2 / card title | `1.1rem` | 700 |
| Body | `0.875rem – 1rem` | 300–400 |
| Label / badge | `0.75rem – 0.8rem` | 500 |
| Uppercase label | `0.75rem` | 500, `letter-spacing: 0.08em` |

### Marca registrada

```html
<sup class="reg">®</sup>
```

- `.reg`: `font-size: 0.55em`, `opacity: 0.7`
- `.reg--large`: `font-size: 0.35em` (títulos grandes)

---

## 4. Espaçamento

| Token | Valor |
|-------|-------|
| `--space-xs` | `0.25rem` |
| `--space-sm` | `0.5rem` |
| `--space-md` | `1rem` |
| `--space-lg` | `1.5rem` |
| `--space-xl` | `2rem` |
| `--space-2xl` | `2.5rem` |
| `--space-3xl` | `4rem` |
| `--space-section` | `5rem` |

Padding de página: `2rem` (mobile), `2.5rem` (desktop).

---

## 5. Raios de borda

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | `8px` | Ícones, inputs |
| `--radius-md` | `16px` | Cards |
| `--radius-lg` | `24px` | Painéis, stats |
| `--radius-full` | `9999px` | Botões, badges |

---

## 6. Transições

| Token | Valor | Uso |
|-------|-------|-----|
| `--transition-fast` | `0.2s cubic-bezier(0.4,0,0.2,1)` | Hover simples |
| `--transition-smooth` | `0.4s cubic-bezier(0.4,0,0.2,1)` | Cards, nav |
| `--transition-spring` | `0.6s cubic-bezier(0.34,1.56,0.64,1)` | Entradas animadas |

---

## 7. Componentes

### Botão primário (`.btn--primary`)

- Fundo: `--color-accent` (preto)
- Texto: branco
- Sombra: `--neon-glow-strong`
- Hover: `translateY(-2px)`, glow intensificado
- Border-radius: `--radius-full`
- Padding: `0.85rem 2rem`

### Botão ghost (`.btn--ghost`)

- Fundo: transparente
- Borda: `1.5px solid rgba(255,255,255,0.12)`
- Hover: borda clara + `--color-bg-subtle`

### Botão perigo (`.btn--danger`)

- Borda vermelha sutil, texto `#f87171`
- Usado apenas em admin (excluir)

### Card (`.feature-card` / `.project-card`)

- Fundo: `--color-bg-elevated`
- Borda: `--color-border`
- Sombra: `--neon-border`
- Hover: `translateY(-4px)`, `--neon-glow-strong`
- Padding: `2rem 1.5rem`
- Border-radius: `--radius-md`

### Card destacado (`.feature-card--highlight`)

- Fundo: preto puro `#000000`
- Texto: branco
- Sombra: `--neon-glow-strong`

### Badge (`.hero__badge`)

- Fundo: `--color-bg-subtle`
- Borda sutil + `--neon-border`
- Dot pulsante preto com glow

### Input / Textarea / Select (`.field__input`)

- Fundo: `--color-bg-subtle`
- Borda: `--color-border`
- Focus: `--neon-ring` + `--color-border-strong`
- Border-radius: `--radius-sm`
- Padding: `0.75rem 1rem`
- Fonte: `--font-body`

### Header fixo

- `backdrop-filter: blur(20px)`
- Fundo: `rgba(10,10,10,0.75)`
- Borda inferior: `rgba(255,255,255,0.05)`
- z-index: `100`

---

## 8. Layout

### Grid de features/projetos

```css
display: grid;
grid-template-columns: repeat(3, 1fr); /* desktop */
gap: 1.5rem;
max-width: 900px;
```

Mobile (`max-width: 768px`): `grid-template-columns: 1fr`.

### Seções

- `min-height: 100vh` para hero
- `padding-top: 8rem` (compensa header fixo)
- z-index conteúdo: `2` (acima do canvas e noise)

### Canvas de fundo

- `#grid-canvas`: fixed, full viewport, z-index `0`
- Pontos: branco com baixa opacidade, reagem ao mouse
- `.noise`: overlay SVG, opacity `0.03`

---

## 9. Animações

| Nome | Uso |
|------|-----|
| `fadeUp` | Entrada de hero e grids |
| `float` | Glows decorativos |
| `pulse` | Badge dot "online" |

Contadores: easing cúbico `1 - (1-t)³`, duração `1500ms`.

---

## 10. Acessibilidade

- `lang="pt-BR"` em todas as páginas
- Elementos decorativos: `aria-hidden="true"`
- Links externos: `target="_blank"` + `rel="noopener noreferrer"`
- Contraste mínimo WCAA AA entre texto e fundo
- Focus visível em inputs e botões (`outline` ou `--neon-ring`)

---

## 11. Nomenclatura BEM

```
.block__element--modifier
```

Exemplos: `.hero__title`, `.project-card__icon`, `.nav-link--active`, `.field__label`.

---

## 12. Páginas do sistema

| Página | Arquivo | Propósito |
|--------|---------|-----------|
| Landing | `index.html` | Apresentação + listagem pública de projetos |
| Admin | `admin.html` | CRUD de projetos (título, ícone, descrição, link) |

### Modelo de projeto

```json
{
  "id": "uuid",
  "title": "string",
  "icon": "string (id: folder | rocket | zap | layers | code | globe | link | box | terminal | chart)",
  "description": "string",
  "link": "url",
  "createdAt": "ISO date"
}
```

Persistência: `localStorage` chave `bevilabs_projects`.

---

## 13. Checklist para novos componentes

- [ ] Usa tokens de `variables.css` (nunca cores hardcoded)
- [ ] Segue BEM consistente com o restante
- [ ] Tem estado hover/focus
- [ ] Responsivo no breakpoint `768px`
- [ ] Fonte display para títulos, body para texto
- [ ] Sombra neon preto nos destaques
- [ ] z-index respeita camadas (canvas → noise → conteúdo → header)
