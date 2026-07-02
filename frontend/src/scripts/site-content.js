function setTextContent(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

function setEmailLink(email) {
  const link = document.getElementById("contato-email");
  if (!link || !email) return;

  link.href = `mailto:${email}`;
  const textEl = link.querySelector("[data-email-text]");
  if (textEl) textEl.textContent = email;
}

function applySection(section) {
  if (section.slug === "sobre") {
    setTextContent("sobre-title", section.title);
    setTextContent("sobre-content", section.content);
    return;
  }

  if (section.slug === "contato") {
    setTextContent("contato-title", section.title);
    setTextContent("contato-content", section.content);
    if (section.email) setEmailLink(section.email);
  }
}

async function loadSiteSections() {
  try {
    const response = await fetch("/api/sections");
    if (!response.ok) return;

    const sections = await response.json();
    sections.forEach(applySection);
  } catch {
    /* mantém conteúdo estático de fallback no HTML */
  }
}

loadSiteSections();
