import imagen from "../imagenes/sobrefondo.webp";

function Sobrefondo() {
  return (
    <img
      src={imagen}
      alt="sobrefondo"
      className="w-full h-full object-cover lg:object-right pointer-events-none"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
}

export default Sobrefondo;
