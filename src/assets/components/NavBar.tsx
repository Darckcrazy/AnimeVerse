// Importa lo stile CSS della barra di navigazione
import './NavBar.css'
// Importa il logo dell'applicazione
import logo from '../AnimeVerse.png';
// Importa gli hook di React Router per la navigazione
import { Link, useNavigate } from 'react-router-dom';
// Importa l'hook personalizzato per l'autenticazione
import { useAuth } from '../hooks/useAuthContext';

// Tipo per i link della navigazione
type NavLink = {
    label: string;    // Testo del link
    href: string;     // URL del link
    iconClass: string; // Classe dell'icona Bootstrap
  };
  
  // Array di link principali della navigazione
  const navLinks: NavLink[] = [
    { label: 'Anime', href: '/anime', iconClass: 'bi-film' },
    { label: 'Manga', href: '/manga', iconClass: 'bi-book' },
    { label: 'Raccomandazioni', href: '/recommendations', iconClass: 'bi-fire' },
    { label: 'Watchlist', href: '/watchlist', iconClass: 'bi-bookmark' },
    { label: 'About', href: '/about', iconClass: 'bi-info-circle' },
  ];
  
  // Componente della barra di navigazione
  export default function NavBar() {
    // Ottiene i dati di autenticazione e la funzione di logout dal contesto
    const { isLoggedIn, user, logout } = useAuth();
    // Hook per navigare tra le pagine
    const navigate = useNavigate();

    // Funzione per gestire il logout
    const handleLogout = () => {
      // Effettua il logout
      logout();
      // Naviga alla home
      navigate('/');
    };
  
  
    // Renderizza la barra di navigazione Bootstrap
    return (
      <>
      {/* Barra di navigazione fissa con sfondo nero */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
        <div className="container-fluid px-4">
          {/* Logo di AnimeVerse che linka alla home */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="AnimeVerse logo" className="me-2" />
          </Link>
  
          {/* Pulsante per il toggle del menu su schermi piccoli */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
  
          {/* Menu di navigazione collapsibile */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
  
  
            {/* Lista dei link di navigazione */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-4">
              {/* Renderizza i link principali dalla lista navLinks */}
              {navLinks.map((link) => (
                <li key={link.label} className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-1" to={link.href}>
                    {/* Icona del link */}
                    <i className={`bi ${link.iconClass}`}></i>
                    {/* Testo del link */}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              
              {/* Se l'utente è loggato, mostra il profilo e il logout */}
              {isLoggedIn ? (
                <>
                  {/* Link al profilo utente */}
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-1" to="/user">
                      <i className="bi bi-person"></i>
                      <span>{user?.username || 'Profile'}</span>
                    </Link>
                  </li>
                  {/* Pulsante di logout */}
                  <li className="nav-item">
                    <button 
                      className="nav-link btn btn-link d-flex align-items-center gap-1" 
                      onClick={handleLogout}
                      style={{ color: 'inherit', textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                {/* Se l'utente non è loggato, mostra i link di login e registrazione */}
                <>
                  {/* Link al login */}
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-1" to="/login">
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Accedi</span>
                    </Link>
                  </li>
                  {/* Link alla registrazione */}
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-1" to="/signup">
                      <i className="bi bi-person-plus"></i>
                      <span>Registrati</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
  
          </div>
        </div>
      </nav>
      </>
    );
  }