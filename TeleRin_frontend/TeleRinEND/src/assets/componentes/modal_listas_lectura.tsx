import { Loader, CirclePlus, Bookmark, CircleMinus } from "lucide-react";
import Modal from "./modal";
import { useSesion } from "../../pages/hook/usuario/hookSesion";
import { useListasLecturaUsuario } from "../../pages/hook/listas/hookListasLecturaUsuario";
import { ColorRandom } from "../../function_generales";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CardListaLecturaProps = {
  lista: {
    nombre_lista: string;
    id_lista: number;
    cantidad_elementos: number;
    libro_guardado: boolean;
  };
  onClick: () => void;
};

type AccionListaAnimadaProps = {
  guardado: boolean;
  visible: boolean;
  color: string;
};

function AccionListaAnimada({ guardado, visible, color }: AccionListaAnimadaProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {visible && (
        <motion.div
          key={guardado ? "quitar" : "agregar"}
          initial={{ opacity: 0, x: 12, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -12, scale: 0.9 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex h-full w-[30%] flex-col items-center justify-center"
        >
          <p className="w-full text-center text-2xl font-bold" style={{ color }}>
            {guardado ? "Quitar" : "Agregar"}
          </p>
          {guardado ? (
            <CircleMinus size={50} color={color} />
          ) : (
            <CirclePlus size={50} color={color} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CardListaLectura({ lista, onClick }: CardListaLecturaProps) {
  const [bgColor, setBgColor] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [guardado, setGuardado] = useState(lista.libro_guardado);
  const cantidad = Math.min(lista.cantidad_elementos, 5);

  useEffect(() => {
    const listaColor = [];
    for (let i = 0; i < cantidad; i++) {
      listaColor.push(ColorRandom());
    }
    setBgColor(listaColor);
  }, [cantidad]);

  useEffect(() => {
    setGuardado(lista.libro_guardado);
  }, [lista.libro_guardado]);

  const numString = String(lista.cantidad_elementos);
  const longitud = numString.length;

  const fontSize = longitud === 1 ? "12" : longitud === 2 ? "10" : "8";
  const textY = longitud === 1 ? "9.5" : longitud === 2 ? "10.2" : "9.5";
  const constante_tamaño = 22 / cantidad;

  // Configuración del resorte elástico unificado para una sincronía perfecta
  const springConfig = { type: "spring", stiffness: 65, damping: 14 } as const;

  // Variantes para las tarjetas traseras
  const tarjetas = {
    cerrada: { x: 0 },
    abierta: (indice: number) => ({
      x: 10, // Incrementado ligeramente para destacar bajo el doblez profundo
      transition: {
        duration: 0.28,
        delay: (cantidad - 1 - indice) * 0.05,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <motion.li
      className="overflow-visible w-full shrink-0 sm:w-full h-32 relative flex flex-col items-center justify-center cursor-pointer select-none"
      initial="cerrada"
      animate={isHovered ? "abierta" : "cerrada"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        onClick();
        setGuardado((guardadoAnterior) => !guardadoAnterior);
      }}
    >
      {/* 1. CONTENEDOR BASE / FONDO AMBER (Donde descansan las tarjetas internas) */}
      <div className="absolute inset-0 overflow-hidden shadow-sm flex justify-end">
        {!cantidad && <AccionListaAnimada guardado={guardado} visible={isHovered} color="black" />}
      </div>

      {/* 2. CAPAS DE TARJETAS TRASERAS */}
      {Array.from({ length: cantidad }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-t-sm absolute p-1.5 flex justify-center items-start pt-2"
          variants={tarjetas}
          custom={i}
          style={{
            width: `${95 - constante_tamaño * i}%`,
            height: `${97 - constante_tamaño * (cantidad - (i + 1))}%`, // Ajustado al 80% para alinearse con la tapa
            backgroundColor: bgColor[i],
            zIndex: i,
            left: "10px", // Margen de alineación inicial izquierdo
          }}
        >
          {i === cantidad - 1 && (
            <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] w-full h-full flex justify-end">
              <AccionListaAnimada guardado={guardado} visible={isHovered} color="white" />
            </div>
          )}
        </motion.div>
      ))}

      {/* 3. SOMBRA COORDINADA DINÁMICA (Flota acoplada al movimiento de la tapa) */}
      <motion.div
        className="absolute top-1 bottom-1 w-40 bg-linear-to-l from-transparent to-black/80 pointer-events-none origin-left rounded-r-md"
        style={{ zIndex: cantidad }}
        animate={{
          opacity: isHovered ? 0.38 : 0,
          // Se desplaza en X hacia la izquierda coordinado con la contracción del giro
          x: isHovered ? 100 : 10,
          scaleY: isHovered ? 0.94 : 1,
          filter: isHovered ? "blur(10px)" : "blur(4px)",
        }}
        transition={springConfig}
      />

      {/* 4. CONTENEDOR CON PERSPECTIVA 3D PARA LA TAPA */}
      <div className=" absolute inset-0 w-full h-full perspective-distant z-50 pointer-events-none">
        <motion.div
          className="bg-linear-to-bl from-[#e7ddcd] via-[#f3efe7] to-[#d4ddd7] p-4 w-[80%] h-full flex flex-col justify-between rounded-r-xl border-y border-l border-black/5 origin-left transform-3d shadow-[4px_0_10px_rgba(0,0,0,0.02)]"
          animate={{
            // Levantamiento tridimensional y retroceso realista en X
            rotateY: isHovered ? -38 : 0,
            rotateX: isHovered ? 3.8 : 0,
            // x: isHovered ? -10 : 0,
            z: isHovered ? -4 : 0,
          }}
          transition={springConfig}
        >
          {/* TÍTULO DE LA LISTA */}
          <h3 className="font-bold text-4xl font-sans text-stone-800 line-clamp-1 wrap-break-word leading-tight w-full">
            {lista.nombre_lista}
          </h3>

          {/* ÁREA INFERIOR DE ACCIÓN E ICONO */}
          <div className="w-full h-min flex gap-2 items-center text-stone-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
              <text
                x="12"
                y={textY}
                fontSize={fontSize}
                textAnchor="middle"
                dominantBaseline="central"
                fill="currentColor"
                stroke="none"
                style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}
              >
                {lista.cantidad_elementos}
              </text>
            </svg>
            <p className="text-lg font-semibold">Añadir a la lista</p>
          </div>

          {/* PESTAÑA DERECHA INTEGRADA (Mantiene la consistencia del diseño de carpeta) */}
          <div className="absolute w-3 h-[40%] -right-3 top-1/2 -translate-y-1/2 rounded-r-md bg-[#EFE9DE] border-t border-r border-b border-black/5" />
          {guardado && (
            <Bookmark
              fill="url(#miDegradado)"
              size={40}
              stroke="20"
              className="absolute right-2 top-3 -translate-y-1/2"
            />
          )}
          {/* degradado para icono */}
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <linearGradient id="miDegradado" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#910D27" />
                <stop offset="100%" stopColor="#6F0019" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </motion.li>
  );
}

type ModalListasLecturaProps = {
  open: boolean;
  onClose: () => void;
};

export function ModalListasLectura({ open, onClose }: ModalListasLecturaProps) {
  const { data: usuario } = useSesion("codigo_usuario");
  const { data: listas, isLoading, error } = useListasLecturaUsuario(usuario?.codigo_usuario);

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="bg-(--color_principal) w-full max-w-lg m-5 flex flex-col gap-4 h-full max-h-[60vh] sm:max-h-[80vh] overflow-visible p-4"
    >
      <div className="flex items-center justify-center gap-2 pr-6 w-full">
        <h3 className="font-bold text-2xl">Agregar a una lista</h3>
      </div>

      {isLoading ? (
        <p className="flex items-center gap-2">
          Cargando listas <Loader className="animate-spin" />
        </p>
      ) : error ? (
        <p className="text-red-600">No se pudieron cargar tus listas.</p>
      ) : listas?.length ? (
        <ul className="flex h-full flex-col gap-2 overflow-y-auto pt-8.5">
          {listas.map((lista: any) => (
            <CardListaLectura
              key={lista.id_lista}
              lista={lista}
              onClick={() => {
                // Aquí puedes manejar la acción de agregar a la lista
                console.log(`Agregar historia a la lista: ${lista.nombre_lista}`);
                // Cierra el modal después de seleccionar una lista
              }}
            />
          ))}
        </ul>
      ) : (
        <p>Aún no tienes listas de lectura.</p>
      )}
    </Modal>
  );
}
