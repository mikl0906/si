import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import PresentationPage from './pages/PresentationPage.tsx'
import HostPage from './pages/HostPage.tsx'
import { PresentationProvider } from './context/PresentationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PresentationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/presentation" element={<PresentationPage />} />
        </Routes>
      </BrowserRouter>
    </PresentationProvider>
  </StrictMode>,
)
