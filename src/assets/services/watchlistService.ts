import api from "./apiService";

export function addToWatchlist(payload: any) {
  return api.request("/watchlist", { method: "POST", body: JSON.stringify(payload) });
}

export function getWatchlist(userId: number) {
  return api.request(`/watchlist?userId=${userId}`);
}

export function updateWatchlist(id: number, body: any) {
  return api.request(`/watchlist/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export function removeFromWatchlist(id: number) {
  return api.request(`/watchlist/${id}`, { method: "DELETE" });
}