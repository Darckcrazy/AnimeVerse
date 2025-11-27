// assicurati che la base contenga '/api' anche se VITE_API_BASE è impostata senza suffisso
const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
const API_BASE_URL = (rawBase.replace(/\/$/, '') + '/api').replace(/\/$/, '');

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatarURL?: string;
  favoriteGenres?: string[];
  password?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string;
}

export interface Watchlist {
  watchlistId: number;
  animeId: number;
  animeTitolo: string;
  status: string;
  dataAggiunzione: string;
  imageUrl?: string;
  episodes?: number;
  score?: number;
  progress?: number;
  anime?: {
    title?: string;
    imageUrl?: string;
    synopsis?: string;
    status?: string;
    episodes?: number;
    score?: number;
    year?: number;
  };
}

export interface Readlist {
  readlistId: number;
  mangaId: number;
  mangaTitolo: string;
  status: string;
  dataAggiunzione: string;
  imageUrl?: string;
  chapters?: number;
  volumes?: number;
  score?: number;
  progress?: number;
  manga?: {
    title?: string;
    imageUrl?: string;
    synopsis?: string;
    status?: string;
    chapters?: number;
    score?: number;
    year?: number;
  };
}

class ApiService {
  private getHeaders(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    return response.json();
  }

  async signup(data: SignupRequest): Promise<Response> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Signup failed: ${error}`);
        }

        return response;
    } catch (error) {
        console.error('Error during signup:', error);
        throw new Error('Signup request failed. Please check your connection and try again.');
    }
  }

  async getCurrentUser(token: string) {
    const response = await fetch(`${API_BASE_URL}/utenti/me`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  async getAnime(page = 0, size = 20) {
    const response = await fetch(
      `${API_BASE_URL}/anime?page=${page}&size=${size}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch anime');
    return response.json();
  }

  async getManga(page = 0, size = 20) {
    const response = await fetch(
      `${API_BASE_URL}/manga?page=${page}&size=${size}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch manga');
    return response.json();
  }

  async getMyWatchlist(token: string): Promise<Watchlist[]> {
    const response = await fetch(`${API_BASE_URL}/watchlist/me`, {
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch watchlist');
    return response.json();
  }

  async addToWatchlist(token: string, animeId: number, status: string, animeData?: {
    title?: string;
    imageUrl?: string;
    synopsis?: string;
    status?: string;
    episodes?: number;
    score?: number;
    year?: number;
  }): Promise<Watchlist> {
    const body = animeData ? JSON.stringify({ status, ...animeData }) : JSON.stringify({ status });
    const response = await fetch(`${API_BASE_URL}/watchlist?animeId=${animeId}&status=${status}`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body,
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`Watchlist error - Token: ${token}, Status: ${response.status}, Body: ${text}`);
      throw new Error(`Failed to add to watchlist (${response.status}): ${text}`);
    }
    return response.json();
  }

  async updateWatchlistStatus(token: string, watchlistId: number, status: string): Promise<Watchlist> {
    const response = await fetch(`${API_BASE_URL}/watchlist/${watchlistId}?status=${status}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to update watchlist status');
    return response.json();
  }

  async removeFromWatchlist(token: string, watchlistId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/watchlist/${watchlistId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`Remove Watchlist 403 - Token: ${token}, Status: ${response.status}, Body: ${text}`);
      throw new Error(`Failed to remove from watchlist (${response.status}): ${text}`);
    }
  }

  async getMyReadlist(token: string): Promise<Readlist[]> {
    const response = await fetch(`${API_BASE_URL}/readlist/me`, {
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch readlist');
    return response.json();
  }

  async addToReadlist(token: string, mangaId: number, status: string, mangaData?: {
    title?: string;
    imageUrl?: string;
    synopsis?: string;
    status?: string;
    chapters?: number;
    score?: number;
    year?: number;
  }): Promise<Readlist> {
    const body = mangaData ? JSON.stringify({ status, ...mangaData }) : JSON.stringify({ status });
    const response = await fetch(`${API_BASE_URL}/readlist?mangaId=${mangaId}&status=${status}`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body,
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`Readlist error - Token: ${token}, Status: ${response.status}, Body: ${text}`);
      throw new Error(`Failed to add to readlist (${response.status}): ${text}`);
    }
    return response.json();
  }

  async updateReadlistStatus(token: string, readlistId: number, status: string): Promise<Readlist> {
    const response = await fetch(`${API_BASE_URL}/readlist/${readlistId}?status=${status}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to update readlist status');
    return response.json();
  }

  async removeFromReadlist(token: string, readlistId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/readlist/${readlistId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to remove from readlist');
  }

  async updateUserProfile(
    token: string,
    userData: Partial<Omit<User, 'id' | 'avatarURL'>>
  ): Promise<User> {
    const cleanedData = Object.fromEntries(
      Object.entries(userData).filter(([, value]) => value !== null && value !== undefined && value !== '')
    );

    const response = await fetch(`${API_BASE_URL}/utenti/me`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(cleanedData),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update profile');
    }
    
    return response.json();
  }

  async uploadProfilePicture(token: string, file: File): Promise<{ avatarURL: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/utenti/me/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to upload profile picture');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
export const API_BASE = API_BASE_URL;
