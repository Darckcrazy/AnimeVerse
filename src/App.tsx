import './App.css'
import NavBar from './assets/components/NavBar';
import Home from './assets/components/Home';
import Anime from './assets/components/Anime';
import AnimeDetail from './assets/components/AnimeDetail';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
       </Routes>
    </>
  )
}

export default App
