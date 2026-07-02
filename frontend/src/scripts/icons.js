const ICONS = {
  folder:
    '<path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" />',
  rocket:
    '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />',
  layers:
    '<path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />',
  code:
    '<path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /><path d="M14 4l-4 16" />',
  globe:
    '<circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />',
  link:
    '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />',
  box:
    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />',
  terminal:
    '<path d="m4 17 6-6-6-6" /><path d="M12 19h8" /><rect x="2" y="3" width="20" height="18" rx="2" />',
  chart:
    '<path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />',
};

const ICON_LABELS = {
  folder: "Pasta",
  rocket: "Foguete",
  zap: "Raio",
  layers: "Camadas",
  code: "Código",
  globe: "Globo",
  link: "Link",
  box: "Caixa",
  terminal: "Terminal",
  chart: "Gráfico",
};

const DEFAULT_ICON = "folder";

export function normalizeIconId(value) {
  if (value && ICONS[value]) return value;
  return DEFAULT_ICON;
}

export function getIconOptions() {
  return Object.keys(ICONS).map((id) => ({ id, label: ICON_LABELS[id] }));
}

export function renderIcon(iconId, className = "") {
  const id = normalizeIconId(iconId);
  const paths = ICONS[id];
  const extraClass = className ? ` ${className}` : "";

  return `<svg class="icon${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${paths}</svg>`;
}
