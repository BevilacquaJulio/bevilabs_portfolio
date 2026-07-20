/** Icones permitidos — o mesmo conjunto renderizado pelo frontend. */
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
] as const;

export type ProjectIcon = (typeof PROJECT_ICONS)[number];

export const DEFAULT_ICON: ProjectIcon = 'folder';

export function normalizeIcon(value: string): ProjectIcon {
  const normalized = value.trim().toLowerCase() as ProjectIcon;
  return PROJECT_ICONS.includes(normalized) ? normalized : DEFAULT_ICON;
}
