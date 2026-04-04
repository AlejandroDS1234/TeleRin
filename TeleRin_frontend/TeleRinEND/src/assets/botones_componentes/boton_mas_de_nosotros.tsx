import { useNavigate } from "react-router-dom";
import imagen from "../iconos/nosotros_logo.png";

function Boton_mas_de_nosotros() {
  const navigate = useNavigate();

  return (
    <img
      src={imagen}
      onClick={() => navigate("/registrarse")}
      className="cursor-pointer object-cover w-full h-full"
    />
  );
}

export default Boton_mas_de_nosotros;