import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css'
import HomePage from './pages/HomePage';
import HostPage from './pages/HostPage';
import PresentationPage from './pages/PresentationPage';
import NewGamePage from './pages/NewGamePage';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<NewGamePage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/presentation" element={<PresentationPage />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}

export default App
