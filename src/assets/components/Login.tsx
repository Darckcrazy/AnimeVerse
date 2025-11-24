import { useState } from 'react';
import { useAuth } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
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
            <h1>Accedi a AnimeVerse</h1>
            <p>Entra nel tuo account per continuare</p>
          </div>

          {error && <div className="av-error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="av-auth-form">
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

            <button
              type="submit"
              className="av-btn av-btn--primary av-btn--full"
              disabled={loading}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>

          <div className="av-auth-footer">
            <p>
              Non hai un account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="av-link-btn"
              >
                Registrati
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
