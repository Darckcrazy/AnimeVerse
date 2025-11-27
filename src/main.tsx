// Importa i moduli React necessari per il rendering e il routing
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Renderizza l'applicazione nel DOM
// StrictMode esegue controlli di sviluppo per verificare problemi potenziali
// BrowserRouter abilita il routing basato su URL
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
