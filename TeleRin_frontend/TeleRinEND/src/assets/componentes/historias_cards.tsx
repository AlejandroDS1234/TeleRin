import { FilePenLine, Hammer, NotebookText, BookLock, CircleUserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
            className="bg-(--color_principal_opaco) w-40 fixed rounded-[10px] z-9999 overflow-hidden"
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
  const navigate = useNavigate();
  return (
    <Link
      to={`/historia/${encodeURIComponent(idh)}`}
      className="bg-radial from-[#d9cebc] via-[#f3efe7] to-[#b3d4bf] group relative  border-[#6f675d]/50  border border-dotted flex-none w-50 sm:w-full h-50"
    >
      {!visibilidad && (
        <BookLock
          height={25}
          className="bg-(--neutral-150) absolute -top-3 -right-3 p-0.5 rounded-full "
        />
      )}
      <div className="bg-linear-to-bl from-[#e7ddcd] via-[#f3efe7] to-[#d4ddd7] absolute inset-0 w-full h-full group-hover:animate-pulse group-hover:[animation-duration:2s]" />
      <div className="absolute flex flex-col gap-4 p-4 pr-3 w-full h-full ">
        <h3
          className="font-bold text-2xl w-full  line-clamp-3 break-all animate-none"
          title={titulo}
        >
          {titulo}
        </h3>
        <p className="w-full line-clamp-3 hidden">{descripcion}</p>
        <small className="mt-auto w-full h-8 flex gap-1 items-center">
          <div
            className="flex gap-1 items-center max-w-[75%] hover:bg-(--bg-surface-muted) rounded-2xl pr-2 transition-bg-color duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/perfil/${encodeURIComponent(autor.codigo_usuario)}`);
            }}
          >
            <div className="aspect-square h-8 relative ">
              <img
                src={`/api/Fotos/perfil/${autor.foto_perfil_usuario}?size=reducida`}
                className="absolute object-cover rounded-full aspect-square w-full h-full"
                loading="lazy"
              />
            </div>
            <p className="font-bold truncate">{autor.nombre_usuario}</p>
          </div>
          <div className="ml-auto">
            <MasOpciones>
              <button
                className="flex h-10 w-full items-center px-2 justify-center bg-(--color_principal_opaco) hover:bg-amber-300 hover:cursor-pointer"
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
      </div>
    </Link>
  );
}

export function HistoriaCardEditar({
  idh,
  titulo,
  descripcion,
  visibilidad,
  autor,
}: HistoriaCardProps) {
  const navigate = useNavigate();
  return (
    <Link
      to={`/historia/${encodeURIComponent(idh)}`}
      className="bg-radial from-[#d9cebc] via-[#f3efe7] to-[#b3d4bf] group relative  border-[#6f675d]/50  border border-dotted flex-none w-50 sm:w-full h-50"
    >
      {!visibilidad && (
        <BookLock
          height={25}
          className="bg-(--neutral-150) absolute -top-3 -right-3 p-0.5 rounded-full"
        />
      )}
      <div className="bg-linear-to-bl from-[#e7ddcd] via-[#f3efe7] to-[#d4ddd7] absolute inset-0 w-full h-full group-hover:animate-pulse group-hover:[animation-duration:2s]" />
      <div className="absolute flex flex-col gap-4 p-4 pr-3 w-full h-full ">
        <h3 className="font-bold text-2xl w-full line-clamp-3" title={titulo}>
          {titulo}
        </h3>
        <p className="w-full line-clamp-3 hidden">{descripcion}</p>
        <small className="mt-auto w-full h-8 flex gap-1 items-center ">
          <div
            className="flex gap-1 items-center  hover:bg-(--bg-surface-muted) rounded-2xl pr-2 max-w-[75%] transition-bg-color duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/perfil/${encodeURIComponent(autor.codigo_usuario)}`);
            }}
          >
            <div className="aspect-square h-8 relative">
              <img
                src={`/api/Fotos/perfil/${autor.foto_perfil_usuario}?size=reducida`}
                className="absolute object-cover rounded-full aspect-square w-full h-full"
              />
            </div>
            <p className="font-bold truncate">{autor.nombre_usuario}</p>
          </div>

          <div className="ml-auto">
            <MasOpciones>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigate(`/editor?id_historia=${encodeURIComponent(idh)}`);
                }}
                className="flex h-10 w-full items-center px-2 justify-center bg-(--color_principal_opaco) hover:bg-amber-300 hover:cursor-pointer"
              >
                <FilePenLine />
                <p className="w-full justify-center text-center">Editar</p>
              </div>
              <button
                className="flex h-10 w-full items-center px-2 justify-center bg-(--color_principal_opaco) hover:bg-amber-300 hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Hammer />
                <p className="w-full justify-center">En Proceso</p>
              </button>
              <button
                className="flex h-10 w-full items-center px-2 justify-center bg-(--color_principal_opaco) hover:bg-amber-300 hover:cursor-pointer"
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
      </div>
    </Link>
  );
}

export function HistoriaCardCargando() {
  const [color] = useState(ColorRandom());
  const [color2] = useState(ColorRandom());
  const [color3] = useState(ColorRandom());
  return (
    <div className="bg-(--bg-surface) border border-(--border-default) border-dotted flex-none w-50 sm:w-full h-50">
      <div className="flex flex-col gap-4 w-full h-full p-4 pt-6 animate-pulse">
        <h3 className="w-full flex flex-col gap-3">
          <div
            className="min-h-6 w-full rounded-sm border-[#6f675d]/50 border"
            style={{ backgroundColor: color }}
          />
          <div
            className="min-h-6 w-full rounded-sm border-[#6f675d]/50 border"
            style={{ backgroundColor: color2 }}
          />
          <div
            className="min-h-6 w-full rounded-sm border-[#6f675d]/50 border"
            style={{ backgroundColor: color3 }}
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
