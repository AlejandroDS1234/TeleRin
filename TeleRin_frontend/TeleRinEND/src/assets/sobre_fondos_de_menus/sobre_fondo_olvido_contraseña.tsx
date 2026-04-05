import imagen from "../imagenes/sobrefondo_olvido_de_contraseña.png";

function Sobrefondo_olvido_contraseña() {
  return (
    <img
      src={imagen}
      alt="sobrefondo"
      className="w-full h-[88vh] mt-[12vh] object-cover lg:object-right pointer-events-none"
    />
  );
}

export default Sobrefondo_olvido_contraseña;