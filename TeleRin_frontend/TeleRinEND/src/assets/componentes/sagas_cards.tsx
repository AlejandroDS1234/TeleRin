import { Book, Loader } from "lucide-react";
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
        <img
          src={`/api/Fotos/fotos_sagas/${img}?size=reducida`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: !imagenCargada ? 1 : 0 }}
        />

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
    <div className="p-4 bg-(--bg-surface) flex flex-col items-center gap-1 border-2 border-(--border-default) border-double h-70 w-50 sm:w-full">
      <div className="flex flex-col items-center gap-1.5 w-full">
        <div className="flex flex-col w-full justify-center items-center gap-px">
          <div className="bg-(--border-default) w-full border-(--border-default) h-[1.5px]" />
          <div className="bg-(--border-default) w-[98%] border-(--border-default) h-px" />
        </div>
        <div className="w-[90%] rounded-sm h-5 bg-(--bg-surface-muted) animate-pulse [animation-delay:-1s]"></div>
        <div className="flex flex-col w-full justify-center items-center gap-px">
          <div className="bg-(--border-default) w-[98%] border-(--border-default) h-px" />
          <div className="bg-(--border-default) w-full border-(--border-default) h-[1.5px]" />
        </div>
      </div>
      <div className="relative h-43 w-full">
        <div className="absolute inset-0 h-full w-full bg-(--neutral-150) animate-pulse [animation-delay:-3s]"></div>
        <div className="h-full w-full bg-[#B9CFD4BF]"></div>
      </div>
      <small className="mt-auto h-3.5 bg-(--bg-surface-muted) w-[60%] rounded-sm animate-pulse" />
      <Lineas grosor="0.1px" espaciado="1px" cantidad={2} />
    </div>
  );
}

export function SagasCardHorizontal({ img, titulo, className = "" }: SagasCardHorizontalProps) {
  const [imagenCargada, setImagenCargada] = useState(false);

  return (
    <div className={`flex items-center gap-4 py-1 px-3 ${className}`}>
      <div className="relative aspect-square h-full">
        <img
          src={`/api/Fotos/fotos_sagas/${img}?size=reducida`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: !imagenCargada ? 1 : 0 }}
        />

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
