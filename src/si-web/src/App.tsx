import { useNavigate } from 'react-router';
import './App.css'

function App() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Своя игра</h1>
      <button onClick={() => navigate("/host")}>
        Начать игру
      </button>
    </>
  )
}

export default App
