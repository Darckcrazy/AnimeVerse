import { useState } from 'react';
import { useAuth } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Le password non coincidono');
      return;
    }

    if (!agreeTerms) {
      alert('Devi accettare i termini di servizio');
      return;
    }

    try {
      await signup(username, email, password);
      navigate('/user');
    } catch {
      // Error is handled by context
    }
  };

  return (
    <main className="av-auth-page">
      <div className="av-auth-container">
        <div className="av-auth-card">
          <div className="av-auth-header">
            <h1>Unisciti a AnimeVerse</h1>
            <p>Crea il tuo account e scopri una community di appassionati anime</p>
          </div>

          {error && <div className="av-error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="av-auth-form">
            <div className="av-form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Il tuo username"
                required
                disabled={loading}
              />
            </div>

            <div className="av-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tuo@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="av-form-group">
              <label htmlFor="password">Password</label>
              <div className="av-password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="av-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="av-form-group">
              <label htmlFor="confirmPassword">Conferma Password</label>
              <div className="av-password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="av-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="av-form-group av-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                />
                <span>Accetto i termini di servizio e l'informativa sulla privacy</span>
              </label>
            </div>

            <button
              type="submit"
              className="av-btn av-btn--primary av-btn--full"
              disabled={loading}
            >
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </button>
          </form>

          <div className="av-auth-footer">
            <p>
              Hai già un account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="av-link-btn"
              >
                Accedi
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
