import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css'
import HomePage from './pages/HomePage';
import HostPage from './pages/HostPage';
import PresentationPage from './pages/PresentationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/presentation" element={<PresentationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
