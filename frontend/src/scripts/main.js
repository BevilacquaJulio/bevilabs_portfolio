import { fetchProjects } from "./storage.js";

function animateCounter(element, target, duration = 1500) {
  const isPercent = element.parentElement.querySelector(".stat__label")?.textContent.includes("%");
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    element.textContent = isPercent ? `${current}%` : current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function updateProjectCountElement(count, animate = false) {
  const el = document.querySelector("[data-stat='projects']");
  if (!el) return;

  el.dataset.count = count;

  if (animate && el.dataset.animated !== "true") {
    animateCounter(el, count);
    el.dataset.animated = "true";
  } else if (el.dataset.animated === "true") {
    el.textContent = count;
  }
}

async function loadProjectCount() {
  try {
    const projects = await fetchProjects();
    return projects.length;
  } catch {
    return 0;
  }
}

function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  function setOpen(isOpen) {
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    menu.hidden = !isOpen;
    document.body.classList.toggle("menu-open", isOpen);
  }

  toggle.addEventListener("click", () => {
    setOpen(menu.hidden);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) setOpen(false);
  });
}

async function initStats() {
  const count = await loadProjectCount();
  updateProjectCountElement(count, false);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const value = parseInt(entry.target.dataset.count, 10);
        if (Number.isNaN(value)) return;

        if (entry.target.dataset.stat === "projects") {
          animateCounter(entry.target, value);
        } else {
          animateCounter(entry.target, value);
        }

        entry.target.dataset.animated = "true";
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => observer.observe(el));
}

window.addEventListener("projects:updated", (e) => {
  updateProjectCountElement(e.detail.count, false);
});

initStats();
initMobileMenu();

document.querySelectorAll(".btn--ghost").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.style.transform = "scale(0.97)";
    setTimeout(() => {
      btn.style.transform = "";
    }, 150);
  });
});

const navLinks = document.querySelectorAll(".nav-link[href^='#']");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("nav-link--active"));
    link.classList.add("nav-link--active");
  });
});

if (sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("nav-link--active", link.getAttribute("href") === `#${id}`);
          });
          document.querySelectorAll(".mobile-menu__link").forEach((link) => {
            link.classList.toggle("mobile-menu__link--active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -40% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}
