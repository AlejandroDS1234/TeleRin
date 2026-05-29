import { Book, Loader, NotebookText } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { ColorRandom } from "../../function_generales";

type LineasProps = {
  grosor: string;
  espaciado: string;
  cantidad?: number;
};

type SagasCardProps = {
  ids: string;
  img: string;
  titulo: string;
  descripcion: string;
  libros: string | number;
};

type HistoriaCardProps = {
  idh: string;
  titulo: string;
  descripcion: string;
  calificacion: string | number;
  autor: {
    nombre_usuario: string;
    foto_perfil_usuario: string;
    codigo_usuario: string;
  };
};

type SagasCardHorizontalProps = {
  img: string;
  titulo: string;
  className?: string;
};

const MotionLink = motion(Link);

function Lineas({ grosor, espaciado, cantidad = 2 }: LineasProps) {
  return (
    <div className="flex flex-col w-full justify-center" style={{ gap: espaciado }}>
      {Array.from({ length: cantidad }).map((_, index) => (
        <div key={index} className="w-full border-black border" style={{ height: grosor }} />
      ))}
    </div>
  );
}

export function Sagacard({ ids, img, titulo, descripcion, libros }: SagasCardProps) {
  const [imagenCargada, setImagenCargada] = useState(false);

  return (
    <Link
      to={`/sagas/${encodeURIComponent(ids)}`}
      className="relative p-4 bg-(--bg-surface) flex flex-col border-2 border-[#6f675d]/50 border-double h-70 flex-none w-50 sm:w-full"
    >
      <div>
        <div className="flex flex-col w-full justify-center items-center gap-px">
          <div className="bg-(--border-default) w-full border-(--border-default) h-[1.5px]" />
          <div className="bg-(--border-default) w-[98%] border-(--border-default) h-px" />
        </div>

        <h3 className="truncate w-full font-bold text-2xl font-serif h-min text-center">
          {titulo}
        </h3>

        <div className="flex flex-col w-full justify-center items-center gap-px">
          <div className="bg-(--border-default) w-[98%] border-(--border-default) h-px" />
          <div className="bg-(--border-default) w-full border-(--border-default) h-[1.5px]" />
        </div>
      </div>

      <div className="relative mt-auto h-43 w-full" style={{ backgroundColor: ColorRandom() }}>
        {/* Placeholder borroso (imagen reducida) */}
        <img
          src={`/api/Fotos/fotos_sagas/${img}?size=reducida`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: !imagenCargada ? 1 : 0 }}
        />

        {/* Imagen real con fade in */}
        <img
          className="mt-auto h-43 w-full object-cover transition-opacity duration-300"
          style={{ opacity: imagenCargada ? 1 : 0 }}
          src={`/api/Fotos/fotos_sagas/${img}`}
          onLoad={() => setImagenCargada(true)}
        />
      </div>

      <small className="mt-auto flex justify-center">
        <div>{libros} libros</div>
      </small>
      <Lineas grosor="0.1px" espaciado="1px" cantidad={2} />
      <motion.div
        className="absolute bottom-0 right-0 left-0 w-full h-[80%] bg-(--bg-surface)/80 p-4"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <p className="text-left w-full line-clamp-8">{descripcion}</p>
      </motion.div>
    </Link>
  );
}

export function SagaCardCargando() {
  return (
    <div className="relative p-4 bg-(--bg-surface) flex flex-col border-2 border-(--border-default) border-double h-70 flex-none w-50 sm:w-full">
      <div>
        <div className="flex flex-col w-full justify-center items-center gap-px">
          <div className="bg-(--border-default) w-full border-(--border-default) h-[1.5px]" />
          <div className="bg-(--border-default) w-[98%] border-(--border-default) h-px" />
        </div>

        <h3 className="truncate w-full font-bold text-2xl font-serif h-min text-center"></h3>

        <div className="flex flex-col w-full justify-center items-center gap-px">
          <div className="bg-(--border-default) w-[98%] border-(--border-default) h-px" />
          <div className="bg-(--border-default) w-full border-(--border-default) h-[1.5px]" />
        </div>
      </div>

      <div className="relative mt-auto h-43 w-full bg-(--bg-surface-muted)"></div>

      <small className="mt-auto flex justify-center">
        <div> </div>
      </small>
      <Lineas grosor="0.1px" espaciado="1px" cantidad={2} />
    </div>
  );
}

export function HistoriaCard({ idh, titulo, descripcion, autor }: HistoriaCardProps) {
  const [imagenCargada, setImagenCargada] = useState(false);

  return (
    <MotionLink
      whileHover={{ y: -2 }}
      to={`/historia/${encodeURIComponent(idh)}`}
      className="bg-linear-to-bl from-[#e7ddcd] via-[#f3efe7] to-[#d4ddd7] border-[#6f675d]/50 flex flex-col gap-4 border border-dotted flex-none w-50 sm:w-full h-50 p-4 "
    >
      <h3 className="font-bold text-2xl w-full  line-clamp-3">{titulo}</h3>
      <small className="mt-auto w-full h-8 flex gap-1 items-center justify-between">
        <div className="flex gap-1 items-center w-[80%]">
          <div className="aspect-square h-8 relative">
            <img
              src={`/api/Fotos/perfil/${autor.foto_perfil_usuario}?size=reducida`}
              style={{ opacity: imagenCargada ? 0 : 1 }}
              className="absolute object-cover rounded-full aspect-square w-full h-full"
            />
            <img
              src={`/api/Fotos/perfil/${autor.foto_perfil_usuario}`}
              style={{ opacity: imagenCargada ? 1 : 0 }}
              onLoad={() => setImagenCargada(true)}
              className="object-cover rounded-full aspect-square w-full h-full"
            />
          </div>
          <p className="font-bold truncate">{autor.nombre_usuario}</p>
        </div>
        <NotebookText />
      </small>
    </MotionLink>
  );
}

export function HistoriaCardCargando() {
  return (
    <div className="bg-(--bg-surface) flex flex-col gap-4 border border-(--border-default) border-dotted flex-none w-50 sm:w-full h-50 p-4">
      <h3 className="font-bold w-full line-clamp-2">...</h3>
      <div className="w-full line-clamp-3">
        <p>
          Cargando <Loader className="animate-spin" />
        </p>
      </div>
      <small className="mt-auto w-full flex justify-between">
        <div className="flex gap-[0.5px]">
          {[...Array(3)].map((_, i) => (
            <span key={i}>
              <Book />
            </span>
          ))}
        </div>
        <p className="font-bold truncate">
          --
          <Loader className="animate-spin" />
        </p>
      </small>
    </div>
  );
}

export function SagasCardHorizontal({ img, titulo, className = "" }: SagasCardHorizontalProps) {
  const [imagenCargada, setImagenCargada] = useState(false);

  return (
    <div className={`flex items-center gap-4 py-1 px-3 ${className}`}>
      <div className="relative aspect-square h-full">
        {/* Placeholder borroso (imagen reducida) */}
        <img
          src={`/api/Fotos/fotos_sagas/${img}?size=reducida`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: !imagenCargada ? 1 : 0 }}
        />

        {/* Imagen real con fade in */}
        <img
          className="aspect-square h-full transition-opacity duration-300"
          style={{ opacity: imagenCargada ? 1 : 0 }}
          src={`/api/Fotos/fotos_sagas/${img}`}
          onLoad={() => setImagenCargada(true)}
        />
      </div>
      <p className="truncate font-bold">{titulo}</p>
    </div>
  );
}
