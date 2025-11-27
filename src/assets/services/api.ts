// Ottiene l'URL base dell'API dalle variabili d'ambiente, altrimenti usa localhost
const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
// Costruisce l'URL base dell'API rimuovendo gli slash finali
const API_BASE_URL = (rawBase.replace(/\/$/, '') + '/api').replace(/\/$/, '');

// Interfaccia per le credenziali di login
export interface LoginRequest {
  email: string;
  password: string;
}

// Interfaccia per i dati di registrazione
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

// Interfaccia per la risposta di autenticazione dal server
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

// Interfaccia per un elemento della watchlist
export interface Watchlist {
  watchlistId: number;
  animeId: number;
  animeTitolo: string;
  status: string;
  dataAggiunzione: string;
}

// Interfaccia per un elemento della readlist
export interface Readlist {
  readlistId: number;
  mangaId: number;
  mangaTitolo: string;
  status: string;
  dataAggiunzione: string;
}

// Classe per gestire tutte le richieste API
class ApiService {
  // Metodo privato per costruire gli header HTTP con eventuale token di autenticazione
  private getHeaders(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    // Se c'è un token, lo aggiunge agli header di autorizzazione
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  // Metodo per effettuare il login e ottenere il token di autenticazione
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    // Se la risposta non è OK, lancia un errore
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    // Ritorna il JSON della risposta (token di accesso)
    return response.json();
  }

  // Metodo per registrare un nuovo utente
  async signup(data: SignupRequest): Promise<Response> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      // Se la risposta non è OK, lancia un errore
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Signup failed: ${error}`);
      }

      return response;
    } catch (error) {
      // Gestisce gli errori di registrazione
      console.error('Error during signup:', error);
      throw new Error('Signup request failed. Please check your connection and try again.');
    }
  }

  // Metodo per ottenere i dati dell'utente corrente
  async getCurrentUser(token: string) {
    const response = await fetch(`${API_BASE_URL}/utenti/me`, {
      headers: this.getHeaders(token),
    });

    // Se la risposta non è OK, lancia un errore
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  // Metodo per ottenere la lista di anime con paginazione
  async getAnime(page = 0, size = 20) {
    const response = await fetch(
      `${API_BASE_URL}/anime?page=${page}&size=${size}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch anime');
    return response.json();
  }

  // Metodo per ottenere la lista di manga con paginazione
  async getManga(page = 0, size = 20) {
    const response = await fetch(
      `${API_BASE_URL}/manga?page=${page}&size=${size}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch manga');
    return response.json();
  }

  // Metodo per ottenere la watchlist dell'utente corrente
  async getMyWatchlist(token: string): Promise<Watchlist[]> {
    const response = await fetch(`${API_BASE_URL}/watchlist/me`, {
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch watchlist');
    return response.json();
  }

  // Metodo per aggiungere un anime alla watchlist
  async addToWatchlist(token: string, animeId: number, status: string): Promise<Watchlist> {
    const response = await fetch(`${API_BASE_URL}/watchlist?animeId=${animeId}&status=${status}`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to add to watchlist');
    return response.json();
  }

  // Metodo per aggiornare lo stato di un anime nella watchlist
  async updateWatchlistStatus(token: string, watchlistId: number, status: string): Promise<Watchlist> {
    const response = await fetch(`${API_BASE_URL}/watchlist/${watchlistId}?status=${status}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to update watchlist status');
    return response.json();
  }

  // Metodo per rimuovere un anime dalla watchlist
  async removeFromWatchlist(token: string, watchlistId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/watchlist/${watchlistId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to remove from watchlist');
  }

  // Metodo per ottenere la readlist dell'utente corrente
  async getMyReadlist(token: string): Promise<Readlist[]> {
    const response = await fetch(`${API_BASE_URL}/readlist/me`, {
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch readlist');
    return response.json();
  }

  // Metodo per aggiungere un manga alla readlist
  async addToReadlist(token: string, mangaId: number, status: string): Promise<Readlist> {
    const response = await fetch(`${API_BASE_URL}/readlist?mangaId=${mangaId}&status=${status}`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to add to readlist');
    return response.json();
  }

  // Metodo per aggiornare lo stato di un manga nella readlist
  async updateReadlistStatus(token: string, readlistId: number, status: string): Promise<Readlist> {
    const response = await fetch(`${API_BASE_URL}/readlist/${readlistId}?status=${status}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to update readlist status');
    return response.json();
  }

  // Metodo per rimuovere un manga dalla readlist
  async removeFromReadlist(token: string, readlistId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/readlist/${readlistId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to remove from readlist');
  }
}

// Istanza singleton del servizio API
export const apiService = new ApiService();
// Esporta l'URL base dell'API per uso in altri moduli
export const API_BASE = API_BASE_URL;
