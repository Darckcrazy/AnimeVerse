import './App.css'
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
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './assets/context/AuthProvider';
import { ListProvider } from './assets/context/ListContext';
import { useAuth } from './assets/hooks/useAuthContext';

function AppContent() {
  const { token } = useAuth();

  return (
    <>
      <ListProvider token={token}>
        <NavBar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/manga" element={<Manga />} />
        <Route path="/manga/:id" element={<MangaDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/user" element={<User />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </ListProvider>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
