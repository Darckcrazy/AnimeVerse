import api from "./apiService";

export function postReview(payload: any) {
  return api.request("/reviews", { method: "POST", body: JSON.stringify(payload) });
}

export function getReviews(itemId: number) {
  return api.request(`/reviews?itemId=${itemId}`);
}

export function postRating(payload: any) {
  return api.request("/ratings", { method: "POST", body: JSON.stringify(payload) });
}