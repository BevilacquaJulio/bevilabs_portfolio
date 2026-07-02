const TOKEN_KEY = "bevilabs_admin_token";

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthenticated() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) return false;

  const data = await response.json();
  if (!data.access_token) return false;

  setToken(data.access_token);
  return true;
}

export async function validateSession() {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch("/api/auth/me", {
      headers: authHeaders(),
    });

    if (!response.ok) {
      clearAuthenticated();
      return false;
    }

    return true;
  } catch {
    clearAuthenticated();
    return false;
  }
}
