import Editor from "../assets/componentes/editor_texto.tsx";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, BookHeart, Book } from "lucide-react";
import { redirigir } from "../function_generales.tsx";
import { obtenerHistoria } from "./api/historias/apiHistoria.ts";
import UseMensajeRedirigir from "../assets/componentes/mensajeRedirigir.tsx";
import { useQuery } from "@tanstack/react-query";
import { useCalificarHistoria } from "./hook/hookCalificarHistoria.ts";
import { calificacionHistoria } from "./api/historias/apiCalificacionHistoria.ts";
import { agregarAlHistorial } from "./api/historias/apiAgregarAlHistorial.ts";
import { useEffect } from "react";

function Calificacion() {
  const { id_historia = "" } = useParams();

  const { data } = useQuery({
    queryKey: ["calificacion_historia", id_historia],
    queryFn: () => calificacionHistoria(id_historia),
    enabled: true,
  });
  const mutateCalifiacion = useCalificarHistoria();

  return (
    <div className="flex">
      <p>Calificar:</p>
      <div className="flex">
        {Array.from({ length: 3 }).map((_, i) => (
          <button
            type="button"
            key={i}
            className="flex hover:cursor-pointer"
            onClick={() => {
              const nuevaCalificacion = data === i + 1 ? 0 : i + 1;
              mutateCalifiacion.mutate({ id_historia, calificacion: nuevaCalificacion });
            }}
          >
            {i + 1 <= data ? <BookHeart color="#FF0000" /> : <Book />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Historia() {
  const navigate = useNavigate();
  const { id_historia = "" } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["historia", id_historia],
    queryFn: () => obtenerHistoria(id_historia),
  });
  redirigir(navigate, data);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      agregarAlHistorial(id_historia);
      console.log("Historia agregada al historial");
    }, 10000);
    return () => clearTimeout(temporizador);
  }, [id_historia]);

  if (isLoading) {
    return (
      <div className="flex justify-center lg:items-center">
        <div className="min-h-screen bg-[#e5e3dc] w-full max-w-175 h-[90vh] shadow-xl flex flex-col items-center p-4">
          <p className="flex">
            Cargando
            <Loader className="animate-spin" />
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center lg:items-center">
        <div className="min-h-screen bg-[#e5e3dc] w-full max-w-175 h-[90vh] shadow-xl flex flex-col items-center p-4">
          <p>Error al cargar la historia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5e3dc] w-full max-w-175 shadow-xl flex flex-col items-center p-4">
      <Editor
        soloLectura={true}
        contenidoInicial={data.contenido_historia}
        onChangeContenido={null}
        toolbarItems={[
          {
            type: "custom",
            value: "titulo",
            className: "flex-1",
            content: (
              <div className="flex h-max w-10 pb-4">
                <div className="flex flex-col gap-2 w-max max-w-70 p-2">
                  <h2 className="font-bold h-5 w-max">{data.nombre_historia}</h2>
                  <p className=" h-25">{data.descripcion_historia}</p>
                </div>
                <p className="w-max flex p-2 border-l">
                  {data.calificacion_p}/3 <BookHeart />
                </p>
              </div>
            ),
          },
          {
            type: "custom",
            value: "calificar",
            className: "ml-auto",
            content: <Calificacion />,
          },
        ]}
      />
    </div>
  );
}

function Historias() {
  return (
    <div className="flex justify-center lg:items-center">
      <Historia />
      <div className="z-30 fixed bottom-18 lg:bottom-18 bg-[#f5f0e6]">
        <UseMensajeRedirigir />
      </div>
    </div>
  );
}

export default Historias;
