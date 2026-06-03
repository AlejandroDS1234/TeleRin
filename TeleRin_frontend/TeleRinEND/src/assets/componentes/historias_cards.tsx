import { Book, Loader, FilePenLine, Hammer, NotebookText, BookLock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, type ReactNode } from "react";

type HistoriaCardProps = {
  idh: string;
  titulo: string;
  descripcion: string;
  visibilidad?: boolean;
  calificacion?: string | number;
  autor: {
    nombre_usuario: string;
    foto_perfil_usuario: string;
    codigo_usuario: string;
  };
};

const MotionLink = motion(Link);

function MasOpciones({ children }: { children?: ReactNode }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [abiertoArriba, setAbiertoArrriba] = useState(true);
  const [abiertoIzquierda, setAbiertoIzquierda] = useState(true);
  const [menuDimensiones, setMenuDimensiones] = useState({ alto: 0, ancho: 0 });
  const botonref = useRef<HTMLButtonElement>(null);

  const menuRef = (nodo: HTMLDivElement | null) => {
    if (nodo !== null && menuDimensiones.alto === 0) {
      setMenuDimensiones({
        alto: nodo.offsetHeight,
        ancho: nodo.offsetWidth,
      });
    }
  };

  useEffect(() => {
    if (!menuAbierto) {
      setMenuDimensiones({ alto: 0, ancho: 0 });
    }
  }, [menuAbierto]);

  useEffect(() => {
    if (menuAbierto) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      document.body.style.overflowY = "scroll";
      document.body.style.scrollbarGutter = "stable";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflowY = "";
      document.body.style.scrollbarGutter = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    const cerrarClickAfuera = (e: MouseEvent | TouchEvent) => {
      if (!menuAbierto) return;
      if (botonref.current && !botonref.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener("touchstart", cerrarClickAfuera, true);
    document.addEventListener("click", cerrarClickAfuera, true);

    return () => {
      document.removeEventListener("click", cerrarClickAfuera, true);
      document.removeEventListener("touchstart", cerrarClickAfuera, true);
    };
  }, [menuAbierto]);

  return (
    <button
      ref={botonref}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        if (!menuAbierto) {
          const posicion = botonref.current?.getBoundingClientRect();
          if (posicion) {
            const espacioArriba = posicion.top;
            const espacioAbajo = window.innerHeight - posicion.bottom;
            const espacioDerecha = window.innerWidth - posicion.right;
            const espacioIzquierda = posicion.left;

            setAbiertoArrriba(
              espacioArriba > espacioAbajo && espacioAbajo < menuDimensiones.alto + 150
            );
            setAbiertoIzquierda(
              espacioDerecha < espacioIzquierda && espacioDerecha < menuDimensiones.ancho + 150
            );
          }
        }
        setMenuAbierto(!menuAbierto);
      }}
      className="z-10 relative p-1 rounded-full hover:bg-(--bg-surface-muted) transition-bg-color duration-300 hover:cursor-pointer"
    >
      <NotebookText />

      {menuAbierto && (
        <div
          ref={menuRef}
          onMouseEnter={(e) => e.preventDefault()}
          className="bg-amber-200 w-40 absolute rounded-[10px] z-20 overflow-hidden"
          style={{
            top: abiertoArriba ? `-${menuDimensiones.alto - 6}px` : "auto",
            bottom: !abiertoArriba ? `-${menuDimensiones.alto - 6}px` : "auto",
            left: abiertoIzquierda ? `-${menuDimensiones.ancho - 6}px` : "auto",
            right: !abiertoIzquierda ? `-${menuDimensiones.ancho - 6}px` : "auto",
          }}
        >
          {children}
        </div>
      )}
    </button>
  );
}

export function HistoriaCard({
  idh,
  titulo,
  descripcion,
  visibilidad = true,
  autor,
}: HistoriaCardProps) {
  const [imagenCargada, setImagenCargada] = useState(false);

  return (
    <MotionLink
      to={`/historia/${encodeURIComponent(idh)}`}
      className="relative bg-linear-to-bl from-[#e7ddcd] via-[#f3efe7] to-[#d4ddd7] border-[#6f675d]/50 flex flex-col gap-4 border border-dotted flex-none w-50 sm:w-full h-50 p-4 pr-3 "
    >
      {!visibilidad && (
        <BookLock
          height={25}
          className="bg-(--neutral-150) absolute -top-3 -right-3 p-0.5 rounded-full"
        />
      )}

      <h3 className="font-bold text-2xl w-full  line-clamp-2" title={titulo}>
        {titulo}
      </h3>
      <p className="w-full line-clamp-3 hidden">{descripcion}</p>
      <small className="mt-auto w-full h-8 flex gap-1 items-center">
        <Link
          className="flex gap-1 items-center max-w-[75%] hover:bg-(--bg-surface-muted) rounded-2xl pr-2 transition-bg-color duration-300"
          to={`/perfil/${encodeURIComponent(autor.codigo_usuario)}`}
        >
          <div className="aspect-square h-8 relative ">
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
        </Link>
        <div className="ml-auto">
          <MasOpciones>
            <button
              className="flex h-10 w-full items-center px-2 justify-center bg-amber-200 hover:bg-amber-300 hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Hammer />
              <p className="w-full justify-center">En Proceso</p>
            </button>
          </MasOpciones>
        </div>
      </small>
    </MotionLink>
  );
}

export function HistoriaCardEditar({
  idh,
  titulo,
  descripcion,
  visibilidad,
  autor,
}: HistoriaCardProps) {
  const [imagenCargada, setImagenCargada] = useState(false);

  return (
    <MotionLink
      to={`/historia/${encodeURIComponent(idh)}`}
      className=" relative bg-linear-to-bl from-[#e7ddcd] via-[#f3efe7] to-[#d4ddd7] border-[#6f675d]/50 flex flex-col gap-4 border border-dotted flex-none w-50 sm:w-full h-50 p-4 pr-3 "
    >
      {!visibilidad && (
        <BookLock
          height={25}
          className="bg-(--neutral-150) absolute -top-3 -right-3 p-0.5 rounded-full"
        />
      )}
      <h3 className="font-bold text-2xl w-full  line-clamp-3" title={titulo}>
        {titulo}
      </h3>
      <p className="w-full line-clamp-3 hidden">{descripcion}</p>
      <small className="mt-auto w-full h-8 flex gap-1 items-center ">
        <Link
          className="flex gap-1 items-center  hover:bg-(--bg-surface-muted) rounded-2xl pr-2 max-w-[75%] transition-bg-color duration-300"
          to={`/perfil/${encodeURIComponent(autor.codigo_usuario)}`}
        >
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
        </Link>

        <div className="ml-auto">
          <MasOpciones>
            <Link
              to={`/editar_historia/${encodeURIComponent(idh)}`}
              className="flex h-10 w-full items-center px-2 justify-center bg-amber-200 hover:bg-amber-300 hover:cursor-pointer"
            >
              <FilePenLine />
              <p className="w-full justify-center">Editar</p>
            </Link>
            <button
              className="flex h-10 w-full items-center px-2 justify-center bg-amber-200 hover:bg-amber-300 hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Hammer />
              <p className="w-full justify-center">En Proceso</p>
            </button>
            <button
              className="flex h-10 w-full items-center px-2 justify-center bg-amber-200 hover:bg-amber-300 hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Hammer />
              <p className="w-full justify-center">En Construccion</p>
            </button>
          </MasOpciones>
        </div>
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

export function HistoriaCard_vision({
  idh,
  titulo,
  descripcion,
  visibilidad = true,
  autor,
}: HistoriaCardProps) {
  const [imagenCargada, setImagenCargada] = useState(false);

  return (
    <MotionLink
      to={`/historia/${encodeURIComponent(idh)}`}
      className="relative bg-linear-to-bl from-[#e7ddcd] via-[#f3efe7] to-[#d4ddd7] border-[#6f675d]/50 flex flex-row gap-4 border border-dotted w-full sm:w-full h-50 p-4 pr-3 "
    >
      {!visibilidad && (
        <BookLock
          height={25}
          className="z-100 bg-(--neutral-150) absolute -top-3 -right-3 p-0.5 rounded-full"
        />
      )}
      <div className="flex flex-col gap-4 w-full h-full">
        <h3 className="font-bold text-2xl w-full  line-clamp-2">{titulo}</h3>
        <p className="w-full line-clamp-3">{descripcion}</p>
        <small className="mt-auto w-full h-8 flex gap-1 items-center">
          <Link
            className="flex gap-1 items-center max-w-[75%] hover:bg-(--bg-surface-muted) rounded-2xl pr-2 transition-bg-color duration-300"
            to={`/perfil/${encodeURIComponent(autor.codigo_usuario)}`}
          >
            <div className="aspect-square h-8 relative ">
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
          </Link>
          <div className="ml-auto">
            <MasOpciones>
              <button
                className="flex h-10 w-full items-center px-2 justify-center bg-amber-200 hover:bg-amber-300 hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Hammer />
                <p className="w-full justify-center">En Proceso</p>
              </button>
            </MasOpciones>
          </div>
        </small>
      </div>
    </MotionLink>
  );
}
