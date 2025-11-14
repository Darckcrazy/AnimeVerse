import { useEffect, useMemo, useState } from 'react';
import './Anime.css';
import AnimeSidebar from './AnimeSidebar';
import { Link } from 'react-router-dom';

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
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<JikanAnime[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
        const url = debounced
          ? `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(debounced)}&limit=${limit}&order_by=score&sort=desc&page=${page}`
          : `https://api.jikan.moe/v4/top/anime?limit=${limit}&page=${page}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
  }, [debounced, page]);

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
              return (
              <Link key={a.mal_id} to={`/anime/${a.mal_id}`} className="av-card">
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