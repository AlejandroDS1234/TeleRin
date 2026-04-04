import './App.css'
import RutasIngresar from './rutas/rutasIngresar.tsx';
import Sobrefondo from './sobrefondo.tsx';
import Boton_registro from './boton_registro.tsx';
import Boton_inicio_sesion from './boton_inicio_sesion.tsx';
import Boton_mas_de_nosotros from './boton_mas_de_nosotros.tsx';
import Header from './header.tsx';

function App() {
  return (
    <div className="relative min-h-screen bg-[var(--color-principal)]">

      {/* 1. SOBREFONDO */}
      <div className="absolute top-0 left-0 h-full w-full lg:w-2/3 z-10">
        <Sobrefondo />
      </div>

      {/* 2. BOTÓN DE REGISTRO (encima de todo) */}
      <div className="absolute top-2/5 right-1/8 h-1/2 w-1/2 lg:top-1/8 lg:right-1/10 lg:h-1/8 lg:w-1/8  z-40">
        <Boton_registro />
      </div>

      {/* 3. BOTÓN DE INICIO DE SESIÓN (encima de todo) */}
      <div className="absolute top-6/10 right-4/8 h-1/2 w-1/2 lg:top-4/10 lg:right-2/10 lg:h-1/8 lg:w-1/8  z-50">
        <Boton_inicio_sesion />
      </div>

      {/* 4. BOTÓN DE MÁS DE NOSOTROS (encima de todo) */}
      <div className="absolute top-8/10 right-1/8 h-1/2 w-1/2 lg:top-6/8 lg:right-1/10 lg:h-1/8 lg:w-1/8  z-60">
        <Boton_mas_de_nosotros />
      </div>

      {/* 2. CONTENIDO (encima de todo) */}
      <div className="min-h-screen bg-[#f5f1e8] relative">
        <div className="absolute inset-0 bg-[url('./assets/imagenes/texturas/ruido.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-30">
          <RutasIngresar />
        </div>
      </div>
    </div>
  );
}


export default App
