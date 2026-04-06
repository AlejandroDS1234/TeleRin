import imagen from "../imagenes/sobrefondo_principal.png";

function Sobrefondo_principal() {
  return (
    <img
      src={imagen}
      alt="sobrefondo"
      className="w-full h-full mt-full object-cover pointer-events-none"
    />
  );
}

export default Sobrefondo_principal;