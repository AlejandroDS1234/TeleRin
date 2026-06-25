import { useState, useEffect } from "react";
import { useBuscar } from "../../pages/hook/hookBusqueda";
import { HistoriaCard } from "./historias_cards";
import { Sagacard } from "./sagas_cards";

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
      ) : data?.historias?.length === 0 && data?.sagas?.length === 0 ? (
        <p className="text-sm text-gray-600">No se encontraron resultados.</p>
      ) : (
        <>
          <div className="flex overflow-x-auto sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {data?.historias?.map((historia: any) => (
              <HistoriaCard
                key={historia.id_historia}
                idh={historia.id_historia}
                titulo={historia.nombre_historia}
                descripcion={historia.descripcion_historia}
                visibilidad={historia.visiblilidad_historia}
                autor={{
                  nombre_usuario: historia.nombre_usuario,
                  foto_perfil_usuario: historia.foto_perfil_usuario,
                  codigo_usuario: historia.codigo_usuario,
                }}
              />
            ))}
          </div>
          <div className="flex overflow-x-auto sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {data?.sagas?.map((saga: any) => (
              <Sagacard
                key={saga.id_saga}
                ids={saga.id_saga}
                img={saga.imagen_saga}
                titulo={saga.nombre_saga}
                descripcion={saga.descripcion_saga}
                libros={saga.cantidad_historias}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BarraDeBusqueda;
