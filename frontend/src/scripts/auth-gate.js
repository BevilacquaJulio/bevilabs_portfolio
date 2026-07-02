import { validateSession, login, clearAuthenticated } from "./auth.js";

const gate = document.getElementById("admin-gate");
const app = document.getElementById("admin-app");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const headerBack = document.getElementById("header-back");

function showView(view) {
  if (gate) gate.hidden = view !== "gate";
  if (app) app.hidden = view !== "app";
  if (logoutBtn) logoutBtn.hidden = view !== "app";
  if (headerBack) headerBack.hidden = view === "gate";
}

async function loadAdmin() {
  await import("./admin.js");
}

function showLoginError(message = "Senha incorreta.") {
  if (!loginError) return;
  loginError.hidden = false;
  loginError.textContent = message;
}

async function init() {
  if (await validateSession()) {
    showView("app");
    await loadAdmin();
    return;
  }

  showView("gate");
}

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = loginForm.elements.password.value;
  if (!password) return;

  const submitBtn = loginForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  try {
    const ok = await login(password);
    if (!ok) {
      showLoginError();
      loginForm.elements.password.value = "";
      loginForm.elements.password.focus();
      return;
    }

    if (loginError) loginError.hidden = true;
    showView("app");
    await loadAdmin();
  } catch {
    showLoginError("Não foi possível autenticar. Tente novamente.");
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});

logoutBtn?.addEventListener("click", () => {
  clearAuthenticated();
  location.reload();
});

init();
