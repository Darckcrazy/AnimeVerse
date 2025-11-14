import './About.css';

export default function About() {
  return (
    <main className="av-about">
      <section className="av-hero container">
        <h1 className="av-hero__title">
          About <span>AnimeVerse</span>
        </h1>
        <p className="av-hero__subtitle">
          Scopri di più sul nostro progetto dedicato agli appassionati di anime e manga.
        </p>
      </section>

      <section className="av-content container">
        <div className="av-section">
          <h2>La Nostra Missione</h2>
          <p>
            AnimeVerse è una piattaforma dedicata agli amanti degli anime e manga, creata per offrire un'esperienza unica e immersiva nel mondo dell'animazione giapponese. Il nostro obiettivo è fornire un luogo dove gli appassionati possono scoprire, collezionare e discutere i migliori contenuti.
          </p>
        </div>

        <div className="av-section">
          <h2>Caratteristiche Principali</h2>
          <div className="av-features">
            <div className="av-feature">
              <div className="av-feature__icon">
                <i className="bi bi-film"></i>
              </div>
              <h3>Catalogo Anime</h3>
              <p>Catalogo pulito e organizzato con schede dettagliate, trailer e liste personali.</p>
            </div>
            <div className="av-feature">
              <div className="av-feature__icon">
                <i className="bi bi-book"></i>
              </div>
              <h3>Collezione Manga</h3>
              <p>Capitoli, volumi e collezioni con una UI cristallina e intuitiva.</p>
            </div>
            <div className="av-feature">
              <div className="av-feature__icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <h3>Community</h3>
              <p>Forum e discussioni tra appassionati per condividere opinioni e scoperte.</p>
            </div>
          </div>
        </div>

        <div className="av-section">
          <h2>Tecnologie Utilizzate</h2>
          <p>
            AnimeVerse è costruito con le più moderne tecnologie web per garantire prestazioni ottimali e un'esperienza utente eccezionale. Utilizziamo React per l'interfaccia utente, TypeScript per la sicurezza del codice, e Tailwind CSS per uno styling elegante e responsivo.
          </p>
        </div>

        <div className="av-section">
          <h2>Contatti</h2>
          <p>
            Hai domande o suggerimenti? Non esitare a contattarci. Siamo sempre felici di ricevere feedback dalla nostra community.
          </p>
        </div>
      </section>

      <footer className="av-footer container">
        <small>© {new Date().getFullYear()} AnimeVerse</small>
      </footer>
    </main>
  );
}
