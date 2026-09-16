import { useParams } from "react-router-dom";
import { Loader, BookLock } from "lucide-react";
import { ColorRandom } from "../function_generales";
import {
  HistoriaCardCargando,
  HistoriaCard,
  HistoriaCardEditar,
} from "../assets/componentes/cards/historias_cards";
import { useHistoriasSagas } from "./hook/sagas/hookHistoriasSaga";
import { useSagaInfo } from "./hook/sagas/hookSagaInfo";
import type { Historia } from "../types";
import { useNavigate } from "react-router-dom";

function SagasInfo() {
  const { id_saga = "" } = useParams();
  const { isLoading, error, data } = useSagaInfo(id_saga);
  const navigate = useNavigate();

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
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6 mt-5">
      <div
        className="relative w-full aspect-50/63 sm:w-50 sm:h-63 position-center rounded-2xl overflow-hidden"
        style={{ backgroundColor: ColorRandom() }}
      >
        <img
          src={`/api/Fotos/fotos_sagas/${data.imagen_saga}`}
          alt={data.nombre_saga}
          className=" w-full h-full object-cover"
        />
        <br />
      </div>
      <div className="flex flex-col gap-5 w-full sm:max-w-[60%]">
        <h1 className="text-5xl font-bold font-serif self-center sm:self-start break-all">
          {data.nombre_saga}
        </h1>
        <p className="text-xl font-serif">{data.descripcion_saga}</p>
        <small>
          Libros: {data.cantidad_historias} Vistas: {data.vistas} ⭐ {data.calificacion}
        </small>
        <div
          className="flex gap-1 items-center w-max hover:bg-(--bg-surface-muted) rounded-2xl pr-2 transition-bg-color duration-300 hover:cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/perfil/${encodeURIComponent(data.codigo_usuario)}`);
          }}
        >
          <div className="aspect-square h-8 relative ">
            <img
              src={`/api/Fotos/perfil/${data.foto_perfil_usuario}?size=reducida`}
              className="absolute object-cover rounded-full aspect-square w-full h-full"
              loading="lazy"
            />
          </div>
          <p className="font-bold truncate">{data.nombre_usuario}</p>
        </div>
      </div>
    </div>
  );
}

function SagasHistorias() {
  const { id_saga = "" } = useParams();
  const { isLoading, error, data } = useHistoriasSagas(id_saga);
  const Card = data?.editar ? HistoriaCardEditar : HistoriaCard;

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
      {data.historias?.length ? (
        data.historias?.map((historia: Historia) => (
          <Card
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
        <p>Esta saga no tiene historias 😢</p>
      )}
    </>
  );
}

function Sagas() {
  return (
    <>
      <div className="ml-4 mr-4 mb-[2%] min-h-screen">
        <SagasInfo />
        <div className="flex gap-2 items-center mb-5">
          <div className="flex-1 bg-gray-400 h-0.5" />
          <p className="font-bold ">Libros</p>
          <div className="flex-1 bg-gray-400 h-0.5" />
        </div>
        <div className="flex overflow-x-auto sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
          <SagasHistorias />
        </div>
      </div>
      <br />
    </>
  );
}
<BookLock />;
export default Sagas;
