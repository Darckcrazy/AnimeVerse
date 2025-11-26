import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Anime.css';
import { useAuth } from '../hooks/useAuthContext';
import { apiService } from '../services/api';

type MangaDetailData = {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis?: string;
  chapters?: number | null;
  volumes?: number | null;
  images?: {
    jpg?: { image_url: string };
    webp?: { image_url: string };
  };
  score?: number | null;
  type?: string | null;
  published?: {
    prop?: {
      from?: { year?: number | null } | null;
    } | null;
  } | null;
  authors?: Array<{ name?: string }>;
  serializations?: Array<{ name?: string }>;
};

export default function MangaDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manga, setManga] = useState<MangaDetailData | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the proxy endpoint instead of direct Jikan API call
        const res = await fetch(`/jikan/manga/${id}/full`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setManga(json?.data ?? null);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError('Impossibile caricare i dettagli. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [id]);

  const poster = useMemo(() => {
    return (
      manga?.images?.webp?.image_url ||
      manga?.images?.jpg?.image_url ||
      'https://via.placeholder.com/300x420?text=Manga'
    );
  }, [manga]);

  const publishedYear = useMemo(() => manga?.published?.prop?.from?.year ?? null, [manga]);
  const authors = useMemo(
    () => (manga?.authors || []).map((a) => a?.name).filter(Boolean).join(', '),
    [manga]
  );
  const serializations = useMemo(
    () => (manga?.serializations || []).map((s) => s?.name).filter(Boolean).join(', '),
    [manga]
  );

  const addToReadlist = async () => {
    try {
      if (!token) {
        alert("Devi effettuare il login per aggiungere alla readlist");
        return;
      }
      if (!manga?.mal_id) {
        alert("Errore: ID manga non disponibile");
        return;
      }
      const mangaData = {
        title: manga.title,
        imageUrl: manga.images?.webp?.image_url || manga.images?.jpg?.image_url || '',
        score: manga.score,
        year: manga.published?.prop?.from?.year,
        synopsis: manga.synopsis || '',
        chapters: manga.chapters,
        status: 'planning' as const
      };
      await apiService.addToReadlist(token, manga.mal_id, 'planning', mangaData);
      alert("Aggiunto alla readlist");
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.includes('already in readlist')) {
        alert("Questo manga è già presente nella tua readlist!");
      } else {
        alert("Errore aggiunta readlist: " + (e.message || e));
      }
    }
  };

  return (
    <main className="av-anime container">
      <header className="av-anime__header">
        <h2>
          <Link to="/manga" className="av-breadcrumb">
            <i className="bi bi-arrow-left-short"></i> Manga
          </Link>
          <span className="mx-2">/</span>
          <span>{manga?.title_english || manga?.title || 'Dettagli'}</span>
        </h2>
      </header>

      {loading && <div className="av-anime__state">Caricamento…</div>}
      {error && <div className="av-anime__state av-anime__state--error">{error}</div>}

      {!loading && !error && manga && (
        <section className="av-detail">
          <div className="av-detail__top">
            <div className="av-detail__poster">
              <img src={poster} alt={manga.title} />
            </div>
            <div className="av-detail__meta">
              <h3>{manga.title_english || manga.title}</h3>
              <div className="av-card__tags">
                {manga.type && <span className="av-tag">{manga.type}</span>}
                {typeof manga.score === 'number' && (
                  <span className="av-tag">
                    <i className="bi bi-star-fill"></i>
                    {manga.score.toFixed(1)}
                  </span>
                )}
                {publishedYear && <span className="av-tag">{publishedYear}</span>}
                {typeof manga.chapters === 'number' && <span className="av-tag">Cap {manga.chapters}</span>}
                {typeof manga.volumes === 'number' && <span className="av-tag">Vol {manga.volumes}</span>}
              </div>
              {authors && <div className="text-secondary small mt-2">Autori: {authors}</div>}
              {serializations && <div className="text-secondary small">Rivista: {serializations}</div>}
              {manga.synopsis && <p className="av-detail__synopsis">{manga.synopsis}</p>}
              <button 
                onClick={addToReadlist}
                className="av-btn av-btn--primary mt-3"
              >
                <i className="bi bi-bookmark-plus"></i> Aggiungi alla Readlist
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}