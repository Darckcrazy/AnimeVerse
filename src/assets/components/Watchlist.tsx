import { useState } from 'react';
import './Watchlist.css';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState<'anime' | 'manga'>('anime');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredItems = watchlist
    .filter((item) => {
      if (item.type !== activeTab) return false;
      if (filterStatus === 'all') return true;
      return item.status === filterStatus;
    })
    .sort((a, b) => b.id - a.id);

  const statusLabels: Record<string, string> = {
    watching: 'In corso',
    completed: 'Completato',
    'on-hold': 'In pausa',
    planning: 'Da guardare',
  };

  const statusIcons: Record<string, string> = {
    watching: 'bi-play-circle-fill',
    completed: 'bi-check-circle-fill',
    'on-hold': 'bi-pause-circle-fill',
    planning: 'bi-bookmark-fill',
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      watching: 'av-status--watching',
      completed: 'av-status--completed',
      'on-hold': 'av-status--on-hold',
      planning: 'av-status--planning',
    };
    return colors[status] || '';
  };

  return (
    <main className="av-watchlist-page">
      <div className="av-watchlist-container container">
        <section className="av-watchlist-header">
          <h1>{activeTab === 'anime' ? 'La mia Watchlist' : 'La mia Readlist'}</h1>
          <p>
            {activeTab === 'anime'
              ? 'Gestisci gli anime che stai guardando, hai completato o vuoi guardare'
              : 'Gestisci i manga che stai leggendo, hai completato o vuoi leggere'}
          </p>
        </section>

        <div className="av-watchlist-controls">
          <div className="av-tabs">
            <button
              className={`av-tab ${activeTab === 'anime' ? 'av-tab--active' : ''}`}
              onClick={() => setActiveTab('anime')}
            >
              <i className="bi bi-play-circle"></i> Anime
            </button>
            <button
              className={`av-tab ${activeTab === 'manga' ? 'av-tab--active' : ''}`}
              onClick={() => setActiveTab('manga')}
            >
              <i className="bi bi-book"></i> Manga
            </button>
          </div>

          <div className="av-filters">
            <select
              className="av-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tutti gli stati</option>
              <option value="watching">In corso</option>
              <option value="completed">Completato</option>
              <option value="on-hold">In pausa</option>
              <option value="planning">Da guardare</option>
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="av-watchlist-empty">
            <i className="bi bi-inbox"></i>
            <h2>Nessun elemento</h2>
            <p>
              {activeTab === 'anime'
                ? 'Non hai ancora aggiunto anime alla tua watchlist'
                : 'Non hai ancora aggiunto manga alla tua readlist'}
            </p>
            <Link to={`/${activeTab}`} className="av-btn av-btn--primary">
              Scopri {activeTab === 'anime' ? 'Anime' : 'Manga'}
            </Link>
          </div>
        ) : (
          <div className="av-watchlist-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="av-watchlist-card">
                <div className="av-watchlist-card__image">
                  <img src={item.image} alt={item.title} />
                  <div className={`av-status-badge ${getStatusColor(item.status)}`}>
                    <i className={`bi ${statusIcons[item.status]}`}></i>
                    <span>{statusLabels[item.status]}</span>
                  </div>
                  {item.score && (
                    <div className="av-score-badge">
                      <i className="bi bi-star-fill"></i>
                      <span>{item.score}</span>
                    </div>
                  )}
                </div>
                <div className="av-watchlist-card__content">
                  <h3>{item.title}</h3>
                  {item.progress && item.totalEpisodes && (
                    <div className="av-progress">
                      <div className="av-progress__bar">
                        <div
                          className="av-progress__fill"
                          style={{
                            width: `${(item.progress / item.totalEpisodes) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="av-progress__text">
                        {item.progress}/{item.totalEpisodes}
                      </span>
                    </div>
                  )}
                  <div className="av-watchlist-card__actions">
                    <button
                      className="av-btn av-btn--small av-btn--outline av-btn--danger"
                      onClick={() => removeFromWatchlist(item.id, item.type)}
                    >
                      <i className="bi bi-trash"></i> Rimuovi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="av-watchlist-stats">
          <h2>Statistiche</h2>
          <div className="av-stats-grid">
            <div className="av-stat-box">
              <span className="av-stat-label">In corso</span>
              <span className="av-stat-value">
                {watchlist.filter((i) => i.type === activeTab && i.status === 'watching').length}
              </span>
            </div>
            <div className="av-stat-box">
              <span className="av-stat-label">Completati</span>
              <span className="av-stat-value">
                {watchlist.filter((i) => i.type === activeTab && i.status === 'completed').length}
              </span>
            </div>
            <div className="av-stat-box">
              <span className="av-stat-label">Da guardare</span>
              <span className="av-stat-value">
                {watchlist.filter((i) => i.type === activeTab && i.status === 'planning').length}
              </span>
            </div>
            <div className="av-stat-box">
              <span className="av-stat-label">Media voto</span>
              <span className="av-stat-value">
                {watchlist
                  .filter((i) => i.type === activeTab && i.score)
                  .length > 0
                  ? (
                      watchlist
                        .filter((i) => i.type === activeTab && i.score)
                        .reduce((sum, i) => sum + (i.score || 0), 0) /
                      watchlist.filter((i) => i.type === activeTab && i.score).length
                    ).toFixed(1)
                  : '-'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
