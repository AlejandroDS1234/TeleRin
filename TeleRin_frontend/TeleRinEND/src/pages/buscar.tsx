import sobrefondo from "../assets/imagenes/sobrefondo_buscar.webp";
import { useState, useEffect } from "react";
import { useBuscar } from "./hook/hookBusqueda";
import { HistoriaCard } from "../assets/componentes/historias_cards";
import { Sagacard } from "../assets/componentes/sagas_cards";

function Buscar() {
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
    <div className="relative flex gap-5 p-5">
      <img
        className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-30"
        src={sobrefondo}
      />
      <div className="w-full md:w-100 shrink-0">
        <div
          className="
            sticky
            top-5
            bg-blue-600
            rounded-sm
            p-3

            h-fit
            min-h-[calc(100vh-16rem)]
            max-h-[calc(100vh-16rem)]

            overflow-y-auto
          "
        >
          <input
            className="w-full border"
            type="text"
            placeholder="Buscar..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-red-600 flex-1 z-2 p-3 rounded-sm">
        {busqueda.trim().length === 0 ? (
          <p className="text-sm text-gray-600">Escribe algo para buscar historias.</p>
        ) : isLoading ? (
          <p className="text-sm text-gray-600">Buscando...</p>
        ) : data?.historias?.length === 0 && data?.sagas?.length === 0 ? (
          <p className="text-sm text-gray-600">No se encontraron resultados.</p>
        ) : (
          <>
            <p>Historias</p>
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
            <p>Sagas</p>
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
    </div>
  );
}

export default Buscar;
