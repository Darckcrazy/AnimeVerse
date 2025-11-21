import { useState } from 'react';
import './User.css';

export default function User() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'collection' | 'lists' | 'activity'>('collection');

  const userProfile = {
    username: 'AnimeEnthusiast',
    email: 'user@example.com',
    joinDate: '2024',
    favoriteGenre: 'Action',
    stats: {
      animeWatched: 42,
      mangaRead: 15,
      favorites: 28,
      followers: 156,
    },
  };

  const userCollections = [
    { title: 'Top Anime of 2024', count: 12 },
    { title: 'Manga Favorites', count: 8 },
    { title: 'Must Watch Later', count: 23 },
  ];

  const userLists = [
    {
      id: 1,
      name: 'Spring 2024 Anime',
      items: 15,
      description: 'Best anime from Spring 2024 season',
    },
    {
      id: 2,
      name: 'Underrated Gems',
      items: 9,
      description: 'Hidden treasures worth watching',
    },
  ];

  return (
    <main className="av-user-page">
      <div className="av-user-container container">
        {!isLoggedIn ? (
          <div className="av-user-auth">
            <div className="av-user-auth__content">
              <div className="av-user-auth__icon">
                <i className="bi bi-person-circle"></i>
              </div>
              <h2>Accedi al tuo profilo</h2>
              <p>Crea una collezione personale, salva i tuoi preferiti e unisciti alla community.</p>
              <div className="av-user-auth__buttons">
                <button
                  className="av-btn av-btn--primary"
                  onClick={() => setIsLoggedIn(true)}
                >
                  Accedi
                </button>
                <button
                  className="av-btn av-btn--secondary"
                  onClick={() => setIsLoggedIn(true)}
                >
                  Registrati
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <section className="av-user-header">
              <div className="av-user-header__profile">
                <div className="av-user-avatar">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div className="av-user-header__info">
                  <h1>{userProfile.username}</h1>
                  <p className="av-user-header__email">{userProfile.email}</p>
                  <p className="av-user-header__joined">Membro da {userProfile.joinDate}</p>
                </div>
              </div>
            </section>

            <section className="av-user-stats">
              <div className="av-stat-card">
                <span className="av-stat-label">Anime guardati</span>
                <span className="av-stat-value">{userProfile.stats.animeWatched}</span>
              </div>
              <div className="av-stat-card">
                <span className="av-stat-label">Manga letti</span>
                <span className="av-stat-value">{userProfile.stats.mangaRead}</span>
              </div>
              <div className="av-stat-card">
                <span className="av-stat-label">Preferiti</span>
                <span className="av-stat-value">{userProfile.stats.favorites}</span>
              </div>
              <div className="av-stat-card">
                <span className="av-stat-label">Follower</span>
                <span className="av-stat-value">{userProfile.stats.followers}</span>
              </div>
            </section>

            <section className="av-user-collections">
              <h2>Le tue collezioni</h2>
              <div className="av-collections-grid">
                {userCollections.map((collection, index) => (
                  <div key={index} className="av-collection-card">
                    <div className="av-collection-card__icon">
                      <i className="bi bi-bookmark-fill"></i>
                    </div>
                    <h3>{collection.title}</h3>
                    <p className="av-collection-card__count">{collection.count} elementi</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="av-user-lists">
              <div className="av-lists-header">
                <h2>Le tue liste</h2>
                <button className="av-btn av-btn--small">+ Nuova lista</button>
              </div>

              <div className="av-tabs">
                <button
                  className={`av-tab ${activeTab === 'collection' ? 'av-tab--active' : ''}`}
                  onClick={() => setActiveTab('collection')}
                >
                  Collezione
                </button>
                <button
                  className={`av-tab ${activeTab === 'lists' ? 'av-tab--active' : ''}`}
                  onClick={() => setActiveTab('lists')}
                >
                  Liste personali
                </button>
                <button
                  className={`av-tab ${activeTab === 'activity' ? 'av-tab--active' : ''}`}
                  onClick={() => setActiveTab('activity')}
                >
                  Attività
                </button>
              </div>

              {activeTab === 'lists' && (
                <div className="av-lists-container">
                  {userLists.map((list) => (
                    <div key={list.id} className="av-list-card">
                      <div className="av-list-card__header">
                        <h3>{list.name}</h3>
                        <span className="av-list-card__count">{list.items} elementi</span>
                      </div>
                      <p className="av-list-card__description">{list.description}</p>
                      <button className="av-btn av-btn--outline">Visualizza lista</button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'collection' && (
                <div className="av-collection-empty">
                  <i className="bi bi-inbox"></i>
                  <p>La tua collezione è vuota</p>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="av-activity-empty">
                  <i className="bi bi-clock-history"></i>
                  <p>Nessuna attività recente</p>
                </div>
              )}
            </section>

            <section className="av-user-actions">
              <button
                className="av-btn av-btn--logout"
                onClick={() => setIsLoggedIn(false)}
              >
                Logout
              </button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
