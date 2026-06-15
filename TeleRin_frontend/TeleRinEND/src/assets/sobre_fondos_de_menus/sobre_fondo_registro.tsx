import imagen from "../imagenes/sobrefondo_registro.webp";

function Sobrefondo_registro() {
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

export default Sobrefondo_registro;
