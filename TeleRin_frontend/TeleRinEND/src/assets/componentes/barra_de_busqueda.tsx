import { useState } from "react";

function BarraDeBusqueda() {
  const [busqueda, setBusqueda] = useState("");

  const manejarBusqueda = (e) => {
    e.preventDefault();

    // Aquí el backend agregará la lógica real
    console.log("Buscando:", busqueda);
  };

  return (
    <form onSubmit={manejarBusqueda} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-white bg-amber-50"
      />

      <button
        type="submit"
        className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-400"
      >
        Buscar
      </button>
    </form>
  );
}

export default BarraDeBusqueda;
