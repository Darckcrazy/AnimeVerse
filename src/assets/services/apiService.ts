export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

async function request(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(opts.headers || {});
  if (!(opts.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", "Bearer " + token);
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  // Try to parse json, but handle empty
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default { request };