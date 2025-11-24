import api from "./apiService";

export function getRecommendations(userId: number, limit = 10) {
  return api.request(`/recommendations/${userId}?limit=${limit}`);
}

export function getTrending() {
  return api.request("/trending");
}