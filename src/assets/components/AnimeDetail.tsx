import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import './Anime.css';
import { useAuth } from '../hooks/useAuthContext';
import { apiService } from '../services/api';

type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
};

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
  const location = useLocation();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anime, setAnime] = useState<AnimeDetailData | null>(() => {
    // Initialize with data from location state if available
    if (location.state?.item) {
      return {
        mal_id: location.state.item.id || 0,
        title: location.state.item.title || '',
        title_english: location.state.item.title,
        synopsis: location.state.item.synopsis,
        episodes: location.state.item.episodes || location.state.item.totalEpisodes,
        images: {
          jpg: { image_url: location.state.item.image || '' },
          webp: { image_url: location.state.item.image || '' }
        },
        score: location.state.item.score,
        year: location.state.item.year,
        type: location.state.item.type
      };
    }
    return null;
  });
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [streaming, setStreaming] = useState<Array<{ name: string; url: string }>>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!id) return;
    
    const controller = new AbortController();
    
    const run = async () => {
      // Only show loading if we don't have initial data from location state
      if (!anime) {
        setLoading(true);
      }
      setError(null);
      
      try {
        // Only fetch if we don't have data from location state or if we need to refresh
        if (!anime || !location.state?.fromList) {
          try {
            const detailRes = await fetch(`/jikan/anime/${id}/full`, {
              signal: controller.signal,
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (!detailRes.ok) {
              throw new Error(`Failed to load anime details: ${detailRes.status} ${detailRes.statusText}`);
            }
            
            const detailJson = await detailRes.json();
            setAnime(detailJson?.data ?? null);
          } catch (err) {
            console.error('Error fetching anime details:', err);
            setError('Failed to load anime details. Please try again later.');
            return;
          }
        }

        // Episodes list (videos/episodes)
        try {
          const epRes = await fetch(`/jikan/anime/${id}/episodes`, {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (epRes.status === 429) {
            console.warn('Rate limited by Jikan API for episodes');
            setEpisodes([]);
          } else if (epRes.ok) {
            const epJson = await epRes.json();
            const items: EpisodeItem[] = Array.isArray(epJson?.data)
              ? (epJson.data as JikanEpisodeApi[]).map((e) => ({
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
            console.warn('Failed to fetch episodes, setting empty array. Status:', epRes.status);
            setEpisodes([]);
          }
        } catch (error) {
          console.error('Error fetching episodes:', error);
          setEpisodes([]);
        }

        // Streaming providers - try to fetch from /anime endpoint which may have streaming info
        try {
          const streamRes = await fetch(`/jikan/anime/${id}`, {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (streamRes.status === 429) {
            console.warn('Rate limited by Jikan API for streaming data');
            setStreaming([]);
          } else if (streamRes.ok) {
            const sJson = await streamRes.json();
            const streamingData = sJson?.data?.streaming;
            type JikanStreamingApi = { name?: string; url?: string };
            const items: Array<{ name: string; url: string }> = Array.isArray(streamingData)
              ? (streamingData as JikanStreamingApi[])
                  .filter((s) => Boolean(s?.name) && Boolean(s?.url))
                  .map((s) => ({
                      name: String(s.name || 'Unknown'), 
                      url: String(s.url || '#')
                  }))
              : [];
            setStreaming(items);
          } else {
            console.warn('Failed to fetch streaming data, setting empty array. Status:', streamRes.status);
            setStreaming([]);
          }
        } catch (error) {
          console.error('Error fetching streaming data:', error);
          setStreaming([]);
        }

        // Load mock reviews from localStorage
        const savedReviews = localStorage.getItem(`anime_reviews_${id}`);
        if (savedReviews) {
          setReviews(JSON.parse(savedReviews));
        } else {
          // Mock reviews
          setReviews([
            {
              id: '1',
              user: 'AnimeFan2024',
              rating: 9,
              comment: 'Uno dei migliori anime che abbia mai visto! La storia è coinvolgente e i personaggi sono ben sviluppati.',
              date: '2024-01-15'
            },
            {
              id: '2',
              user: 'OtakuGirl',
              rating: 8,
              comment: 'Ottima animazione e colonna sonora. Mi ha fatto emozionare più volte.',
              date: '2024-01-10'
            },
            {
              id: '3',
              user: 'MangaLover',
              rating: 7,
              comment: 'Buono ma non eccezionale. Alcuni archi narrativi potevano essere meglio sviluppati.',
              date: '2024-01-05'
            }
          ]);
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

  const handleAddReview = () => {
    if (!newReview.comment.trim()) return;

    const review: Review = {
      id: Date.now().toString(),
      user: 'Tu',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`anime_reviews_${id}`, JSON.stringify(updatedReviews));
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const addToWatchlist = async () => {
    try {
      if (!token) {
        alert("Devi effettuare il login per aggiungere alla watchlist");
        return;
      }
      if (!anime?.mal_id) {
        alert("Errore: ID anime non disponibile");
        return;
      }
      const animeData = {
        title: anime.title,  // Manteniamo il titolo a livello superiore
        anime: {           // Aggiungiamo un oggetto anime con i dettagli completi
          title: anime.title,
          mal_id: anime.mal_id,
          imageUrl: anime.images?.webp?.image_url || anime.images?.jpg?.image_url,
          score: anime.score,
          type: anime.type,
          year: anime.year,
          synopsis: anime.synopsis,
          images: anime.images  // Includiamo l'oggetto images completo
        },
        image: anime.images?.webp?.image_url || anime.images?.jpg?.image_url,
        score: anime.score,
        type: anime.type,
        year: anime.year,
        synopsis: anime.synopsis
      };
      await apiService.addToWatchlist(token, anime.mal_id, 'planning', animeData);
      alert("Aggiunto alla watchlist");
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.includes('already in watchlist')) {
        alert("Questo anime è già presente nella tua watchlist!");
      } else {
        alert("Errore aggiunta watchlist: " + (e.message || e));
      }
    }
  };

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

          <div className="av-detail__reviews">
            <div className="av-reviews-header">
              <h4>Recensioni ({reviews.length})</h4>
              <button
                className="av-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Annulla' : 'Scrivi recensione'}
              </button>
            </div>

            {showReviewForm && (
              <div className="av-review-form">
                <div className="av-form-group">
                  <label>Voto:</label>
                  <div className="av-rating-input">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`av-star ${newReview.rating >= star ? 'active' : ''}`}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      >
                        <i className="bi bi-star-fill"></i>
                      </button>
                    ))}
                    <span className="av-rating-value">{newReview.rating}/10</span>
                  </div>
                </div>
                <div className="av-form-group">
                  <label>Commento:</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Condividi la tua opinione su questo anime..."
                    rows={4}
                  />
                </div>
                <button
                  className="av-btn"
                  onClick={handleAddReview}
                  disabled={!newReview.comment.trim()}
                >
                  Pubblica recensione
                </button>
              </div>
            )}

            <div className="av-reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="av-review">
                  <div className="av-review-header">
                    <div className="av-review-user">
                      <strong>{review.user}</strong>
                      <span className="av-review-date">{review.date}</span>
                    </div>
                    <div className="av-review-rating">
                      {[...Array(10)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star-fill ${i < review.rating ? 'filled' : ''}`}
                        />
                      ))}
                      <span>{review.rating}/10</span>
                    </div>
                  </div>
                  <p className="av-review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={addToWatchlist}>Aggiungi alla Watchlist</button>
        </section>
      )}
    </main>
  );
}
