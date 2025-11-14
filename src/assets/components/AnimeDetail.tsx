import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Anime.css';

type AnimeDetailData = {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis?: string;
  episodes?: number;
  images?: {
    jpg?: { image_url: string };
    webp?: { image_url: string };
  };
  trailer?: {
    youtube_id?: string | null;
    url?: string | null;
    embed_url?: string | null;
  };
  score?: number;
  year?: number;
  type?: string;
};

type EpisodeItem = {
  mal_id: number;
  title: string;
  aired: string | null;
  score: number | null;
  episode: number;
  url: string;
};

type JikanEpisodeApi = {
  mal_id?: number;
  title?: string;
  aired?: string | null;
  score?: number | null;
  episode?: number;
  url?: string;
};

export default function AnimeDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anime, setAnime] = useState<AnimeDetailData | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [streaming, setStreaming] = useState<Array<{ name: string; url: string }>>([]);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // Details (full)
        const detailRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`, {
          signal: controller.signal,
        });
        if (!detailRes.ok) throw new Error(`HTTP ${detailRes.status}`);
        const detailJson = await detailRes.json();
        setAnime(detailJson?.data ?? null);

        // Episodes list (videos/episodes)
        const epRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/videos/episodes`, {
          signal: controller.signal,
        });
        if (epRes.ok) {
          const epJson = await epRes.json();
          const items: EpisodeItem[] = Array.isArray(epJson?.data?.episodes)
            ? (epJson.data.episodes as JikanEpisodeApi[]).map((e) => ({
                mal_id: Number(e.mal_id ?? e.episode ?? 0),
                title: e.title ?? `Episode ${e.episode}`,
                aired: e.aired ?? null,
                score: e.score ?? null,
                episode: e.episode ?? 0,
                url: e.url ?? '',
              }))
            : [];
          setEpisodes(items);
        } else {
          setEpisodes([]);
        }

        // Streaming providers (if any)
        try {
          const streamRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/streaming`, {
            signal: controller.signal,
          });
          if (streamRes.ok) {
            const sJson = await streamRes.json();
            type JikanStreamingApi = { name?: string; url?: string };
            const items: Array<{ name: string; url: string }> = Array.isArray(sJson?.data)
              ? (sJson.data as JikanStreamingApi[])
                  .filter((s) => Boolean(s?.name) && Boolean(s?.url))
                  .map((s) => ({ name: String(s.name), url: String(s.url) }))
              : [];
            setStreaming(items);
          } else {
            setStreaming([]);
          }
        } catch {
          setStreaming([]);
        }
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
      anime?.images?.webp?.image_url ||
      anime?.images?.jpg?.image_url ||
      'https://via.placeholder.com/300x420?text=Anime'
    );
  }, [anime]);

  const trailerEmbed = useMemo(() => {
    if (!anime?.trailer) return null;
    const ytId = anime.trailer.youtube_id ?? null;
    const embed = anime.trailer.embed_url ?? (ytId ? `https://www.youtube.com/embed/${ytId}` : null);
    return embed;
  }, [anime]);

  return (
    <main className="av-anime container">
      <header className="av-anime__header">
        <h2>
          <Link to="/anime" className="av-breadcrumb">
            <i className="bi bi-arrow-left-short"></i> Anime
          </Link>
          <span className="mx-2">/</span>
          <span>{anime?.title_english || anime?.title || 'Dettagli'}</span>
        </h2>
      </header>

      {loading && <div className="av-anime__state">Caricamento…</div>}
      {error && <div className="av-anime__state av-anime__state--error">{error}</div>}

      {!loading && !error && anime && (
        <section className="av-detail">
          <div className="av-detail__top">
            <div className="av-detail__poster">
              <img src={poster} alt={anime.title} />
            </div>
            <div className="av-detail__meta">
              <h3>{anime.title_english || anime.title}</h3>
              <div className="av-card__tags">
                {anime.type && <span className="av-tag">{anime.type}</span>}
                {typeof anime.score === 'number' && (
                  <span className="av-tag">
                    <i className="bi bi-star-fill"></i>
                    {anime.score.toFixed(1)}
                  </span>
                )}
                {anime.year && <span className="av-tag">{anime.year}</span>}
                {typeof anime.episodes === 'number' && <span className="av-tag">Ep {anime.episodes}</span>}
              </div>
              {anime.synopsis && <p className="av-detail__synopsis">{anime.synopsis}</p>}

              {streaming.length > 0 && (
                <div className="av-detail__streaming">
                  <h5>Dove guardare</h5>
                  <div className="av-chiprow">
                    {streaming.map((s) => (
                      <a key={s.url} className="av-chip" href={s.url} target="_blank" rel="noreferrer">
                        <span>{s.name}</span>
                        <i className="bi bi-box-arrow-up-right"></i>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {trailerEmbed && (
            <div className="av-detail__video">
              <div className="av-video">
                <iframe
                  src={trailerEmbed}
                  title="Trailer"
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="av-detail__episodes">
            <h4>
              Episodi{typeof anime.episodes === 'number' ? ` (${anime.episodes})` : ''}
            </h4>
            {episodes.length === 0 ? (
              <div className="av-anime__state">Nessun episodio disponibile.</div>
            ) : (
              <ul className="av-episodes">
                {episodes.map((ep) => (
                  <li key={ep.mal_id} className="av-episode">
                    <div className="av-episode__num">Ep {ep.episode}</div>
                    <div className="av-episode__body">
                      <div className="av-episode__title">{ep.title}</div>
                      {ep.aired && <div className="av-episode__meta">Aired: {new Date(ep.aired).toLocaleDateString()}</div>}
                    </div>
                    {ep.url && (
                      <a className="av-episode__link" href={ep.url} target="_blank" rel="noreferrer">
                        Vedi clip <i className="bi bi-box-arrow-up-right"></i>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </main>
  );
}