import Editor from "../assets/componentes/editor_texto.tsx";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, BookHeart, Book, BookLock } from "lucide-react";
import { redirigir } from "../function_generales.tsx";
import { useHistorias } from "./hook/historias/hookHistorias.ts";
import { useCalificarHistoria } from "./hook/historias/hookCalificarHistoria.ts";
import { useCalificacionHistoria } from "./hook/historias/hookCalificacionHistoria.ts";
import { agregarAlHistorial } from "./api/historias/apiAgregarAlHistorial.ts";
import { useEffect } from "react";
import { motion } from "framer-motion";

function Calificacion() {
  const { id_historia = "" } = useParams();

  const califiacion = useCalificacionHistoria(id_historia);

  const mutateCalifiacion = useCalificarHistoria();

  return (
    <div className="flex">
      <p className="text-(--color_texto_oscuro)">Calificar:</p>
      <motion.div className="flex">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            key={i}
            className="flex hover:cursor-pointer"
            onClick={() => {
              const nuevaCalificacion = califiacion.data === i + 1 ? 0 : i + 1;
              mutateCalifiacion.mutate({ id_historia, calificacion: nuevaCalificacion });
            }}
          >
            {i + 1 <= califiacion.data ? <BookHeart color="var(--color_seleccionado)" /> : <Book />}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

function Historia() {
  const navigate = useNavigate();
  const { id_historia = "" } = useParams();

  const historia = useHistorias(id_historia);

  redirigir(navigate, historia.data);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      agregarAlHistorial(id_historia);
    }, 10000);
    return () => clearTimeout(temporizador);
  }, [id_historia]);

  if (historia.isLoading) {
    return (
      <div className="flex justify-center lg:items-center">
        <div className="min-h-screen bg-(--color_principal_claro) w-full max-w-175 h-[90vh] shadow-xl flex flex-col items-center p-4">
          <p className="flex text-(--color_texto_oscuro) items-center gap-2">
            Cargando
            <Loader className="animate-spin" />
          </p>
        </div>
      </div>
    );
  }
  if (historia.error) {
    return (
      <div className="flex justify-center lg:items-center">
        <div className="min-h-screen bg-(--color_principal_claro) w-full max-w-175 h-[90vh] shadow-xl flex flex-col items-center p-4">
          <p className="text-(--color_texto_oscuro)">Error al cargar la historia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-(--color_principal_opaco) w-full max-w-175 shadow-xl flex flex-col items-center p-4">
      <Editor
        soloLectura={true}
        contenidoInicial={historia.data.contenido_historia}
        onChangeContenido={null}
        toolbarItems={[
          {
            type: "custom",
            value: "calificar",
            className: "",
            content: <Calificacion />,
          },
          !historia.data.visibilidad_historia
            ? {
                type: "custom",
                value: "visibilidad",
                content: <BookLock />,
                className: "ml-auto",
              }
            : { type: "custom", value: "visibilidad", content: <Book />, className: "ml-auto" },
        ]}
      />
    </div>
  );
}

function Historias() {
  return (
    <div className="flex justify-center lg:items-center">
      <Historia />
    </div>
  );
}

export default Historias;
