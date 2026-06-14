import { useParams } from "react-router-dom";
import { Loader, BookLock } from "lucide-react";
import { ColorRandom } from "../function_generales";
import { useState } from "react";
import { HistoriaCard_vision, HistoriaCardCargando } from "../assets/componentes/historias_cards";
import { useHistoriasSagas } from "./hook/sagas/hookHistoriasSaga";
import { useSagaInfo } from "./hook/sagas/hookSagaInfo";
import type { Historia } from "../types";

function SagasInfo() {
  const { id_saga = "" } = useParams();
  const [fotoCargada, setFotoCargada] = useState(false);
  const { isLoading, error, data } = useSagaInfo(id_saga);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-(--danger)">Error loading saga information. {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center lg:flex-row lg:items-start gap-6 mb-6">
        <div
          className="relative h-63 w-50 position-center"
          style={{ backgroundColor: ColorRandom() }}
        >
          <img
            src={`/api/Fotos/fotos_sagas/${data.imagen_saga}?size=reducida`}
            alt={data.nombre_saga}
            className="w-full h-full object-cover absolute"
            style={{ opacity: fotoCargada ? 0 : 1 }}
          />

          <img
            src={`/api/Fotos/fotos_sagas/${data.imagen_saga}`}
            alt={data.nombre_saga}
            onLoad={() => setFotoCargada(true)}
            style={{ opacity: fotoCargada ? 1 : 0 }}
            className=" w-full h-full object-cover transition-opacity duration-500"
          />
          <br />
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold font-serif">Nombre: {data.nombre_saga}</h1>
          <p className="text-3xl font-bold font-serif">Descripción: {data.descripcion_saga}</p>
          <p className="text-3xl font-bold font-serif">
            Libros que contiene esta saga: {data.libros}
          </p>
          <p className="text-3xl font-bold font-serif">Autor: {data.nombre_usuario}</p>
          <br />
        </div>
      </div>
    </div>
  );
}

function SagasHistorias() {
  const { id_saga = "" } = useParams();
  const { isLoading, error, data } = useHistoriasSagas(id_saga);
  if (isLoading) {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <HistoriaCardCargando key={index} />
        ))}
      </>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-(--danger)">Error loading saga stories. {error.message}</p>
      </div>
    );
  }

  return (
    <>
      {data.length ? (
        data.map((historia: Historia) => (
          <HistoriaCard_vision
            key={historia.id_historia}
            idh={historia.id_historia}
            titulo={historia.nombre_historia}
            descripcion={historia.descripcion_historia}
            calificacion={historia.calificacion_p}
            visibilidad={historia.visibilidad_historia}
            autor={{
              nombre_usuario: historia.nombre_usuario,
              foto_perfil_usuario: historia.foto_perfil_usuario,
              codigo_usuario: historia.codigo_usuario,
            }}
          />
        ))
      ) : (
        <p>Sin historias</p>
      )}
    </>
  );
}

function Sagas() {
  return (
    <>
      <div className="ml-4 mr-4 mb-[2%] min-h-screen">
        <SagasInfo />
        <div className="flex flex-col sm:grid w-[98%] h-full gap-8">
          <SagasHistorias />
        </div>
      </div>
      <br />
    </>
  );
}
<BookLock />;
export default Sagas;
