import imagen from "../imagenes/sobrefondo_principal.webp";

function Sobrefondo_principal() {
  return (
    <img
      src={imagen}
      alt="sobrefondo"
      className="w-full h-full mt-full object-cover pointer-events-none"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
}

export default Sobrefondo_principal;
