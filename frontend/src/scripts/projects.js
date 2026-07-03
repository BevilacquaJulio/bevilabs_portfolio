import { fetchProjects } from "./storage.js";
import { renderIcon } from "./icons.js";

const grid = document.getElementById("projects-grid");
const empty = document.getElementById("projects-empty");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderProjectCard(project) {
  const article = document.createElement("article");
  article.className = "project-card";

  const link = document.createElement("a");
  link.className = "project-card__link";
  link.href = project.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Abrir projeto ${project.title}`);

  link.innerHTML = `
    <div class="project-card__icon">${renderIcon(project.icon)}</div>
    <h3 class="project-card__title">${escapeHtml(project.title)}</h3>
    <p class="project-card__text">${escapeHtml(project.description)}</p>
    <span class="project-card__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </span>
  `;

  article.appendChild(link);
  return article;
}

async function renderProjects() {
  if (!grid || !empty) return;

  try {
    const projects = await fetchProjects();
    grid.innerHTML = "";

    if (projects.length === 0) {
      empty.hidden = false;
      grid.hidden = true;
      return;
    }

    empty.hidden = true;
    grid.hidden = false;

    projects.forEach((project) => {
      grid.appendChild(renderProjectCard(project));
    });
  } catch {
    empty.hidden = false;
    grid.hidden = true;
  }
}

renderProjects();
