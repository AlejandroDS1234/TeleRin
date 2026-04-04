import imagen from "../imagenes/sobrefondo.png";

function Sobrefondo() {
  return (
    <img
      src={imagen}
      alt="sobrefondo"
      className="w-full h-full object-fill lg:object-right pointer-events-none"
    />
  );
}

export default Sobrefondo;