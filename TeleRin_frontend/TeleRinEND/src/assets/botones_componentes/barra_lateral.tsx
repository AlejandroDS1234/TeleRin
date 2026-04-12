import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../componentes/userContext";
import { Search, BookCopy, Feather, Landmark } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useUser();

  const resaltado = location.pathname;

  const items = [
    { ruta: "/inicio", Icono: Landmark },
    { ruta: "/buscar", Icono: Search },
    { ruta: "/editor", Icono: Feather },
  ];

  return (
    <div className="flex top-0 left-0 w-full h-16 bg-white/30 backdrop-blur-md items-center justify-around z-50 shadow-md lg:flex-col lg:py-4 lg:h-full lg:justify-between lg:items-center lg:py-6">
      <button
        className="hover:cursor-pointer"
        onClick={() => navigate("/perfil")}
      >
        <img
          className="h-10 aspect-square rounded-full border-2"
          style={{ borderColor: resaltado === "/perfil" ? "#FF0000" : "#000" }}
          src={`/api/Fotos/perfil/${usuario.foto_perfil_usuario}?t=${Date.now()}`}
        />
      </button>

      {items.map(({ ruta, Icono }) => (
        <button
          key={ruta}
          className="hover:cursor-pointer"
          onClick={() => navigate(ruta)}
        >
          <Icono color={resaltado === ruta ? "#FF0000" : "#000"} />
        </button>
      ))}

      <button
        className="hover:cursor-pointer"
        onClick={() => navigate("/iniciar_sesion")}
      >
        <BookCopy color={resaltado === "/iniciar_sesion" ? "#FF0000" : "#000"} />
      </button>
    </div>
  );
}

export default Navbar;
