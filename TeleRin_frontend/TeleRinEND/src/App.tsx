import "./App.css";
import RutasIngresar from "./rutas/rutasIngresar.tsx";
import UseMensajeRedirigir from "./assets/componentes/mensajeRedirigir.tsx";
//trabajando :(
function App() {
  return (
    <div className="min-h-screen bg-(--color_principal) relative">
      <div className="absolute inset-0 bg-[url('./assets/imagenes/texturas/ruido.png')] opacity-10 pointer-events-none"></div>
      <div className="relative z-30">
        <RutasIngresar />
        <div className="z-30 fixed bottom-18 lg:bottom-18 bg-(--color_principal_opaco)">
          <UseMensajeRedirigir />
        </div>
      </div>
    </div>
  );
}

export default App;
