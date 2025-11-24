const API_BASE_URL = 'http://localhost:8080';

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

export interface Watchlist {
  watchlistId: number;
  animeId: number;
  animeTitolo: string;
  status: string;
  dataAggiunzione: string;
}

export interface Readlist {
  readlistId: number;
  mangaId: number;
  mangaTitolo: string;
  status: string;
  dataAggiunzione: string;
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
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Signup failed');
    }

    return response;
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

  async addToWatchlist(token: string, animeId: number, status: string): Promise<Watchlist> {
    const response = await fetch(`${API_BASE_URL}/watchlist?animeId=${animeId}&status=${status}`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to add to watchlist');
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
    if (!response.ok) throw new Error('Failed to remove from watchlist');
  }

  async getMyReadlist(token: string): Promise<Readlist[]> {
    const response = await fetch(`${API_BASE_URL}/readlist/me`, {
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch readlist');
    return response.json();
  }

  async addToReadlist(token: string, mangaId: number, status: string): Promise<Readlist> {
    const response = await fetch(`${API_BASE_URL}/readlist?mangaId=${mangaId}&status=${status}`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to add to readlist');
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
}

export const apiService = new ApiService();
