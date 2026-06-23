import { useState, useEffect } from "react";
import { useBuscar } from "../../pages/hook/hookBusqueda";

function BarraDeBusqueda() {
  const [searchText, setSearchText] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const { data, isLoading } = useBuscar(busqueda);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setBusqueda(searchText);
    }, 500);

    return () => clearTimeout(temporizador);
  }, [searchText]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-white bg-amber-50"
      />

      {busqueda.trim().length === 0 ? (
        <p className="text-sm text-gray-600">Escribe algo para buscar historias.</p>
      ) : isLoading ? (
        <p className="text-sm text-gray-600">Buscando...</p>
      ) : data?.length === 0 ? (
        <p className="text-sm text-gray-600">No se encontraron resultados.</p>
      ) : (
        <div className="grid gap-3">
          {data?.map((historia: any) => (
            <div
              key={historia.id_historia}
              className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm"
            >
              <h3 className="font-semibold text-lg">{historia.nombre_historia}</h3>
              <p className="text-sm text-gray-600 mt-1">{historia.descripcion_historia}</p>
              <p className="text-xs text-gray-500 mt-2">Autor: {historia.nombre_usuario}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BarraDeBusqueda;
