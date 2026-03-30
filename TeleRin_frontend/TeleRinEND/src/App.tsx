import './App.css'
import Registrarse from './pages/registrarse.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './header.tsx';

function App() {
  return (
    <>
      <Header cosas={
        <button>Registrarse</button>
      } />
      <BrowserRouter>
        <Routes>
          <Route path="/registrarse" element={<Registrarse />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App
