import { useNavigate } from "react-router-dom";
import imagen from "./assets/iconos/usuario_nuevo.png";

function Boton_registro() {
  const navigate = useNavigate();

  return (
    <img
      src={imagen}
      onClick={() => navigate("/registrarse")}
      className="cursor-pointer object-cover"
    />
  );
}

export default Boton_registro;