import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type JikanAnime = {
  mal_id: number;
  title: string;
  images: {
    jpg?: { image_url: string };
    webp?: { image_url: string };
  };
  score?: number;
};

export default function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=12', {
          signal: controller.signal,
        });
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        const shuffled = data.sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 6));
      } catch {
        setRecommendations([
          { mal_id: 1, title: 'Naruto', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=Naruto' } }, score: 8.0 },
          { mal_id: 2, title: 'One Piece', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=One+Piece' } }, score: 9.0 },
          { mal_id: 3, title: 'Attack on Titan', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=AoT' } }, score: 9.1 },
          { mal_id: 4, title: 'Jujutsu Kaisen', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=JJK' } }, score: 8.6 },
          { mal_id: 5, title: 'Demon Slayer', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=Demon+Slayer' } }, score: 8.7 },
          { mal_id: 6, title: 'My Hero Academia', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=MHA' } }, score: 8.4 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section className="av-recommendations">
        <h3>Raccomandazioni per te</h3>
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="av-recommendations">
      <h3>Raccomandazioni per te</h3>
      <p className="text-muted mb-3">Basate sui tuoi gusti e sulle tendenze attuali</p>
      <div className="row g-3">
        {recommendations.map((anime) => {
          const img = anime.images?.webp?.image_url || anime.images?.jpg?.image_url || 'https://via.placeholder.com/200x300?text=Anime';
          return (
            <div key={anime.mal_id} className="col-6 col-md-4 col-lg-2">
              <Link to={`/anime/${anime.mal_id}`} className="av-card">
                <div className="av-card__media">
                  <img src={img} alt={anime.title} loading="lazy" />
                </div>
                <div className="av-card__meta">
                  <h5 title={anime.title}>{anime.title}</h5>
                  {anime.score && (
                    <div className="av-card__tags">
                      <span className="av-tag">
                        <i className="bi bi-star-fill"></i> {anime.score.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
