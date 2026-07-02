import { normalizeIconId } from "./icons.js";

const STORAGE_KEY = "bevilabs_projects";

export function getProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* fallback abaixo */
  }
  return [];
}

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createProject({ title, icon, description, link }) {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    icon: normalizeIconId(icon.trim()),
    description: description.trim(),
    link: link.trim(),
    createdAt: new Date().toISOString(),
  };
}
