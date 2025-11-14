import './NavBar.css'
import logo from '../AnimeVerse.png';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';


type NavLink = {
    label: string;
    href: string;
    iconClass: string;
  };
  
  const navLinks: NavLink[] = [
    { label: 'Anime', href: '/anime', iconClass: 'bi-film' },
    { label: 'Manga', href: '/manga', iconClass: 'bi-book' },
    { label: 'About', href: '#', iconClass: 'bi-info-circle' },
    { label: 'Profile', href: '#', iconClass: 'bi-person' },
  ];
  
  export default function NavBar() {
    const emailRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  
    useEffect(() => {
      const modalEl = modalRef.current;
      if (!modalEl) return;
      const handler = () => {
        // focus il primo campo quando il modal è visibile
        emailRef.current?.focus();
      };
      modalEl.addEventListener('shown.bs.modal', handler as EventListener);
      return () => {
        modalEl.removeEventListener('shown.bs.modal', handler as EventListener);
      };
    }, []);
  
  
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
                  {link.label === 'Profile' ? (
                    <a
                      className="nav-link d-flex align-items-center gap-1"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#authModal"
                      onClick={(e) => {
                        e.preventDefault();
                        setAuthMode('signup');
                      }}
                    >
                      <i className={`bi ${link.iconClass}`}></i>
                      <span>{link.label}</span>
                    </a>
                  ) : (
                    <Link className="nav-link d-flex align-items-center gap-1" to={link.href}>
                      <i className={`bi ${link.iconClass}`}></i>
                      <span>{link.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
  
          </div>
        </div>
      </nav>
      {/* Modal Registrazione/Login (fuori dalla navbar per evitare stacking/z-index issues) */}
      <div ref={modalRef} className="modal fade" id="authModal" tabIndex={-1} aria-labelledby="authModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-light border-secondary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title" id="authModalLabel">{authMode === 'signup' ? 'Crea un account' : 'Accedi al account'}</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label htmlFor="signupEmail" className="form-label">Email</label>
                  <input
                    ref={emailRef}
                    type="email"
                    className="form-control bg-black text-light border-secondary"
                    id="signupEmail"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control bg-black text-light border-secondary"
                    id="signupPassword"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">{authMode === 'signup' ? 'Registrati' : 'Accedi'}</button>
              </form>
            </div>
            <div className="modal-footer border-secondary d-flex justify-content-between">
              {authMode === 'signup' ? (
                <>
                  <small className="text-secondary">Hai già un account?</small>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setAuthMode('login')}>Accedi</button>
                </>
              ) : (
                <>
                  <small className="text-secondary">Nuovo su AnimeVerse?</small>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setAuthMode('signup')}>Registrati</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }