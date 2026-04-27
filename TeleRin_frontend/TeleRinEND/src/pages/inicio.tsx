import { useUser } from "../assets/componentes/userContext";
import { useState, useEffect } from "react";
import { Sagacard, HistoriaCard } from "../assets/componentes/sagas&historias_cards";
import UseMensajeRedirigir from "../assets/componentes/mensajeRedirigir";
import { Loader } from 'lucide-react'
import Sobrefondo_principal from "../assets/sobre_fondos_de_menus/sobre_fondo_principal";
import { motion } from 'framer-motion'


function HistoriasPrincipales() {
    return (
        <div className="relative sm:flex-row max-h-lg min-h-lg sm:max-h-90 sm:min-h-90 bg-[#e4e0d6]">
            <img
                src="https://media.istockphoto.com/id/1127245421/es/foto/manos-de-mujer-pidiendo-la-bendici%C3%B3n-de-dios-sobre-fondo-puesta-de-sol.webp?s=1024x1024&w=is&k=20&c=rckoeBloyLTsIHQabNQRzxtgKAzZrakd4IIlKDU3nRw="
                className="object-cover w-full h-full"
            />
            <div className="absolute bottom-6 right-6 sm:right-12 max-w-[90%] sm:max-w-sm text-right">
                <h3 className="wrap-break-word font-bold text-2xl sm:text-3xl text-center bg-white/50 backdrop-blur-md rounded-2xl p-2">
                    Nombre de la sega a la que estamos llamando :)
                </h3>
                <br className="hidden sm:block " />
                <p className="hidden sm:block bg-white/50 backdrop-blur-md rounded-2xl p-2">
                    descripcion Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, quasi necessitatibus, ipsum facilis animi debitis, culpa sed laboriosam qui vitae aliquid porro ab provident nesciunt ducimus. Temporibus recusandae expedita obcaecati.
                </p>
            </div>
        </div>
    )
}


function Sagas() {
    const [sagas, setSagas] = useState([]);
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(false);
    useEffect(() => {
        const sagasBack = async () => {
            try {
                let pro = await fetch("/api/simulacion_recomenda_sagas", { method: "POST", credentials: "include" })
                let sagas = await pro.json()
                setSagas(sagas)
                setCargando(false)
            } catch (Error) {
                setError(true)
            }

        }
        sagasBack()
    }, [])

    if (error) {
        return (
            <div>
                <p>error al cargar las sagas</p>
            </div>
        )
    }

    if (cargando) {
        return (
            <div>
                <p>Cargando <Loader className="animate-spin" /></p>
            </div>
        )
    }

    return (
        <>
            {sagas.map(saga => (
                <Sagacard
                    key={`${saga.id_saga}`}
                    ids={`${saga.id_saga}`}
                    img={`${saga.imagen_saga}`}
                    descripcion={`${saga.descripcion_saga}`}
                    titulo={`${saga.nombre_saga}`}
                    libros={`${saga.libros}`}
                />
            ))}
        </>
    )
}


function Historias() {
    const [historias, setHistorias] = useState([]);
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(false);
    useEffect(() => {
        const historiasBack = async () => {
            try {
                let pro = await fetch("/api/simulacion_recomendar_libros", { method: "POST", credentials: "include" })
                let historias = await pro.json()
                setHistorias(historias)
                setCargando(false)
            } catch (Error) {
                setError(true)
            }

        }
        historiasBack()
    }, [])

    if (error) {

        return (
            <div>
                <p>error al cargar las historias</p>
            </div>
        )
    }

    if (cargando) {
        return (
            <div>
                <p>Cargando <Loader className="animate-spin" /></p>
            </div>
        )
    }

    return (
        <>
            {historias.map(historia => (
                <HistoriaCard
                    key={`${historia.id_historia}`}
                    idh={`${historia.id_historia}`}
                    titulo={`${historia.nombre_historia}`}
                    descripcion={`${historia.descripcion_historia}`}
                    calificacion={`${historia.calificacion_p}`}
                    autor={`${historia.nombre_usuario}`}
                />
            ))}
        </>
    )
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
            {/* <div className="absolute top-0 left-0 h-full w-full z-10">
                <Sobrefondo_principal />
            </div> */}
            <div className="relative z-20 font-serif text-gray-900 ">
                <section className="p-4 bg-[] aling-center flex flex-col w-full z-20">
                    <h4 className="text-2xl font-bold border-b border-black mb-2 uppercase tracking-wide">Sagas Principales</h4>
                    <div className="flex w-full justify-center gap-4">
                        <HistoriasPrincipales />
                    </div>
                </section>
            </div>
            <br />

            <div className="relative z-20 font-serif text-gray-900 ">
                <section
                    className="p-4 bg-[] aling-center flex flex-col w-full z-20">
                    <h4 className="text-2xl font-bold border-b border-black mb-2 uppercase tracking-wide">Sagas Recomendadas</h4>
                    <div className=" flex overflow-x-scroll overflow-y-hidden sm:overflow-hidden sm:grid w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 z-20">
                        <Sagas />
                    </div>
                </section>
            </div>
            <br />

            <div className="relative z-20 font-serif text-gray-900 ">
                <section className="p-2">
                    <h4 className="text-2xl font-bold border-b border-black mb-2 uppercase tracking-wide">Historias Recomendadas</h4>
                    <div
                        className=" flex overflow-x-scroll sm:overflow-auto sm:grid w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 z-20"
                    >
                        <Historias />
                    </div>
                </section>
            </div>
            <div className="z-30 fixed bottom-18 lg:bottom-18 bg-[#f5f0e6]">
                <UseMensajeRedirigir />
            </div>
        </motion.div>
    );
}

export default Inicio;
