// Importa l'hook useState di React per gestire lo stato locale
import { useState } from 'react';
// Importa l'hook personalizzato per l'autenticazione
import { useAuth } from '../hooks/useAuthContext';
// Importa l'hook di React Router per la navigazione
import { useNavigate } from 'react-router-dom';
// Importa lo stile CSS della pagina Signup
import './Signup.css';

// Componente della pagina di registrazione
export default function Signup() {
  // State per l'username inserito
  const [username, setUsername] = useState('');
  // State per l'email inserita
  const [email, setEmail] = useState('');
  // State per la password inserita
  const [password, setPassword] = useState('');
  // State per la conferma della password
  const [confirmPassword, setConfirmPassword] = useState('');
  // State per controllare se mostrare la password in chiaro
  const [showPassword, setShowPassword] = useState(false);
  // State per controllare se mostrare la conferma password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State per il checkbox di accettazione dei termini
  const [agreeTerms, setAgreeTerms] = useState(false);
  // Ottiene la funzione di signup, loading e error dal contesto
  const { signup, loading, error } = useAuth();
  // Hook per navigare tra le pagine
  const navigate = useNavigate();

  // Funzione per gestire l'invio del form di registrazione
  const handleSubmit = async (e: React.FormEvent) => {
    // Previene il comportamento di default del form
    e.preventDefault();

    // Controlla che le password coincidano
    if (password !== confirmPassword) {
      alert('Le password non coincidono');
      return;
    }

    // Controlla che l'utente abbia accettato i termini di servizio
    if (!agreeTerms) {
      alert('Devi accettare i termini di servizio');
      return;
    }

    try {
      // Effettua la registrazione con i dati inseriti
      await signup(username, email, password);
      // Naviga alla pagina del profilo utente
      navigate('/user');
    } catch {
      // Gli errori vengono gestiti dal contesto di autenticazione
    }
  };

  // Renderizza la pagina di registrazione
  return (
    <main className="av-auth-page">
      <div className="av-auth-container">
        <div className="av-auth-card">
          {/* Header con titolo e sottotitolo */}
          <div className="av-auth-header">
            <h1>Unisciti a AnimeVerse</h1>
            <p>Crea il tuo account e scopri una community di appassionati anime</p>
          </div>

          {/* Messaggio di errore se presente */}
          {error && <div className="av-error-message">{error}</div>}

          {/* Form di registrazione */}
          <form onSubmit={handleSubmit} className="av-auth-form">
            {/* Campo username */}
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

            {/* Campo password con toggle */}
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

            {/* Campo conferma password */}
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
                {/* Pulsante per toggleare la visibilità della conferma password */}
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

            {/* Checkbox per accettare i termini di servizio */}
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

            {/* Pulsante di submit */}
            <button
              type="submit"
              className="av-btn av-btn--primary av-btn--full"
              disabled={loading}
            >
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </button>
          </form>

          {/* Footer con link al login */}
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
