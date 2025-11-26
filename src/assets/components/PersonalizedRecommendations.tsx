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

const API_BASE_URL = 'http://localhost:3001/api/utenti';

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

    const fetchRecommendations = async () => {
      const controller = new AbortController();
      setLoading(true);
      setError(null);
      console.log('Inizio fetch delle raccomandazioni...');
      console.log('URL:', `${API_BASE_URL}/me/recommendations`);
      
      try {
        const response = await fetch(`${API_BASE_URL}/me/recommendations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        
        console.log('Risposta ricevuta, status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Errore nella risposta:', errorText);
          throw new Error(`Errore ${response.status}: ${response.statusText}\n${errorText}`);
        }
        
        const data = await response.json();
        console.log('Dati ricevuti:', data);
        setRecommendations(data);
      } catch (err) {
        // Don't set error if the fetch was aborted
        if (err.name !== 'AbortError') {
          console.error('Errore durante il fetch:', err);
          if (err instanceof Error) {
            setError(`Errore: ${err.message}`);
          } else {
            setError('Si è verificato un errore sconosciuto');
          }
        }
      } finally {
        console.log('Fetch completato');
        setLoading(false);
      }

      return () => {
        controller.abort();
      };
    };

    fetchRecommendations();
    
    // Cleanup function for the effect
    return () => {
      // The AbortController's abort() is already called in the fetchRecommendations cleanup
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
