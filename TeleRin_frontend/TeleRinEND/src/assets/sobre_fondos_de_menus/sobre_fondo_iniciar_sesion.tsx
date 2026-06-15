import imagen from "../imagenes/sobrefondo_inicio_de_sesion.webp";

function Sobrefondo_inicio_sesion() {
  return (
    <img
      src={imagen}
      alt="sobrefondo"
      className="w-full h-[88vh] mt-[12vh] object-cover lg:object-right pointer-events-none"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
}

export default Sobrefondo_inicio_sesion;
