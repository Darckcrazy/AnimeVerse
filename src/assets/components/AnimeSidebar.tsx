import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        // Nuove uscite: stagione corrente
        const latestRes = await fetch('https://api.jikan.moe/v4/seasons/now?limit=8', {
          signal: controller.signal,
        });
        const latestJson = await latestRes.json();
        setLatest(Array.isArray(latestJson?.data) ? latestJson.data : []);

        // Tendenze: top anime in airing (in onda)
        const trendRes = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=8', {
          signal: controller.signal,
        });
        const trendJson = await trendRes.json();
        setTrending(Array.isArray(trendJson?.data) ? trendJson.data : []);
      } catch {
        // UI later will just show empty sections if it fails
      }
    };
    run();
    return () => controller.abort();
  }, []);

  const renderList = (items: SimpleAnime[]) => (
    <ul className="av-side__list">
      {items.map((a) => {
        const img =
          a.images?.webp?.image_url ||
          a.images?.jpg?.image_url ||
          'https://via.placeholder.com/64x90?text=Anime';
        return (
          <li key={a.mal_id} className="av-side__item">
            <Link to={`/anime/${a.mal_id}`} className="av-side__link">
              <img src={img} alt={a.title} loading="lazy" />
              <span title={a.title}>{a.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="av-sidebar">
      <section className="av-side__section">
        <h5>Nuove uscite</h5>
        {renderList(latest)}
      </section>
      <section className="av-side__section">
        <h5>Tendenze</h5>
        {renderList(trending)}
      </section>
    </aside>
  );
}