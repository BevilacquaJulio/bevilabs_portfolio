import { getProjects } from "./storage.js";

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

function syncProjectCount() {
  const el = document.querySelector("[data-stat='projects']");
  if (!el) return;

  const count = getProjects().length;
  el.dataset.count = count;

  if (el.dataset.animated === "true") {
    el.textContent = count;
  }
}

syncProjectCount();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.dataset.stat === "projects") {
          syncProjectCount();
        }

        const value = entry.target.dataset.count;
        if (value !== undefined) {
          animateCounter(entry.target, parseInt(value, 10));
          entry.target.dataset.animated = "true";
          observer.unobserve(entry.target);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((el) => observer.observe(el));

window.addEventListener("storage", (e) => {
  if (e.key === "bevilabs_projects") syncProjectCount();
});

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
        }
      });
    },
    { rootMargin: "-40% 0px -40% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}
