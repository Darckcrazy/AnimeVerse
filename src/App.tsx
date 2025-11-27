// Importa lo stile CSS per l'app
import './App.css'
// Importa tutti i componenti principali dell'applicazione
import NavBar from './assets/components/NavBar';
import Home from './assets/components/Home';
import Anime from './assets/components/Anime';
import Manga from './assets/components/Manga';
import MangaDetail from './assets/components/MangaDetail';
import AnimeDetail from './assets/components/AnimeDetail';
import Community from './assets/components/Community';
import About from './assets/components/About';
import User from './assets/components/User';
import Watchlist from './assets/components/Watchlist';
import Recommendations from './assets/components/Recommendations';
import Login from './assets/components/Login';
import Signup from './assets/components/Signup';
// Importa il routing di React Router
import { Routes, Route } from 'react-router-dom';
// Importa i provider di contesto per autenticazione e gestione liste
import { AuthProvider } from './assets/context/AuthProvider';
import { ListProvider } from './assets/context/ListContext';
// Importa l'hook personalizzato per l'autenticazione
import { useAuth } from './assets/hooks/useAuthContext';

// Componente che contiene il contenuto principale dell'app
function AppContent() {
  // Ottiene il token di autenticazione dal contesto
  const { token } = useAuth();

  return (
    <>
      {/* Provider per la gestione delle liste, passa il token come prop */}
      <ListProvider token={token}>
        {/* Barra di navigazione */}
        <NavBar />
        {/* Definisce le rotte dell'applicazione */}
        <Routes>
          {/* Rotta homepage */}
          <Route path="/" element={<Home />} />
          {/* Rotte per anime */}
          <Route path="/anime" element={<Anime />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          {/* Rotte per manga */}
          <Route path="/manga" element={<Manga />} />
          <Route path="/manga/:id" element={<MangaDetail />} />
          {/* Rotte comunità e info */}
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          {/* Rotte utente */}
          <Route path="/user" element={<User />} />
          <Route path="/watchlist" element={<Watchlist />} />
          {/* Rotte raccomandazioni e autenticazione */}
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </ListProvider>
    </>
  )
}

// Componente App principale che avvolge tutto con il provider di autenticazione
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

// Esporta il componente App come default
export default App
