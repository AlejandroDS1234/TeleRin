import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../componentes/userContext";
import { useState } from "react";
import { Search, DoorClosed, Feather, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { useIsLg, redirigir } from "../../function_generales";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, setUsuario } = useUser();
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
      x: 15
    },
    abierta: {
      x: -1
    }
  }

  const textos = {
    cerrada: {
      x: -20,
      width: 0,
      height: 0,
      opacity: 0,
      display: "none",
      transition: {
        duration: 0.12
      }
    },
    abierta: {
      x: 10,
      opacity: 1,
      height: "auto",
      width: "auto",
      display: "block",

    }
  }

  if (!usuario) {
    return null;
  }

  return (
    <motion.div
      className="flex top-0 left-0 h-16 bg-white/30 w-full backdrop-blur-md items-center justify-evenly z-50 shadow-md lg:flex-col lg:py-4 lg:h-full lg:justify-evenly lg:items-center"
      onMouseEnter={() => isLg && setabierta(true)}
      onMouseLeave={() => isLg && setabierta(false)}
      variants={{
        cerrada: { width: isLg ? 60 : "100%" },
        abierta: {
          width: isLg ? 180 : "100%",
          transition: {
            staggerChildren: 0.07
          }
        }
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
              x: 6
            },
            abierta: {
              x: -1
            }
          }}
          className="w-10 h-10 flex justify-center items-center "
        >
          <motion.img

            className="h-10 aspect-square rounded-full border-2"
            style={{ borderColor: resaltado === "/perfil" ? "#FF0000" : "#000" }}
            src={`/api/Fotos/perfil/${usuario.foto_perfil_usuario}?t=${Date.now()}`}
          />
        </motion.div>

        <motion.p variants={textos}
          className={`hidden lg:block lg:whitespace-nowrap ${resaltado === "/perfil" ? "text-[#FF0000]" : ""} `}>Perfil</motion.p>
      </motion.button>

      {items.map(({ ruta, Icono, Texto }) => (
        <motion.button
          key={ruta}
          className={`justify-center lg:justify-start lg:w-[90%] hover:cursor-pointer flex flex-1 flex-row items-center`}
          onClick={() => navigate(ruta)}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            variants={iconos}
            className="w-min h-min"
          >
            <Icono color={resaltado === ruta ? "#FF0000" : "#000"} />
          </motion.div>
          <motion.p variants={textos}
            className={`hidden lg:block lg:whitespace-nowrap ${resaltado === ruta ? "text-[#FF0000]" : ""} `}>{Texto}</motion.p>
        </motion.button>
      ))}
      <motion.button
        className={`justify-center lg:justify-start lg:w-[90%] hover:cursor-pointer flex flex-1 flex-row items-center`}
        onClick={async () => {
          const pro = await fetch("/api/cerrar_sesion", {
            method: "POST",
            credentials: "include"
          })
          const res = await pro.json()
          if (pro.ok) {
            setUsuario(null);
            sessionStorage.clear();
            redirigir(navigate, res)
          }
        }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          variants={iconos}
          className="w-min h-min"
        >
          <DoorClosed />
        </motion.div>
        <motion.p variants={textos}
          className={`hidden lg:block lg:whitespace-nowrap `}>Cerrar Sesión</motion.p>
      </motion.button>
    </motion.div>
  );
}

export default Navbar;
