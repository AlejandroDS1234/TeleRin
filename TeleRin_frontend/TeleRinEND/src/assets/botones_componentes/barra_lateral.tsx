import { useLocation, useNavigate } from "react-router-dom";
import { useSesion } from "../../pages/hook/usuario/hookSesion";
import { useState } from "react";
import { Search, DoorClosed, Feather, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { useIsLg } from "../../function_generales";
import CerrarSesion from "./cerrar_sesion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: usuario } = useSesion("foto_perfil_usuario");
  const [abierta, setabierta] = useState(false);
  const isLg = useIsLg();

  const resaltado = location.pathname;

  const items = [
    { ruta: "/inicio", Icono: Landmark, Texto: "Inicio" },
    { ruta: "/buscar", Icono: Search, Texto: "Buscar" },
    { ruta: "/editor", Icono: Feather, Texto: "Crear Historia" },
  ];

  const iconos = {
    cerrada: {
      x: 15,
    },
    abierta: {
      x: -1,
    },
  };

  const textos = {
    cerrada: {
      x: -20,
      width: 0,
      height: 0,
      opacity: 0,
      display: "none",
      transition: {
        duration: 0.12,
      },
    },
    abierta: {
      x: 10,
      opacity: 1,
      height: "auto",
      width: "auto",
      display: "block",
    },
  };

  if (!usuario) {
    return (
      <div className="flex top-0 left-0 h-16 bg-(--bg-glass) w-full backdrop-blur-md items-center justify-evenly z-50 shadow-md lg:flex-col lg:py-4 lg:h-full lg:justify-evenly lg:items-center" />
    );
  }

  return (
    <motion.div
      className="flex top-0 left-0 h-16 bg-(--bg-glass) w-full backdrop-blur-md items-center justify-evenly z-50 shadow-md lg:flex-col lg:py-4 lg:h-full lg:justify-evenly lg:items-center"
      onMouseEnter={() => isLg && setabierta(true)}
      onMouseLeave={() => isLg && setabierta(false)}
      variants={{
        cerrada: { width: isLg ? 60 : "100%" },
        abierta: {
          width: isLg ? 180 : "100%",
          transition: {
            staggerChildren: 0.07,
          },
        },
      }}
      animate={abierta ? "abierta" : "cerrada"}
    >
      <motion.button
        className={`lg:w-[90%] justify-center lg:justify-start hover:cursor-pointer flex flex-1 flex-row items-center`}
        onClick={() => navigate("/perfil")}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          variants={{
            cerrada: {
              x: 6,
            },
            abierta: {
              x: -1,
            },
          }}
          className="w-10 h-10 flex justify-center items-center relative"
        >
          {/* Placeholder borroso (imagen reducida) */}
          <img
            src={`/api/Fotos/perfil/${usuario?.foto_perfil_usuario}?size=reducida&t=${usuario?.refrescado ?? 0}`}
            className="absolute inset-0 w-full h-full object-cover rounded-full border-2 border-black"
          />
        </motion.div>

        <motion.p
          variants={textos}
          className={`hidden lg:block lg:whitespace-nowrap ${resaltado === "/perfil" ? "text-(--interactive-selected)" : ""} `}
        >
          Perfil
        </motion.p>
      </motion.button>

      {items.map(({ ruta, Icono, Texto }) => (
        <motion.button
          key={ruta}
          className={`justify-center lg:justify-start lg:w-[90%] hover:cursor-pointer flex flex-1 flex-row items-center`}
          onClick={() => navigate(ruta)}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div variants={iconos} className="w-min h-min">
            <Icono
              color={resaltado === ruta ? "var(--interactive-selected)" : "var(--border-default)"}
            />
          </motion.div>
          <motion.p
            variants={textos}
            className={`hidden lg:block lg:whitespace-nowrap ${resaltado === ruta ? "text-(--interactive-selected)" : ""} `}
          >
            {Texto}
          </motion.p>
        </motion.button>
      ))}
      <CerrarSesion
        boton={
          <motion.button
            className={`justify-center lg:justify-start lg:w-[90%] hover:cursor-pointer flex flex-1 flex-row items-center`}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div variants={iconos} className="w-min h-min">
              <DoorClosed />
            </motion.div>
            <motion.p variants={textos} className={`hidden lg:block lg:whitespace-nowrap `}>
              Salir
            </motion.p>
          </motion.button>
        }
      />
    </motion.div>
  );
}

export default Navbar;
