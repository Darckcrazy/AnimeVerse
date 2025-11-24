import './NavBar.css'
import logo from '../AnimeVerse.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';


type NavLink = {
    label: string;
    href: string;
    iconClass: string;
  };
  
  const navLinks: NavLink[] = [
    { label: 'Anime', href: '/anime', iconClass: 'bi-film' },
    { label: 'Manga', href: '/manga', iconClass: 'bi-book' },
    { label: 'Raccomandazioni', href: '/recommendations', iconClass: 'bi-fire' },
    { label: 'Watchlist', href: '/watchlist', iconClass: 'bi-bookmark' },
    { label: 'About', href: '/about', iconClass: 'bi-info-circle' },
  ];
  
  export default function NavBar() {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/');
    };
  
  
    return (
      <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="AnimeVerse logo" className="me-2" />
          </Link>
  
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
  
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
  
  
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-4">
              {navLinks.map((link) => (
                <li key={link.label} className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-1" to={link.href}>
                    <i className={`bi ${link.iconClass}`}></i>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-1" to="/user">
                      <i className="bi bi-person"></i>
                      <span>{user?.username || 'Profile'}</span>
                    </Link>
                  </li>
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
                <>
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-1" to="/login">
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Accedi</span>
                    </Link>
                  </li>
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