import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Recommendations.css';

type Anime = {
  animeId: number;
  title: string;
  imageUrl?: string;
  score?: number;
  year?: number;
};

const API_BASE_URL = 'http://localhost:8080';

export default function PersonalizedRecommendations() {
  const authContext = useContext(AuthContext);
  const token = authContext?.token || null;

  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setRecommendations([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/utenti/me/recommendations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
        }
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    return () => {
      controller.abort();
    };
  }, [token]);

  if (loading) return <p>Loading personalized recommendations...</p>;
  if (error) return <p>Error loading recommendations: {error}</p>;
  if (recommendations.length === 0) return <p>No personalized recommendations available.</p>;

  return (
    <section className="av-personalized-recommendations">
      <h2>Personalized Recommendations</h2>
      <div className="av-recommendations-grid">
        {recommendations.map((anime) => (
          <Link key={anime.animeId} to={`/anime/${anime.animeId}`} className="av-recommendation-card">
            <div className="av-recommendation-card__image">
              <img src={anime.imageUrl || 'https://via.placeholder.com/200x300?text=Anime'} alt={anime.title} loading="lazy" />
              {anime.score !== undefined && (
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
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
