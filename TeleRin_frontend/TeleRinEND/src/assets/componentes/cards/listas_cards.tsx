import { useNavigate } from "react-router-dom";
import { ColorRandom } from "../../../function_generales";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type ListasCardProps = {
  nombreLista: string;
  idLista: number;
  cantidad_elementos: number;
  autor: {
    nombre_usuario: string;
    foto_perfil_usuario: string;
    codigo_usuario: number;
  };
};

export function ListasCard({ nombreLista, idLista, cantidad_elementos, autor }: ListasCardProps) {
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState<string[]>([]);
  const cantidad = Math.min(cantidad_elementos, 5); // Limitar a 5 elementos

  useEffect(() => {
    const listaColor = [];
    for (let i = 0; i < cantidad; i++) {
      listaColor.push(ColorRandom());
    }
    setBgColor(listaColor);
  }, [cantidad]);
  {
    /* 1. Convertimos el valor a string para medir cuántos caracteres tiene */
  }
  const numString = String(cantidad_elementos);
  const longitud = numString.length;
  {
    /* 2. Calculamos el tamaño de fuente ideal según los dígitos */
  }
  const fontSize = longitud === 1 ? "12" : longitud === 2 ? "10" : "8";
  {
    /* 3. Ajustamos ligeramente la altura (y) para compensar visualmente el tamaño */
  }
  const textY = longitud === 1 ? "9.5" : longitud === 2 ? "10.2" : "9.5";
  const constante_tamaño = 22 / cantidad; // Tamaño constante para cada elemento

  const tarjetas = {
    cerrada: { y: 0 },
    abierta: (indice: number) => ({
      y: -18,
      transition: {
        duration: 0.28,
        delay: (cantidad - 1 - indice) * 0.07,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const tapa = {
    cerrada: { y: 0 },
    abierta: {
      y: 10,
      transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const texto = {
    cerrada: { opacity: 0 },
    abierta: {
      opacity: 10,
    },
  };

  return (
    <motion.div
      className="w-45 shrink-0 sm:w-full h-40 relative flex flex-col items-center justify-center hover:cursor-pointer"
      initial="cerrada"
      animate="cerrada"
      whileHover="abierta"
      onClick={() => navigate(`/lista_lectura/${idLista}`)}
    >
      {Array.from({ length: cantidad }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-sm absolute p-1.5 flex justify-center "
          variants={tarjetas}
          custom={i}
          style={{
            height: `${100 - constante_tamaño * i}%`,
            width: `${100 - constante_tamaño * (cantidad - (i + 1))}%`,
            backgroundColor: bgColor[i],
            zIndex: i,
          }}
        >
          {i === cantidad - 1 && (
            <motion.p variants={texto} className="text-gray-600 font-bold text-lg shadow-md">
              Ver contenido
            </motion.p>
          )}
        </motion.div>
      ))}
      <motion.div
        className="bg-linear-to-bl from-[#e7ddcd] via-[#f3efe7] to-[#d4ddd7] p-3 w-full h-[80%] mt-auto absolute bottom-0 left-0 flex flex-col items-center rounded-tr-md rounded-tl-md border"
        variants={tapa}
        style={{ zIndex: cantidad }}
      >
        <div className="absolute w-[20%] h-3 -top-3 rounded-tr-md rounded-tl-md bg-[#EFE9DE] border-t border-l border-r "></div>
        <h3 className="font-bold text-2xl text-center w-full line-clamp-2 break-all">
          {nombreLista}
        </h3>
        <div className="w-full h-min mt-auto flex justify-between items-center">
          <div
            className="flex gap-1 items-center max-w-[75%] hover:bg-(--bg-surface-muted) rounded-2xl pr-2 transition-bg-color duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/perfil/${encodeURIComponent(autor.codigo_usuario)}`);
            }}
          >
            <div className="aspect-square h-6 relative ">
              <img
                src={`/api/Fotos/perfil/${autor.foto_perfil_usuario}?size=reducida`}
                className="absolute object-cover rounded-full aspect-square w-full h-full"
                loading="lazy"
              />
            </div>
            <p className=" truncate">{autor.nombre_usuario}</p>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="90%"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
            <text
              x="12"
              y={`${textY}`}
              font-size={fontSize}
              text-anchor="middle"
              dominant-baseline="central"
              fill="currentColor"
              stroke="none"
              style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}
            >
              {cantidad_elementos}
            </text>
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}
