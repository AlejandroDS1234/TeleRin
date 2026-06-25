import { useState, useEffect } from "react";
import { useRef } from "react";
import { Sagacard, SagaCardCargando } from "../assets/componentes/sagas_cards";
import { HistoriaCard, HistoriaCardCargando } from "../assets/componentes/historias_cards";
import { motion } from "framer-motion";
import type { Historia, Saga } from "../types";
import imagen_inicio from "../assets/imagenes/imagen_inicio.webp";

function HistoriasPrincipales() {
  return (
    <div className="relative sm:flex-row max-h-lg min-h-lg sm:max-h-90 sm:min-h-90 bg-(--color_principal_opaco)">
      <img src={imagen_inicio} className="object-cover w-full h-full" />
    </div>
  );
}

function MasSagasCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative p-4 bg-(--color_principal_opaco) flex flex-col justify-center items-center border-2 border-(--color_bordes) border-double h-70 w-40 flex-none"
    >
      <h3 className="font-bold text-2xl text-(--color_texto_oscuro) font-serif text-center">
        Más sagas
      </h3>
    </button>
  );
}

function ModalSagas({ sagas, cerrar }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    let desplazamiento = 0;

    const handleWheel = (e) => {
      desplazamiento += e.deltaY;

      filasRef.current.forEach((fila, index) => {
        if (!fila) return;

        const direccion = index % 2 === 0 ? 1 : -1;

        fila.style.transform = `translateX(${desplazamiento * 0.3 * direccion}px)`;
      });
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const chunkArray = (array, size) => {
    const result = [];

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }

    return result;
  };

  const filasRef = useRef([]);

  const filas = chunkArray(sagas, 5);

  return (
    <div className="fixed inset-0 bg-black/70 z-50" onClick={cerrar}>
      {/* MOBILE */}
      <div className="lg:block h-screen overflow-y-auto lg:hidden p-3 pt-25 space-y-10">
        <div
          className="grid grid-cols-2 gap-2 pt-6 h-[calc(100vh-80px)] w-full overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {sagas.map((saga) => (
            <Sagacard
              key={saga.id_saga}
              ids={saga.id_saga}
              img={saga.imagen_saga}
              descripcion={saga.descripcion_saga}
              titulo={saga.nombre_saga}
              libros={saga.libros ?? 0}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block h-screen overflow-y-auto">
        <div className="py-20 space-y-10">
          {filas.map((fila, index) => (
            <div
              key={index}
              ref={(el) => (filasRef.current[index] = el)}
              className={`
                flex gap-6 w-max
                ${index % 2 === 0 ? "ml-10" : "ml-40"}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {fila.map((saga) => (
                <Sagacard
                  key={saga.id_saga}
                  ids={saga.id_saga}
                  img={saga.imagen_saga}
                  descripcion={saga.descripcion_saga}
                  titulo={saga.nombre_saga}
                  libros={saga.libros ?? 0}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sagas() {
  const [sagas, setSagas] = useState<Saga[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const sagasPreview = sagas.slice(0, 15);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const sagasBack = async () => {
      try {
        const pro = await fetch("/api/simulacion_recomenda_sagas", {
          method: "POST",
          credentials: "include",
        });
        const sagas = await pro.json();
        setSagas(sagas as Saga[]);
        setCargando(false);
      } catch {
        setError(true);
      }
    };
    sagasBack();
  }, []);

  if (error) {
    return <p className="text-(--color_texto_oscuro)">error al cargar las sagas</p>;
  }

  if (cargando) {
    return (
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <SagaCardCargando key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      {sagasPreview.map((saga) => (
        <Sagacard
          key={saga.id_saga}
          ids={saga.id_saga}
          img={saga.imagen_saga}
          descripcion={saga.descripcion_saga}
          titulo={saga.nombre_saga}
          libros={saga.libros ?? 0}
        />
      ))}
      {/* <MasSagasCard onClick={() => setModalAbierto(true)} />
      {modalAbierto && <ModalSagas sagas={sagas} cerrar={() => setModalAbierto(false)} />} */}
    </>
  );
}

function Historias() {
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const historiasBack = async () => {
      try {
        const pro = await fetch("/api/simulacion_recomendar_libros", {
          method: "POST",
          credentials: "include",
        });
        const historias = await pro.json();
        setHistorias(historias as Historia[]);
        setCargando(false);
      } catch {
        setError(true);
      }
    };
    historiasBack();
  }, []);

  if (error) {
    return <p className="text-(--color_texto_oscuro)">error al cargar las historias</p>;
  }

  if (cargando) {
    return (
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <HistoriaCardCargando key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      {historias.map((historia) => (
        <HistoriaCard
          key={historia.id_historia}
          idh={historia.id_historia}
          titulo={historia.nombre_historia}
          descripcion={historia.descripcion_historia}
          calificacion={historia.calificacion_p}
          autor={{
            nombre_usuario: historia.nombre_usuario,
            foto_perfil_usuario: historia.foto_perfil_usuario,
            codigo_usuario: historia.codigo_usuario,
          }}
        />
      ))}
    </>
  );
}

function Inicio() {
  const yaAnimado = sessionStorage.getItem("inicio-animado");
  return (
    <motion.div
      initial={yaAnimado ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
      viewport={{ once: true }}
      onAnimationComplete={() => sessionStorage.setItem("inicio-animado", "true")}
    >
      <div className="relative z-20 font-serif text-(--color_texto_oscuro)">
        <section className="p-4 aling-center flex flex-col w-full z-20">
          <h4 className="text-2xl font-bold border-b border-(--color_bordes) mb-2 uppercase tracking-wide">
            Sagas Principales
          </h4>
          <div className="flex w-full justify-center gap-4">
            <HistoriasPrincipales />
          </div>
        </section>
      </div>
      <br />

      <div className="relative z-20 font-serif text-(--color_texto_oscuro)">
        <section className="p-4 aling-center flex flex-col w-full">
          <h4 className="text-2xl font-bold border-b border-(--color_bordes) mb-2 uppercase tracking-wide">
            Sagas Recomendadas
          </h4>
          <div className="flex overflow-x-scroll overflow-y-hidden sm:overflow-hidden sm:grid w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 z-20">
            <Sagas />
          </div>
        </section>
      </div>
      <br />

      <div className="relative font-serif text-(--color_texto_oscuro)">
        <section className="p-4 aling-center flex flex-col w-full">
          <h4 className="text-2xl font-bold border-b border-(--color_bordes) mb-2 uppercase tracking-wide">
            Historias Recomendadas
          </h4>
          <div className="flex overflow-x-auto sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            <Historias />
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default Inicio;
