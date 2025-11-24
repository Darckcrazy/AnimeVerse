import api from "./apiService";

export async function register(email: string, password: string, username?: string) {
  return api.request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username })
  });
}

export async function login(email: string, password: string) {
  const data = await api.request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  if (data && data.token) localStorage.setItem("token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}