import { useNavigate } from "react-router-dom";
import imagen from "./assets/iconos/logo_de_ingreso.png";

function Boton_inicio_sesion() {
  const navigate = useNavigate();

  return (
    <img
      src={imagen}
      onClick={() => navigate("/iniciar_sesion")}
      className="cursor-pointer object-cover"
    />
  );
}

export default Boton_inicio_sesion;