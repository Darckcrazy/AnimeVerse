// Importa l'hook useState di React per gestire lo stato locale
import { useState } from 'react';
// Importa l'hook personalizzato per l'autenticazione
import { useAuth } from '../hooks/useAuthContext';
// Importa l'hook di React Router per la navigazione
import { useNavigate } from 'react-router-dom';
// Importa lo stile CSS della pagina Login
import './Login.css';

// Componente della pagina di login
export default function Login() {
  // State per l'email inserita
  const [email, setEmail] = useState('');
  // State per la password inserita
  const [password, setPassword] = useState('');
  // State per controllare se mostrare la password in chiaro
  const [showPassword, setShowPassword] = useState(false);
  // Ottiene la funzione di login, loading e error dal contesto
  const { login, loading, error } = useAuth();
  // Hook per navigare tra le pagine
  const navigate = useNavigate();

  // Funzione per gestire l'invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    // Previene il comportamento di default del form
    e.preventDefault();
    try {
      // Effettua il login con le credenziali inserite
      await login(email, password);
      // Naviga alla pagina del profilo utente
      navigate('/user');
    } catch {
      // Gli errori vengono gestiti dal contesto di autenticazione
    }
  };

  // Renderizza la pagina di login
  return (
    <main className="av-auth-page">
      <div className="av-auth-container">
        <div className="av-auth-card">
          {/* Header con titolo e sottotitolo */}
          <div className="av-auth-header">
            <h1>Accedi a AnimeVerse</h1>
            <p>Entra nel tuo account per continuare</p>
          </div>

          {/* Messaggio di errore se presente */}
          {error && <div className="av-error-message">{error}</div>}

          {/* Form di login */}
          <form onSubmit={handleSubmit} className="av-auth-form">
            {/* Campo email */}
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

            {/* Campo password con toggle per mostrare/nascondere */}
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
                {/* Pulsante per toggleare la visibilità della password */}
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

            {/* Pulsante di submit */}
            <button
              type="submit"
              className="av-btn av-btn--primary av-btn--full"
              disabled={loading}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>

          {/* Footer con link a registrazione */}
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
