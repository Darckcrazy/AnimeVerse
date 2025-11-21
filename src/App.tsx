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
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
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
      </Routes>
    </>
  )
}


export default App
