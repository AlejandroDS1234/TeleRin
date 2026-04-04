import imagen from "./assets/imagenes/sobrefondo.png";

function Sobrefondo() {
  return (
    <img
      src={imagen}
      alt="sobrefondo"
      className="w-full h-full object-cover lg:object-right pointer-events-none"
    />
  );
}

export default Sobrefondo;