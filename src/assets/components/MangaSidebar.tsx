import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Simple in-memory cache
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Rate-limited fetch wrapper
async function fetchWithRateLimit(url: string, retries = 3): Promise<any> {
  try {
    // Check cache first
    const cached = cache[url];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Add a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        // If rate limited, wait longer and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithRateLimit(url, retries - 1);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the response
    cache[url] = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

type SimpleManga = {
  mal_id: number;
  url: string;
  title: string;
  images?: {
    jpg?: { image_url: string };
    webp?: { image_url: string };
  };
};

export default function MangaSidebar() {
  const [latest, setLatest] = useState<SimpleManga[]>([]);
  const [trending, setTrending] = useState<SimpleManga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch latest and trending in parallel but with rate limiting
        const [latestRes, trendRes] = await Promise.allSettled([
          fetchWithRateLimit('https://api.jikan.moe/v4/top/manga?filter=publishing&limit=8'),
          fetchWithRateLimit('https://api.jikan.moe/v4/top/manga?limit=8')
        ]);

        if (latestRes.status === 'fulfilled') {
          setLatest(Array.isArray(latestRes.value?.data) ? latestRes.value.data : []);
        }

        if (trendRes.status === 'fulfilled') {
          setTrending(Array.isArray(trendRes.value?.data) ? trendRes.value.data : []);
        }

        // Check if any requests were rejected
        if (latestRes.status === 'rejected' || trendRes.status === 'rejected') {
          throw new Error('Failed to fetch some data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load manga data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, []);

  const renderList = (items: SimpleManga[]) => (
    <ul className="av-side__list">
      {items.map((m) => {
        const img =
          m.images?.webp?.image_url ||
          m.images?.jpg?.image_url ||
          'https://via.placeholder.com/64x90?text=Manga';
        return (
          <li key={m.mal_id} className="av-side__item">
            <Link to={`/manga/${m.mal_id}`} className="av-side__link">
              <img src={img} alt={m.title} loading="lazy" />
              <span title={m.title}>{m.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  if (isLoading) {
    return <div className="av-side">Loading...</div>;
  }

  if (error) {
    return <div className="av-side">Error: {error}</div>;
  }

  return (
    <aside className="av-sidebar">
      <section className="av-side__section">
        <h5>In Pubblicazione</h5>
        {latest.length > 0 ? renderList(latest) : <p>Nessun manga in pubblicazione</p>}
      </section>
      <section className="av-side__section">
        <h5>Popolari</h5>
        {trending.length > 0 ? renderList(trending) : <p>Nessun manga popolare trovato</p>}
      </section>
    </aside>
  );
}