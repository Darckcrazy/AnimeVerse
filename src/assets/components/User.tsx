import { useState, useEffect, ChangeEvent } from 'react';
import { useList } from '../hooks/useList';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import './User.css';
import PersonalizedRecommendations from './PersonalizedRecommendations';

export default function User() {
  const { isLoggedIn, user, logout, token, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'collection' | 'lists' | 'activity' | 'preferences'>('collection');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    watchlist,
    readlist,
    loading: listLoading,
    error: listError,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistStatus,
    addToReadlist,
    removeFromReadlist,
    updateReadlistStatus,
    isInWatchlist,
    isInReadlist
  } = useList();

  useEffect(() => {
    if (user?.favoriteGenres) setFavoriteGenres(user.favoriteGenres);
  }, [user]);

  if (!isLoggedIn) {
    return (
      <main className="av-user-page">
        <div className="av-user-container container">
          <div className="av-user-auth">
            <div className="av-user-auth__content">
              <div className="av-user-auth__icon">
                <i className="bi bi-person-circle"></i>
              </div>
              <h2>Accedi al tuo profilo</h2>
              <p>Crea una collezione personale, salva i tuoi preferiti e unisciti alla community.</p>
              <div className="av-user-auth__buttons">
                <button className="av-btn av-btn--primary" onClick={() => navigate('/login')}>
                  Accedi
                </button>
                <button className="av-btn av-btn--secondary" onClick={() => navigate('/signup')}>
                  Registrati
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const allGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Thriller'];

  const handleGenreChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setFavoriteGenres((prev) => [...prev, value]);
    } else {
      setFavoriteGenres((prev) => prev.filter((genre) => genre !== value));
    }
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarFile(event.target.files[0]);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      await fetch(`${(process as any).env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/utenti/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: user.password,
          favoriteGenres: favoriteGenres,
        }),
      }).then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        const userData = await res.json();
        setUser(userData);
        alert('Preferences saved successfully!');
      });
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!token || !avatarFile) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatarUrl', avatarFile);

      const response = await fetch(`${(process as any).env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/utenti/me/avatarUrl`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const userData = await response.json();
      setUser(userData);
      alert('Avatar uploaded successfully!');
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (watchlistId: number) => {
    if (!token) return;
    try {
      await removeFromWatchlist(token, watchlistId);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  const handleRemoveFromReadlist = async (readlistId: number) => {
    if (!token) return;
    try {
      await removeFromReadlist(token, readlistId);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  const handleWatchlistStatusChange = async (watchlistId: number, status: string) => {
    if (!token) return;
    try {
      await updateWatchlistStatus(token, watchlistId, status);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  const handleReadlistStatusChange = async (readlistId: number, status: string) => {
    if (!token) return;
    try {
      await updateReadlistStatus(token, readlistId, status);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  return (
    <main className="av-user-page">
      <div className="av-user-container container">

        <section className="av-user-header">
          <div className="av-user-header__profile">
            <div className="av-user-avatar">
              {user?.avatarURL ? (
                <img src={user.avatarURL} alt="Avatar" />
              ) : (
                <i className="bi bi-person-fill"></i>
              )}
              <input type="file" accept="image/jpeg,image/png" onChange={handleAvatarChange} />
              {avatarFile && (
                <button className="av-btn av-btn--small" onClick={handleAvatarUpload} disabled={loading}>
                  Upload Avatar
                </button>
              )}
            </div>
            <div className="av-user-header__info">
              <h1>{user?.username || 'Utente'}</h1>
              <p className="av-user-header__email">{user?.email || 'user@example.com'}</p>
              <p className="av-user-header__joined">Membro dal 2024</p>
            </div>
          </div>
        </section>

        <section className="av-user-nav">
          <button className={`av-tab-btn ${activeTab === 'collection' ? 'active' : ''}`} onClick={() => setActiveTab('collection')}>
            Collection
          </button>
          <button className={`av-tab-btn ${activeTab === 'lists' ? 'active' : ''}`} onClick={() => setActiveTab('lists')}>
            Watchlist / Readlist
          </button>
          <button className={`av-tab-btn ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
            Activity
          </button>
          <button className={`av-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`} onClick={() => setActiveTab('preferences')}>
            Preferences
          </button>
        </section>

        {activeTab === 'collection' && (
          <section className="av-user-collection">
            <h2>Your Collection</h2>
            <p>Collection UI can be implemented here.</p>
          </section>
        )}

        {activeTab === 'lists' && (
          <section className="av-user-lists">
            <h2>Watchlist</h2>
            {listLoading && <p>Loading watchlist...</p>}
            {listError && <p className="av-error">{listError}</p>}
            {watchlist.length === 0 && !listLoading && <p>No items in the watchlist.</p>}
            <ul className="av-item-list">
              {watchlist.map((item) => (
                <li key={item.watchlistId} className="av-item">
                  <span>{item.animeTitolo}</span>
                  <select
                    value={item.status}
                    onChange={(e) => handleWatchlistStatusChange(item.watchlistId, e.target.value)}
                  >
                    <option value="Plan to Watch">Plan to Watch</option>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                  <button className="av-btn av-btn--small av-btn--danger" onClick={() => handleRemoveFromWatchlist(item.watchlistId)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <h2>Readlist</h2>
            {listLoading && <p>Loading readlist...</p>}
            {listError && <p className="av-error">{listError}</p>}
            {readlist.length === 0 && !listLoading && <p>No items in the readlist.</p>}
            <ul className="av-item-list">
              {readlist.map((item) => (
                <li key={item.readlistId} className="av-item">
                  <span>{item.mangaTitolo}</span>
                  <select
                    value={item.status}
                    onChange={(e) => handleReadlistStatusChange(item.readlistId, e.target.value)}
                  >
                    <option value="Plan to Read">Plan to Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                  <button className="av-btn av-btn--small av-btn--danger" onClick={() => handleRemoveFromReadlist(item.readlistId)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeTab === 'activity' && (
          <section className="av-user-activity">
            <h2>Activity</h2>
            <p>This section can display user activity such as reviews, ratings, comments, etc.</p>
          </section>
        )}

        {activeTab === 'preferences' && (
          <section className="av-user-preferences">
            <h2>Preferenze Utente</h2>
            <form>
              {allGenres.map((genre) => (
                <label key={genre}>
                  <input
                    type="checkbox"
                    value={genre}
                    checked={favoriteGenres.includes(genre)}
                    onChange={handleGenreChange}
                  />
                  {genre}
                </label>
              ))}
              <br />
              <button type="button" className="av-btn av-btn--primary" onClick={handleSavePreferences} disabled={loading}>
                Salva Preferenze
              </button>
            </form>
            {error && <p className="av-error">{error}</p>}
          </section>
        )}

        <PersonalizedRecommendations />

        <section className="av-user-actions">
          <button
            className="av-btn av-btn--logout"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </button>
        </section>
      </div>
    </main>
  );
}
