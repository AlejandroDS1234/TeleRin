import './App.css'
import RutasIngresar from './rutas/rutasIngresar.tsx';

function App() {
  return (
    <>
      <div className="min-h-screen bg-[#f5f1e8] relative">
        <div className="absolute inset-0 bg-[url('./assets/imagenes/texturas/ruido.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10">
          <RutasIngresar />
        </div>
      </div>
    </>
  );
};

export default App
