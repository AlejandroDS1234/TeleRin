import { Book, BookHeart, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

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
  autor: string;
};

type SagasCardHorizontalProps = {
  img: string;
  titulo: string;
  className?: string;
};

const MotionHeart = motion(BookHeart);
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
  return (
    <div className="gap-6">
      <Link
        to={`/sagas/${encodeURIComponent(ids)}`}
        className="flex flex-row gap-3 p-4 border-2 border-(--border-default) bg-(--bg-surface) rounded-md"
      >
        {/* Imagen */}
        <img
          src={`/api/Fotos/fotos_sagas/${img}`}
          alt={titulo}
          className="w-[25%] h-full object-cover z-10"
        />

        <div className="flex flex-col gap-2 w-[75%]">
          {/* Título */}
          <h3 className="text-2xl font-bold font-serif position-absolute top-0 left-0 z-20">
            {titulo}
          </h3>

          {/* Descripción */}
          <p className="text-sm text-left">{descripcion}</p>

          {/* Cantidad de libros */}
          <small className="text-center">{libros} libros</small>
        </div>
      </Link>
    </div>
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

export function HistoriaCard({ idh, titulo, descripcion, calificacion, autor }: HistoriaCardProps) {
  const calificacionNumero = Number(calificacion);

  return (
    <MotionLink
      whileHover={{ scale: 0.95 }}
      to={`/historia/${encodeURIComponent(idh)}`}
      className="bg-(--bg-surface) flex flex-col gap-4 border border-(--border-default) border-dotted flex-none w-50 sm:w-full h-50 p-4"
    >
      <h3 className="font-bold w-full line-clamp-2">{titulo}</h3>
      <div className="w-full line-clamp-3">
        <p>{descripcion}</p>
      </div>
      <small className="mt-auto w-full flex justify-between">
        <motion.div
          className="flex gap-[0.5px]"
          variants={{
            normal: {},
            marcado: {
              transition: {
                staggerChildren: 0.1,
                delay: 1,
              },
            },
          }}
          initial="normal"
          whileInView="marcado"
          viewport={{ once: true, amount: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <span key={i}>
              {i < calificacionNumero ? (
                <MotionHeart
                  variants={{
                    normal: {
                      scale: 1,
                    },
                    marcado: {
                      scale: [1, 1.15, 1],
                    },
                  }}
                  color="var(--interactive-selected)"
                />
              ) : (
                <Book />
              )}
            </span>
          ))}
        </motion.div>
        <p className="font-bold truncate">--{autor}</p>
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
