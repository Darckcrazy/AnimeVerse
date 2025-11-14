import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        // Pubblicazioni in corso (simile a "nuove uscite")
        const latestRes = await fetch('https://api.jikan.moe/v4/top/manga?filter=publishing&limit=8', {
          signal: controller.signal,
        });
        const latestJson = await latestRes.json();
        setLatest(Array.isArray(latestJson?.data) ? latestJson.data : []);

        // Tendenze: top manga generali
        const trendRes = await fetch('https://api.jikan.moe/v4/top/manga?limit=8', {
          signal: controller.signal,
        });
        const trendJson = await trendRes.json();
        setTrending(Array.isArray(trendJson?.data) ? trendJson.data : []);
      } catch {
        // ignore, sections will render empty
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

  return (
    <aside className="av-sidebar">
      <section className="av-side__section">
        <h5>In pubblicazione</h5>
        {renderList(latest)}
      </section>
      <section className="av-side__section">
        <h5>Tendenze</h5>
        {renderList(trending)}
      </section>
    </aside>
  );
}