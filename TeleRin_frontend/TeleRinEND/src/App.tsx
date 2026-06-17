import "./App.css";
import RutasIngresar from "./rutas/rutasIngresar.tsx";
import UseMensajeRedirigir from "./assets/componentes/mensajeRedirigir.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
//trabajando :(
function App() {
  return (
    <div className="min-h-screen bg-(--color_principal) relative">
      <div className="absolute inset-0 bg-[url('./assets/imagenes/texturas/ruido.png')] opacity-10 pointer-events-none"></div>
      <div className="relative z-30 ">
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
          <RutasIngresar />
        </GoogleOAuthProvider>
        <div className="z-999999 fixed left-1/2 -translate-x-1/2 bottom-20 lg:bottom-10 bg-(--color_principal_opaco)">
          <UseMensajeRedirigir />
        </div>
      </div>
    </div>
  );
}

export default App;
