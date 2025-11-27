// Importa i componenti di React Router
import { Link } from 'react-router-dom';
// Importa lo stile CSS della pagina Home
import './Home.css';
// Importa il componente delle raccomandazioni
import RecommendationsSection from './RecommendationsSection';

// Componente della pagina Home - Landing page principale dell'applicazione
export default function Home() {
  return (
    <main className="av-landing">
      {/* Sezione hero con il titolo e il sottotitolo dell'applicazione */}
      <section className="av-hero container">
        <h1 className="av-hero__title">
          Anime<span>Verse</span>
        </h1>
        <p className="av-hero__subtitle">
          Scopri, colleziona e discuti i migliori anime e manga con uno stile
          minimal, veloce e futuristico.
        </p>
      </section>

      {/* Sezione con i pannelli principali per esplorare anime, manga e community */}
      <section id="explore" className="av-panels container">
        {/* Pannello per gli anime */}
        <article className="av-panel av-panel--anime">
          <div className="av-panel__icon">
            <i className="bi bi-film"></i>
          </div>
          <h3>Anime</h3>
          <p>Catalogo pulito, schede eleganti, trailer e liste personali.</p>
          <Link className="av-chip" to="/anime">
            <span>Esplora</span>
            <i className="bi bi-arrow-right-short"></i>
          </Link>
        </article>
        {/* Pannello per i manga */}
        <article className="av-panel av-panel--manga">
          <div className="av-panel__icon">
            <i className="bi bi-book"></i>
          </div>
          <h3>Manga</h3>
          <p>Capitoli, volumi e collezioni con una UI cristallina.</p>
          <Link className="av-chip" to="/manga">
            <span>Scopri</span>
            <i className="bi bi-arrow-right-short"></i>
          </Link>
        </article>
        {/* Pannello per la community */}
        <article id="trending" className="av-panel av-panel--discover">
          <div className="av-panel__icon">
            <i className="bi bi-people-fill"></i>
          </div>
          <h3>Community</h3>
          <p>Forum e discussioni tra appassionati.</p>
          <Link className="av-chip" to="/community">
            <span>Vedi ora</span>
            <i className="bi bi-arrow-right-short"></i>
          </Link>
        </article>
      </section>

      {/* Sezione con le raccomandazioni personalizzate */}
      <section className="av-recommendations-section container">
        <RecommendationsSection />
      </section>

      {/* Footer con il copyright */}
      <footer className="av-footer container">
        <small>© {new Date().getFullYear()} AnimeVerse</small>
      </footer>
    </main>
  );
}