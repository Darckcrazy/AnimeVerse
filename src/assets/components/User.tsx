import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import { apiService } from '../services/api';
import './User.css';
import PersonalizedRecommendations from './PersonalizedRecommendations';

interface UserFormData {
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  favoriteGenres: string[];
}

export default function User() {
  const { isLoggedIn, user, logout, token, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'collection' | 'activity' | 'preferences'>('collection');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    favoriteGenres: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        favoriteGenres: user.favoriteGenres || []
      });
      
      if (user.avatarURL) {
        setAvatarPreview(user.avatarURL);
      }
    }
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      favoriteGenres: checked
        ? [...prev.favoriteGenres, value]
        : prev.favoriteGenres.filter(genre => genre !== value)
    }));
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePreferences = async () => {
    if (!token || !user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update user profile
      const updatedUser = await apiService.updateUserProfile(token, {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        favoriteGenres: formData.favoriteGenres
      });

      // Upload avatar if a new one was selected
      if (avatarFile) {
        const { avatarURL } = await apiService.uploadProfilePicture(token, avatarFile);
        updatedUser.avatarURL = avatarURL;
      }

      setUser(updatedUser);
      setSuccess('Profilo aggiornato con successo!');
      
      // Reset avatar file state after successful upload
      setAvatarFile(null);
      
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Si è verificato un errore durante il salvataggio';
      setError(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="av-user-page">
      <div className="av-user-container container">

        <section className="av-user-header">
          <div className="av-user-header__profile">
            <div className="av-user-avatar">
              <div className="avatar-container">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar" 
                    className="profile-avatar"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <i className="bi bi-person-fill"></i>
                  </div>
                )}
                <div className="avatar-upload-overlay">
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp" 
                    onChange={handleAvatarChange} 
                    className="av-avatar-upload"
                    id="avatar-upload"
                    disabled={loading}
                  />
                  <label htmlFor="avatar-upload" className="av-avatar-upload-label">
                    <i className="bi bi-camera-fill"></i>
                  </label>
                </div>
              </div>
              {avatarFile && (
                <p className="avatar-filename">{avatarFile.name}</p>
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


        {activeTab === 'activity' && (
          <section className="av-user-activity">
            <h2>Activity</h2>
            <p>This section can display user activity such as reviews, ratings, comments, etc.</p>
          </section>
        )}

        {activeTab === 'preferences' && (
          <section className="av-user-preferences">
            <h2>Impostazioni Profilo</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form onSubmit={(e) => { e.preventDefault(); handleSavePreferences(); }}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="form-control"
                  rows={3}
                  placeholder="Raccontaci qualcosa di te..."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Località</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Dove vivi?"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="website">Sito Web</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="https://esempio.com"
                />
              </div>
              
              <div className="form-group">
                <label>Generi Preferiti</label>
                <div className="genres-grid">
                  {allGenres.map((genre) => (
                    <label key={genre} className="genre-checkbox">
                      <input
                        type="checkbox"
                        value={genre}
                        checked={formData.favoriteGenres.includes(genre)}
                        onChange={handleGenreChange}
                      />
                      <span>{genre}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="av-btn av-btn--primary" 
                  disabled={loading}
                >
                  {loading ? 'Salvataggio in corso...' : 'Salva Modifiche'}
                </button>
              </div>
            </form>
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
