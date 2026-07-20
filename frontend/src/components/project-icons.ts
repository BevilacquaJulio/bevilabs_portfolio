import type { IconName } from './Icon';

/** Icones oferecidos ao admin ao cadastrar um projeto. */
export const PROJECT_ICONS = [
  'folder',
  'rocket',
  'zap',
  'layers',
  'code',
  'globe',
  'link',
  'box',
  'terminal',
  'chart',
] as const satisfies readonly IconName[];

export type ProjectIconName = (typeof PROJECT_ICONS)[number];

export const PROJECT_ICON_LABELS: Record<ProjectIconName, string> = {
  folder: 'Pasta',
  rocket: 'Foguete',
  zap: 'Raio',
  layers: 'Camadas',
  code: 'Codigo',
  globe: 'Globo',
  link: 'Link',
  box: 'Caixa',
  terminal: 'Terminal',
  chart: 'Grafico',
};

/** Protege contra um icone desconhecido vindo do banco. */
export function normalizeProjectIcon(value: string | undefined): ProjectIconName {
  return PROJECT_ICONS.includes(value as ProjectIconName) ? (value as ProjectIconName) : 'folder';
}
