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

type SimpleAnime = {
  mal_id: number;
  url: string;
  title: string;
  images?: {
    jpg?: { image_url: string };
    webp?: { image_url: string };
  };
};

export default function AnimeSidebar() {
  const [latest, setLatest] = useState<SimpleAnime[]>([]);
  const [trending, setTrending] = useState<SimpleAnime[]>([]);
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
          fetchWithRateLimit('https://api.jikan.moe/v4/seasons/now?limit=8'),
          fetchWithRateLimit('https://api.jikan.moe/v4/top/anime?limit=8')
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
        setError('Failed to load anime data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, []);

  const renderList = (items: SimpleAnime[]) => (
    <div className="av-side__grid">
      {items.map((a) => {
        const img =
          a.images?.webp?.image_url ||
          a.images?.jpg?.image_url ||
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI5MCIgdmlld0JveD0iMCAwIDY0IDkwIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iOTAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSIzMiIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
        return (
          <div key={a.mal_id} className="av-side__card">
            <Link to={`/anime/${a.mal_id}`} className="av-side__link">
              <div className="av-side__image-container">
                <img 
                  src={img} 
                  alt={a.title} 
                  loading="lazy" 
                  className="av-side__image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI5MCIgdmlld0JveD0iMCAwIDY0IDkwIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iOTAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSIzMiIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                  }}
                />
              </div>
              <div className="av-side__title" title={a.title}>
                {a.title.length > 30 ? `${a.title.substring(0, 30)}...` : a.title}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
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
        <h3 className="av-side__heading">Nuove uscite</h3>
        {latest.length > 0 ? renderList(latest) : <p className="av-side__empty">Nessuna nuova uscita trovata</p>}
      </section>
      <section className="av-side__section">
        <h3 className="av-side__heading">Tendenze</h3>
        {trending.length > 0 ? renderList(trending) : <p className="av-side__empty">Nessun anime in tendenza</p>}
      </section>
    </aside>
  );
}