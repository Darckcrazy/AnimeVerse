import { useEffect, useMemo, useState } from 'react';
import './Anime.css';
import MangaSidebar from './MangaSidebar';
import { Link } from 'react-router-dom';

type JikanManga = {
  mal_id: number;
  url: string;
  images: {
    jpg?: { image_url: string };
    webp?: { image_url: string };
  };
  title: string;
  score?: number;
  type?: string;
  published?: {
    prop?: {
      from?: { year?: number | null } | null;
    } | null;
  } | null;
};

export default function Manga() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<JikanManga[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(id);
  }, [query]);

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
          ? `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(debounced)}&limit=${limit}&order_by=score&sort=desc&page=${page}`
          : `https://api.jikan.moe/v4/top/manga?limit=${limit}&page=${page}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const newData: JikanManga[] = Array.isArray(json?.data) ? json.data : [];
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
    () => ['Berserk', 'One Piece', 'Chainsaw Man', 'Vagabond'][Math.floor(Math.random() * 4)],
    []
  );

  return (
    <main className="av-anime container">
      <header className="av-anime__header">
        <h2>Manga</h2>
        <div className="av-anime__search">
          <i className="bi bi-search"></i>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Cerca... es. ${placeholder}`}
            aria-label="Cerca manga"
          />
          {query && (
            <button className="av-anime__clear" onClick={() => setQuery('')} aria-label="Pulisci">
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </header>

      <div className="av-anime__layout">
        <MangaSidebar />

        <section className="av-anime__content">
          {error && <div className="av-anime__state av-anime__state--error">{error}</div>}
          {loading && <div className="av-anime__state">Caricamento…</div>}

          {!loading && !error && results.length === 0 && debounced && (
            <div className="av-anime__state">Nessun risultato per “{debounced}”.</div>
          )}

          <div className="av-grid">
            {results.map((m) => {
              const img =
                m.images?.webp?.image_url ||
                m.images?.jpg?.image_url ||
                'https://via.placeholder.com/300x420?text=Manga';
              const year = m.published?.prop?.from?.year ?? undefined;
              return (
                <Link key={m.mal_id} to={`/manga/${m.mal_id}`} className="av-card">
                  <div className="av-card__media">
                    <img src={img} alt={m.title} loading="lazy" />
                  </div>
                  <div className="av-card__meta">
                    <h4 title={m.title}>{m.title}</h4>
                    <div className="av-card__tags">
                      {m.type && <span className="av-tag">{m.type}</span>}
                      {typeof m.score === 'number' && (
                        <span className="av-tag"><i className="bi bi-star-fill"></i>{m.score.toFixed(1)}</span>
                      )}
                      {year && <span className="av-tag">{year}</span>}
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