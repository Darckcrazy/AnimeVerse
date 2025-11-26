import api from "./apiService";

interface WatchlistPayload {
  userId: number;
  animeId?: number;
  mangaId?: number;
  status?: string;
  progress?: number;
  score?: number;
  title?: string;
  imageUrl?: string;
  episodes?: number;
  chapters?: number;
}

export function addToWatchlist(payload: WatchlistPayload) {
  return api.request("/watchlist", { 
    method: "POST", 
    body: JSON.stringify(payload) 
  });
}

export function getWatchlist(userId: number) {
  if (!userId) {
    console.error('No user ID provided to getWatchlist');
    return Promise.resolve([]);
  }
  console.log('Fetching watchlist for user ID:', userId);
  return api.request(`/watchlist?userId=${userId}`);
}

interface UpdateWatchlistBody {
  status?: string;
  progress?: number;
  score?: number;
  episodes?: number;
  chapters?: number;
}

export function updateWatchlist(id: number, body: UpdateWatchlistBody) {
  return api.request(`/watchlist/${id}`, { 
    method: "PUT", 
    body: JSON.stringify(body) 
  });
}

export function removeFromWatchlist(id: number) {
  return api.request(`/watchlist/${id}`, { 
    method: "DELETE" 
  });
}