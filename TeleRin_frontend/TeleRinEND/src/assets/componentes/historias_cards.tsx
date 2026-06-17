import {
  Book,
  Loader,
  FilePenLine,
  Hammer,
  NotebookText,
  BookLock,
  CircleUserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ColorRandom } from "../../function_generales";
import useScrollLock from "../../hooks/useScrollLock";

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
  opciones?: ReactNode;
};

const MotionLink = motion(Link);

function MasOpciones({ children }: { children?: ReactNode }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [abiertoArriba, setAbiertoArrriba] = useState(true);
  const [abiertoIzquierda, setAbiertoIzquierda] = useState(true);
  const [menuDimensiones, setMenuDimensiones] = useState({ alto: 0, ancho: 0 });
  const botonref = useRef<HTMLButtonElement>(null);
  const menuRefElement = useRef<HTMLDivElement>(null);

  // Opción 1: bloquear scroll por eventos sin ocultar la scrollbar
  useScrollLock(menuAbierto);

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
    const cerrarClickAfuera = (e: MouseEvent | TouchEvent) => {
      if (!menuAbierto) return;
      const target = e.target as Node;
      if (
        botonref.current &&
        !botonref.current.contains(target) &&
        !menuRefElement.current?.contains(target)
      ) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener("pointerdown", cerrarClickAfuera);

    return () => {
      document.removeEventListener("pointerdown", cerrarClickAfuera);
      // aseguramos que no queden estilos que oculten la barra
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.querySelectorAll(".contenedor-scroll").forEach((el) => {
        el.classList.remove("scroll-bloqueado");
      });
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
              espacioArriba > espacioAbajo && espacioAbajo < menuDimensiones.alto + 300
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

      {menuAbierto &&
        createPortal(
          <div
            ref={(nodo) => {
              menuRef(nodo);
              menuRefElement.current = nodo;
            }}
            className="bg-amber-200 w-40 fixed rounded-[10px] z-9999 overflow-hidden"
            style={{
              top: abiertoArriba
                ? `${(botonref.current?.getBoundingClientRect().top || 0) - menuDimensiones.alto + 5}px`
                : `${(botonref.current?.getBoundingClientRect().bottom || 0) - 5}px`,

              left: abiertoIzquierda
                ? `${(botonref.current?.getBoundingClientRect().left || 0) - menuDimensiones.ancho + 5}px`
                : `${(botonref.current?.getBoundingClientRect().right || 0) - 5}px`,
            }}
          >
            {children}
          </div>,
          document.body
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
  opciones,
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

      <h3 className="font-bold text-2xl w-full  line-clamp-3 break-all" title={titulo}>
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
            {opciones}
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
      <h3 className="font-bold text-2xl w-full line-clamp-3" title={titulo}>
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
              to={`/editor?id_historia=${encodeURIComponent(idh)}`}
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
    <div className="bg-(--bg-surface) border border-(--border-default) border-dotted flex-none w-50 sm:w-full h-50">
      <div className="flex flex-col gap-4 w-full h-full p-4 pt-6 animate-pulse">
        <h3 className="w-full flex flex-col gap-3">
          <div
            className="min-h-6 w-full rounded-sm border-[#6f675d]/50 border"
            style={{ backgroundColor: ColorRandom() }}
          />
          <div
            className="min-h-6 w-full rounded-sm border-[#6f675d]/50 border"
            style={{ backgroundColor: ColorRandom() }}
          />
          <div
            className="min-h-6 w-full rounded-sm border-[#6f675d]/50 border"
            style={{ backgroundColor: ColorRandom() }}
          />
        </h3>

        <small className="mt-auto w-full h-8 flex gap-1 items-center">
          <div className="flex gap-1 items-center bg-(--bg-surface-muted) rounded-2xl pr-2 w-[55%] h-full">
            <CircleUserRound size={"100%"} color="#6f675d" />
            <div className="flex gap-1">
              <div className="aspect-square rounded-full h-2 bg-[#6f675d]/60 animate-bounce [animation-delay:-0.3s]" />
              <div className="aspect-square rounded-full h-2 bg-[#6f675d]/60 animate-bounce [animation-delay:-0.15s]" />
              <div className="aspect-square rounded-full h-2 bg-[#6f675d]/60 animate-bounce" />
            </div>
          </div>
          <div className="ml-auto h-full aspect-square rounded-full bg-(--bg-surface-muted)" />
        </small>
      </div>
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
