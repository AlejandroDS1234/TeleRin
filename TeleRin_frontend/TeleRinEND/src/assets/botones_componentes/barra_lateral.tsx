import { useNavigate } from "react-router-dom";
import { useUser } from "../componentes/userContext";
import { Search, BookCopy, Feather, Landmark } from 'lucide-react'
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { usuario } = useUser();
  const [resaltado, setResaltado] = useState(window.location.pathname)
  return (
    <div className="flex top-0 left-0 w-full h-16 bg-white/30 backdrop-blur-md items-center justify-around z-50 shadow-md lg:flex-col lg:py-4 lg:h-full lg:justify-between lg:items-center lg:py-6">

      <button className="hover:cursor-pointer" onClick={() => { navigate("/perfil"); setResaltado("/perfil") }}>
        <img className="h-10 aspect-square rounded-full border-2" style={{ borderColor: (resaltado == "/perfil" ? "#FF0000" : "#000") }} src={`http://localhost:1240/Fotos/perfil/${usuario.foto_perfil_usuario}?t=${Date.now()}`} />
      </button>

      <button className="hover:cursor-pointer" onClick={() => { navigate("/inicio"); setResaltado("/inicio") }}>
        <Landmark color={resaltado == "/inicio" ? "#FF0000" : "#000"} />
      </button>

      <button className="hover:cursor-pointer" onClick={() => { navigate("/buscar"); setResaltado("/buscar") }}>
        <Search color={resaltado == "/buscar" ? "#FF0000" : "#000"} />
      </button>

      <button className="hover:cursor-pointer" onClick={() => navigate("/iniciar_sesion")}>
        <BookCopy color={resaltado == "/" ? "#FF0000" : "#000"} />
      </button>

      <button className="hover:cursor-pointer" onClick={() => { navigate("/editor"); setResaltado("/editor") }}>
        <Feather color={resaltado == "/editor" ? "#FF0000" : "#000"} />
      </button>
    </div>
  );
}
export default Navbar;