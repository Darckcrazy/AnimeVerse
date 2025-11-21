import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Recommendations.css';

type JikanAnime = {
  mal_id: number;
  title: string;
  images: {
    jpg?: { image_url: string };
    webp?: { image_url: string };
  };
  score?: number;
  year?: number;
  type?: string;
};

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'top'>('trending');

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        let url = 'https://api.jikan.moe/v4/top/anime?limit=24';
        if (activeTab === 'trending') {
          url = 'https://api.jikan.moe/v4/anime?order_by=score&sort=desc&limit=24';
        }
        
        const res = await fetch(url, {
          signal: controller.signal,
        });
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        setRecommendations(data);
      } catch {
        setRecommendations([
          { mal_id: 1, title: 'Naruto', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=Naruto' } }, score: 8.0, year: 2002, type: 'TV' },
          { mal_id: 2, title: 'One Piece', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=One+Piece' } }, score: 9.0, year: 1999, type: 'TV' },
          { mal_id: 3, title: 'Attack on Titan', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=AoT' } }, score: 9.1, year: 2013, type: 'TV' },
          { mal_id: 4, title: 'Jujutsu Kaisen', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=JJK' } }, score: 8.6, year: 2020, type: 'TV' },
          { mal_id: 5, title: 'Demon Slayer', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=Demon+Slayer' } }, score: 8.7, year: 2019, type: 'TV' },
          { mal_id: 6, title: 'My Hero Academia', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=MHA' } }, score: 8.4, year: 2016, type: 'TV' },
          { mal_id: 7, title: 'Bleach', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=Bleach' } }, score: 8.1, year: 2004, type: 'TV' },
          { mal_id: 8, title: 'Tokyo Ghoul', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=Tokyo+Ghoul' } }, score: 7.8, year: 2014, type: 'TV' },
          { mal_id: 9, title: 'Death Note', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=Death+Note' } }, score: 9.0, year: 2006, type: 'TV' },
          { mal_id: 10, title: 'Steins;Gate', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=Steins+Gate' } }, score: 9.1, year: 2011, type: 'TV' },
          { mal_id: 11, title: 'Code Geass', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=Code+Geass' } }, score: 8.6, year: 2006, type: 'TV' },
          { mal_id: 12, title: 'Fullmetal Alchemist', images: { jpg: { image_url: 'https://via.placeholder.com/200x300?text=FMA' } }, score: 9.0, year: 2005, type: 'TV' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    run();
    return () => controller.abort();
  }, [activeTab]);

  if (loading) {
    return (
      <main className="av-recommendations-page">
        <div className="av-recommendations-container container">
          <section className="av-recommendations-header">
            <h1>Raccomandazioni</h1>
            <p>Scopri gli anime più hot del momento e i migliori di sempre</p>
          </section>
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="av-recommendations-page">
      <div className="av-recommendations-container container">
        <section className="av-recommendations-header">
          <h1>Raccomandazioni</h1>
          <p>Scopri gli anime più hot del momento e i migliori di sempre</p>
        </section>

        <div className="av-recommendations-controls">
          <div className="av-tabs">
            <button
              className={`av-tab ${activeTab === 'trending' ? 'av-tab--active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              <i className="bi bi-fire"></i> Tendenze
            </button>
            <button
              className={`av-tab ${activeTab === 'top' ? 'av-tab--active' : ''}`}
              onClick={() => setActiveTab('top')}
            >
              <i className="bi bi-award"></i> Top Rated
            </button>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="av-recommendations-empty">
            <i className="bi bi-search"></i>
            <h2>Nessun risultato</h2>
            <p>Non abbiamo trovato raccomandazioni al momento</p>
          </div>
        ) : (
          <div className="av-recommendations-grid">
            {recommendations.map((anime) => {
              const img = anime.images?.webp?.image_url || anime.images?.jpg?.image_url || 'https://via.placeholder.com/200x300?text=Anime';
              return (
                <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`} className="av-recommendation-card">
                  <div className="av-recommendation-card__image">
                    <img src={img} alt={anime.title} loading="lazy" />
                    {anime.score && (
                      <div className="av-recommendation-card__score">
                        <i className="bi bi-star-fill"></i>
                        <span>{anime.score.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="av-recommendation-card__content">
                    <h3 title={anime.title}>{anime.title}</h3>
                    <div className="av-recommendation-card__meta">
                      {anime.year && <span className="av-meta-item">{anime.year}</span>}
                      {anime.type && <span className="av-meta-item">{anime.type}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
