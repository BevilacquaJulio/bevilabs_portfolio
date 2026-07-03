import { authHeaders } from "./auth.js";

let projectsCache = null;
let projectsPromise = null;

function dispatchProjectsUpdated(projects) {
  window.dispatchEvent(
    new CustomEvent("projects:updated", {
      detail: { count: projects.length, projects },
    })
  );
}

export function invalidateProjectsCache() {
  projectsCache = null;
  projectsPromise = null;
}

export async function fetchProjects() {
  if (projectsCache) {
    return projectsCache;
  }

  if (!projectsPromise) {
    projectsPromise = fetch("/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Não foi possível carregar os projetos.");
        }
        return response.json();
      })
      .then((projects) => {
        projectsCache = projects;
        dispatchProjectsUpdated(projects);
        return projects;
      })
      .catch((error) => {
        projectsPromise = null;
        throw error;
      });
  }

  return projectsPromise;
}

export async function createProject(data) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Não foi possível criar o projeto.");
  }

  invalidateProjectsCache();
  return response.json();
}

export async function updateProject(id, data) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Não foi possível atualizar o projeto.");
  }

  invalidateProjectsCache();
  return response.json();
}

export async function deleteProject(id) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Não foi possível excluir o projeto.");
  }

  invalidateProjectsCache();
}
