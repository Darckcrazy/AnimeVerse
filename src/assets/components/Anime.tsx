import { useEffect, useMemo, useState } from 'react';
import './Anime.css';
import AnimeSidebar from './AnimeSidebar';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../hooks/useAuthContext';
import { apiService } from '../services/api';

type Genre = {
  mal_id: number;
  name: string;
};

type JikanAnime = {
  mal_id: number;
  url: string;
  images: {
    jpg?: { image_url: string };
    webp?: { image_url: string };
  };
  title: string;
  score?: number;
  year?: number;
  type?: string;
};

export default function Anime() {
  const { token } = useAuth();
  const { watchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  // Search and filter states
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<JikanAnime[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Genres and filters
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(id);
  }, [query]);

  // reset lista quando cambia la query calcolata
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [debounced]);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setError(null);
      setLoading(true);
      try {
        const limit = 24;
        const hasFilters = selectedGenre || selectedYear || selectedSeason;
        const query = debounced || (hasFilters ? ' ' : '');
        
        // Build query parameters
        const params = new URLSearchParams();
        
        if (query && query.trim() !== '') {
          params.append('q', query.trim());
        }
        
        if (selectedGenre) {
          params.append('genres', selectedGenre.toString());
        }
        
        if (selectedYear) {
          params.append('start_date', `${selectedYear}-01-01`);
          params.append('end_date', `${selectedYear}-12-31`);
        }
        
        if (selectedSeason) {
          const currentYear = new Date().getFullYear();
          params.append('season', selectedSeason);
          params.append('year', currentYear.toString());
        }
        
        // Always add pagination and ordering
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (!query) {
          params.append('order_by', 'score');
          params.append('sort', 'desc');
        }
        
        // Use the proxy URL
        const baseUrl = query ? '/jikan/anime' : '/jikan/top/anime';
        const url = `${baseUrl}?${params.toString()}`;
        
        console.log('Fetching from:', url);
        
        const res = await fetch(url, { 
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('API Error:', errorData);
          throw new Error(errorData.message || `HTTP ${res.status}`);
        }
        const json = await res.json();
        const newData: JikanAnime[] = Array.isArray(json?.data) ? json.data : [];
        setHasMore(Boolean(json?.pagination?.has_next_page));
        setResults((prev) => (page === 1 ? newData : [...prev, ...newData]));
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError('Errore durante la ricerca. Riprova.');
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [debounced, page, selectedGenre, selectedYear, selectedSeason]);

  // Remove unused variables
  // const [debouncedGenre, setDebouncedGenre] = useState<number | null>(null);
  // const [debouncedYear, setDebouncedYear] = useState<number | null>(null);
  // const [debouncedSeason, setDebouncedSeason] = useState<string | null>(null);
  // const lastRequestTimeRef = useRef(0);
  
  // Remove unused REQUEST_DELAY_MS
  // const REQUEST_DELAY_MS = 500;

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        console.log('Fetching genres...');
        const res = await fetch('/jikan/genres/anime', { 
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          console.error('Failed to fetch genres:', res.status);
          return;
        }
        
        const json = await res.json();
        console.log('Genres response:', json);
        setGenres(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    
    run();
    return () => controller.abort();
  }, []);

  const placeholder = useMemo(
    () => ['Naruto', 'One Piece', 'Attack on Titan', 'Jujutsu Kaisen'][Math.floor(Math.random() * 4)],
    []
  );

  return (
    <main className="av-anime container">
      <header className="av-anime__header">
        <h2>Anime</h2>
        <div className="av-anime__search">
          <i className="bi bi-search"></i>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Cerca... es. ${placeholder}`}
            aria-label="Cerca anime"
          />
          {query && (
            <button className="av-anime__clear" onClick={() => setQuery('')} aria-label="Pulisci">
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </header>

      <div className="av-filters mb-3">
        <div className="av-filters__container">
          <div className="av-filter-group">
            <i className="bi bi-tags-fill av-filter-icon"></i>
            <select
              className="av-filter-select"
              value={selectedGenre || ''}
              onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Tutti i generi</option>
              {genres.map((g) => (
                <option key={g.mal_id} value={g.mal_id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="av-filter-group">
            <i className="bi bi-calendar-event-fill av-filter-icon"></i>
            <select
              className="av-filter-select"
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Tutti gli anni</option>
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="av-filter-group">
            <i className="bi bi-sun-fill av-filter-icon"></i>
            <select
              className="av-filter-select"
              value={selectedSeason || ''}
              onChange={(e) => setSelectedSeason(e.target.value || null)}
            >
              <option value="">Tutte le stagioni</option>
              <option value="winter">Inverno</option>
              <option value="spring">Primavera</option>
              <option value="summer">Estate</option>
              <option value="fall">Autunno</option>
            </select>
          </div>

          {(selectedGenre || selectedYear || selectedSeason) && (
            <button
              className="av-filter-reset"
              onClick={() => {
                setSelectedGenre(null);
                setSelectedYear(null);
                setSelectedSeason(null);
              }}
            >
              <i className="bi bi-x-circle-fill"></i> Reset filtri
            </button>
          )}
        </div>
      </div>

      <div className="av-anime__layout">
        <AnimeSidebar />

        <section className="av-anime__content">
          {error && <div className="av-anime__state av-anime__state--error">{error}</div>}
          {loading && <div className="av-anime__state">Caricamento…</div>}

          {!loading && !error && results.length === 0 && debounced && (
            <div className="av-anime__state">Nessun risultato per “{debounced}”.</div>
          )}

          <div className="av-grid">
            {results.map((a) => {
              const img =
                a.images?.webp?.image_url ||
                a.images?.jpg?.image_url ||
                'https://via.placeholder.com/300x420?text=Anime';
              const inWatchlist = isInWatchlist(a.mal_id);
              return (
                <div key={a.mal_id} className="av-card-wrapper">
                  <Link to={`/anime/${a.mal_id}`} className="av-card">
                    <div className="av-card__media">
                      <img src={img} alt={a.title} loading="lazy" />
                    </div>
                    <div className="av-card__meta">
                      <h4 title={a.title}>{a.title}</h4>
                      <div className="av-card__tags">
                        {a.type && <span className="av-tag">{a.type}</span>}
                        {typeof a.score === 'number' && (
                          <span className="av-tag"><i className="bi bi-star-fill"></i>{a.score.toFixed(1)}</span>
                        )}
                        {a.year && <span className="av-tag">{a.year}</span>}
                      </div>
                    </div>
                  </Link>
                  <button
                    className={`av-card-btn ${inWatchlist ? 'av-card-btn--active' : ''}`}
                    onClick={async () => {
                      if (!token) {
                        alert('Devi effettuare il login per aggiungere alla watchlist');
                        return;
                      }
                      try {
                        if (inWatchlist) {
                          const watchlistItem = watchlist.find(item => item.animeId === a.mal_id);
                          if (watchlistItem) {
                            await removeFromWatchlist(token, watchlistItem.id);
                          }
                        } else {
                          const animeData = {
                            title: a.title,  // Manteniamo il titolo a livello superiore
                            anime: {         // Aggiungiamo un oggetto anime con i dettagli completi
                              title: a.title,
                              mal_id: a.mal_id,
                              imageUrl: a.images?.webp?.image_url || a.images?.jpg?.image_url,
                              score: a.score,
                              type: a.type,
                              year: a.year,
                              images: a.images  // Includiamo l'oggetto images completo
                            },
                            image: a.images?.webp?.image_url || a.images?.jpg?.image_url,
                            score: a.score,
                            type: a.type,
                            year: a.year
                          };
                          await apiService.addToWatchlist(token, a.mal_id, 'planning', animeData);
                        }
                      } catch (err) {
                        const msg = err instanceof Error ? err.message : 'Errore sconosciuto';
                        alert(`Errore: ${msg}`);
                        console.error('Watchlist error:', err);
                      }
                    }}
                    title={inWatchlist ? 'Rimuovi dalla watchlist' : 'Aggiungi alla watchlist'}
                  >
                    <i className={`bi ${inWatchlist ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                  </button>
                </div>
              );
            })}
          </div>

          {!loading && hasMore && results.length > 0 && (
            <div className="d-flex justify-content-center my-4">
              <button className="btn btn-outline-secondary" onClick={() => setPage((p) => p + 1)}>
                Carica altri
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}