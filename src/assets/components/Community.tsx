import './Community.css';
import { Link } from 'react-router-dom';

type Thread = {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  replies: number;
  lastActivity: string;
  tags: string[];
};

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  host: string;
  focus: string;
};

type Spotlight = {
  id: number;
  user: string;
  role: string;
  highlight: string;
  avatarColor: string;
};

const featuredThreads: Thread[] = [
  {
    id: 1,
    title: 'Teorie per la Parte 2 di Jujutsu Kaisen 2',
    category: 'Anime Talk',
    excerpt:
      'Che cosa significa davvero la tecnica di Yuta e come influenzerà i prossimi episodi? Condividi le tue ipotesi (senza spoiler del manga!).',
    replies: 127,
    lastActivity: '3h fa',
    tags: ['Spoiler-free', 'Teorie'],
  },
  {
    id: 2,
    title: 'Consigli manga brevi ma intensi',
    category: 'Suggerimenti',
    excerpt:
      'Cerco storie complete in pochi volumi, con un impatto emotivo forte. Cosa non devo assolutamente perdermi?',
    replies: 89,
    lastActivity: '1h fa',
    tags: ['Letture rapide', 'Manga'],
  },
  {
    id: 3,
    title: 'Watch party: Fullmetal Alchemist Brotherhood',
    category: 'Eventi',
    excerpt:
      'Questo sabato rivediamo gli episodi 45-50 insieme. Porta snack, opinioni e lacrime. Iscriviti per ricevere il link della stanza.',
    replies: 64,
    lastActivity: 'ieri',
    tags: ['Watch party', 'Anime classici'],
  },
];

const liveEvents: Event[] = [
  {
    id: 1,
    title: 'Club di lettura: Frieren',
    date: '15 NOV',
    time: '21:00 CET',
    host: '@Noelle',
    focus: 'Discussione capitoli 110-115',
  },
  {
    id: 2,
    title: 'Workshop fan-art digitali',
    date: '20 NOV',
    time: '18:30 CET',
    host: '@KitsuneLab',
    focus: 'Color grading + texture futuristiche',
  },
  {
    id: 3,
    title: 'Sessione Q&A con cosplayer',
    date: '23 NOV',
    time: '17:00 CET',
    host: '@Rin-chan',
    focus: 'Realizzare armature leggere',
  },
];

const communitySpotlight: Spotlight[] = [
  {
    id: 1,
    user: 'ShiroKami',
    role: 'Curatore AMV',
    highlight: 'Ha creato una compilation su Chainsaw Man con 10k upvote in 24h.',
    avatarColor: 'var(--av-primary)',
  },
  {
    id: 2,
    user: 'LunarSync',
    role: 'Top Contributor',
    highlight: 'Ha risposto a 30 thread con analisi dettagliate nell’ultima settimana.',
    avatarColor: 'var(--av-accent)',
  },
  {
    id: 3,
    user: 'MikaStudio',
    role: 'Artista in evidenza',
    highlight: 'Fan-art di Violet Evergarden selezionata per il banner del mese.',
    avatarColor: '#f97316',
  },
];

const guidelines = [
  'Mantieni i contenuti contrassegnati come spoiler utilizzando i tag appropriati.',
  'Supporta le tue teorie con fonti o esempi: aiuta tutti a seguire la discussione.',
  'Segnala contenuti tossici o spam: la moderazione è comunitaria.',
];

export default function Community() {
  return (
    <main className="av-community container">
      <header className="av-community__header">
        <div>
          <p className="av-community__eyebrow">Community Hub</p>
          <h1>Condividi, crea e vivi gli anime insieme agli altri fan</h1>
          <p className="av-community__subtitle">
            Thread tematici, watch party e spazi di confronto. Partecipa alle discussioni o crea la tua stanza
            in pochi click.
          </p>
          <div className="av-community__cta">
            <a
              className="btn btn-primary"
              href="https://discord.com/invite/anime"
              target="_blank"
              rel="noreferrer"
            >
              Entra sul nostro Discord
            </a>
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-toggle="modal"
              data-bs-target="#authModal"
            >
              Avvia una discussione
            </button>
          </div>
        </div>
      </header>

      <section className="av-community__grid">
        <div className="av-community__threads">
          <div className="av-community__section-header">
            <h2>Thread in evidenza</h2>
            <button type="button" className="av-community__link">
              Vedi tutto <i className="bi bi-arrow-right"></i>
            </button>
          </div>

          <div className="av-community__thread-list">
            {featuredThreads.map((thread) => (
              <article key={thread.id} className="av-community__thread-card">
                <header>
                  <span className="av-community__pill">{thread.category}</span>
                  <h3>{thread.title}</h3>
                </header>
                <p>{thread.excerpt}</p>
                <footer>
                  <ul className="av-community__taglist">
                    {thread.tags.map((tag) => (
                      <li key={tag} className="av-community__tag">
                        #{tag}
                      </li>
                    ))}
                  </ul>
                  <div className="av-community__thread-meta">
                    <span>
                      <i className="bi bi-chat-dots"></i> {thread.replies} risposte
                    </span>
                    <span>
                      <i className="bi bi-clock-history"></i> {thread.lastActivity}
                    </span>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <aside className="av-community__sidebar">
          <div className="av-community__card">
            <h2>Eventi live</h2>
            <ul className="av-community__event-list">
              {liveEvents.map((event) => (
                <li key={event.id} className="av-community__event">
                  <div className="av-community__event-date">
                    <span>{event.date}</span>
                    <span>{event.time}</span>
                  </div>
                  <div>
                    <h3>{event.title}</h3>
                    <p>{event.focus}</p>
                    <small>Host: {event.host}</small>
                  </div>
                  <button type="button" className="btn btn-sm btn-outline-secondary">
                    Ricordamelo
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="av-community__card">
            <h2>Guide rapide</h2>
            <div className="av-community__quicklinks">
              <Link to="/anime" className="av-community__quicklink">
                <i className="bi bi-stars"></i>
                <div>
                  <strong>Anime da iniziare ora</strong>
                  <span>Top stagionali curati dalla community</span>
                </div>
              </Link>
              <Link to="/manga" className="av-community__quicklink">
                <i className="bi bi-journal-richtext"></i>
                <div>
                  <strong>Manga completati in 5 volumi</strong>
                  <span>Perfetti per un binge-reading rapido</span>
                </div>
              </Link>
              <a
                href="https://myanimelist.net/forum/"
                target="_blank"
                rel="noreferrer"
                className="av-community__quicklink"
              >
                <i className="bi bi-megaphone"></i>
                <div>
                  <strong>Forum partner</strong>
                  <span>Collab con community internazionali</span>
                </div>
              </a>
            </div>
          </div>
        </aside>
      </section>

      <section className="av-community__spotlight">
        <header className="av-community__section-header">
          <h2>In evidenza questo mese</h2>
          <span className="av-community__eyebrow">Talenti & contributi</span>
        </header>

        <div className="av-community__spotlight-grid">
          {communitySpotlight.map((profile) => (
            <article key={profile.id} className="av-community__spotlight-card">
              <div className="av-community__avatar" style={{ background: profile.avatarColor }}>
                <i className="bi bi-emoji-smile"></i>
              </div>
              <div>
                <h3>{profile.user}</h3>
                <span className="av-community__pill">{profile.role}</span>
                <p>{profile.highlight}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="av-community__guidelines">
        <div className="av-community__card">
          <h2>Netiquette veloce</h2>
          <ul>
            {guidelines.map((rule) => (
              <li key={rule}>
                <i className="bi bi-shield-check"></i>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="av-community__card">
          <h2>Hai un progetto da mostrare?</h2>
          <p>
            Condividi fan-art, AMV, cosplay o recensioni approfondite. I contributi più apprezzati finiscono
            nella newsletter del venerdì.
          </p>
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#authModal"
          >
            Invia il tuo progetto
          </button>
        </div>
      </section>
    </main>
  );
}