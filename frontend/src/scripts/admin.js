import { getProjects, saveProjects, createProject } from "./storage.js";
import { getIconOptions, renderIcon, normalizeIconId } from "./icons.js";

const form = document.getElementById("project-form");
const list = document.getElementById("projects-list");
const emptyList = document.getElementById("projects-list-empty");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const toast = document.getElementById("toast");
const iconPicker = document.getElementById("icon-picker");
const iconInput = document.getElementById("icon");

let editingId = null;

function selectIcon(iconId) {
  const normalized = normalizeIconId(iconId);
  if (iconInput) iconInput.value = normalized;

  iconPicker?.querySelectorAll(".icon-picker__btn").forEach((btn) => {
    const selected = btn.dataset.icon === normalized;
    btn.classList.toggle("icon-picker__btn--selected", selected);
    btn.setAttribute("aria-checked", selected ? "true" : "false");
  });
}

function initIconPicker() {
  if (!iconPicker || !iconInput) return;

  getIconOptions().forEach(({ id, label }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "icon-picker__btn";
    btn.dataset.icon = id;
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-label", label);
    btn.innerHTML = renderIcon(id);
    iconPicker.appendChild(btn);
  });

  iconPicker.addEventListener("click", (e) => {
    const btn = e.target.closest(".icon-picker__btn");
    if (btn) selectIcon(btn.dataset.icon);
  });

  selectIcon(iconInput.value);
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("toast--visible");
  setTimeout(() => toast.classList.remove("toast--visible"), 2500);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderList() {
  const projects = getProjects();
  list.innerHTML = "";

  if (projects.length === 0) {
    emptyList.hidden = false;
    return;
  }

  emptyList.hidden = true;

  projects.forEach((project) => {
    const item = document.createElement("div");
    item.className = "admin-item";
    item.innerHTML = `
      <div class="admin-item__icon">${renderIcon(project.icon)}</div>
      <div class="admin-item__info">
        <h3 class="admin-item__title">${escapeHtml(project.title)}</h3>
        <p class="admin-item__desc">${escapeHtml(project.description)}</p>
        <a class="admin-item__link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.link)}</a>
      </div>
      <div class="admin-item__actions">
        <button type="button" class="btn btn--ghost btn--sm" data-edit="${project.id}">Editar</button>
        <button type="button" class="btn btn--danger btn--sm" data-delete="${project.id}">Excluir</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function resetForm() {
  editingId = null;
  form.reset();
  selectIcon("folder");
  formTitle.textContent = "Novo projeto";
  submitBtn.textContent = "Adicionar projeto";
  cancelBtn.hidden = true;
}

function fillForm(project) {
  editingId = project.id;
  form.elements.title.value = project.title;
  selectIcon(project.icon);
  form.elements.description.value = project.description;
  form.elements.link.value = project.link;
  formTitle.textContent = "Editar projeto";
  submitBtn.textContent = "Salvar alterações";
  cancelBtn.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    title: form.elements.title.value,
    icon: form.elements.icon.value,
    description: form.elements.description.value,
    link: form.elements.link.value,
  };

  if (!data.title || !data.icon || !data.description || !data.link) {
    showToast("Preencha todos os campos.");
    return;
  }

  try {
    new URL(data.link);
  } catch {
    showToast("Informe um link válido (ex: https://...).");
    return;
  }

  const projects = getProjects();

  if (editingId) {
    const index = projects.findIndex((p) => p.id === editingId);
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...data,
        title: data.title.trim(),
        icon: normalizeIconId(data.icon.trim()),
        description: data.description.trim(),
        link: data.link.trim(),
      };
    }
    saveProjects(projects);
    showToast("Projeto atualizado.");
  } else {
    projects.unshift(createProject(data));
    saveProjects(projects);
    showToast("Projeto adicionado.");
  }

  resetForm();
  renderList();
});

cancelBtn.addEventListener("click", resetForm);

list.addEventListener("click", (e) => {
  const editBtn = e.target.closest("[data-edit]");
  const deleteBtn = e.target.closest("[data-delete]");

  if (editBtn) {
    const project = getProjects().find((p) => p.id === editBtn.dataset.edit);
    if (project) fillForm(project);
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.delete;
    if (confirm("Deseja excluir este projeto?")) {
      saveProjects(getProjects().filter((p) => p.id !== id));
      if (editingId === id) resetForm();
      renderList();
      showToast("Projeto excluído.");
    }
  }
});

initIconPicker();
renderList();
