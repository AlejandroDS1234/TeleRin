import { useUser } from "../assets/componentes/userContext";
import { useState , useEffect} from "react";
import { Sagacard, HistoriaCard } from "../assets/componentes/sagas&historias_cards";
import UseMensajeRedirigir from "../assets/componentes/mensajeRedirigir";
import { Loader } from 'lucide-react'
import Sobrefondo_principal from "../assets/sobre_fondos_de_menus/sobre_fondo_principal";


function Sagas() {
    const [sagas, setSagas] = useState([]);
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(false);
    useEffect(() => {
        const sagasBack = async () => {
            try {
                let pro = await fetch("http://localhost:1240/simulacion_recomenda_sagas", {method:"POST", credentials:"include"})
                let sagas = await pro.json()
                setSagas(sagas)
                setCargando(false)
            } catch (Error) {
                setError(true)
                console.log(Error)
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
                <p>Cargando <Loader className="animate-spin"/></p>
            </div>
        )
    }

    return(
        <>
            {sagas.map(saga => (
                <Sagacard
                    key={`${saga.id_saga}`}
                    ids={`${saga.id_saga}`}
                    img={`${saga.imagen_saga}`}
                    titulo={`${saga.nombre_saga}`}
                    libros={`${ saga.libros}`}
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
                let pro = await fetch("http://localhost:1240/simulacion_recomendar_libros", {method:"POST", credentials:"include"})
                let historias = await pro.json()
                console.log(historias)
                setHistorias(historias)
                setCargando(false)
            } catch (Error) {
                setError(true)
                console.log(Error)
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
                <p>Cargando <Loader className="animate-spin"/></p>
            </div>
        )
    }

    return(
        <>
            {historias.map(historia => (
                <HistoriaCard
                    key={`${historia.id_historia}`}
                    idh={`${historia.id_historia}`}
                    titulo={`${historia.nombre_historia}`}
                    descripcion={`${historia.descripcion_historia}`}
                    calificacion={`${ historia.calificacion_p}`}
                />
            ))}
        </>
    ) 
}


function Inicio() {
    const { usuario } = useUser();
    console.log("estoy en inicio")
    return (
        <div>
            <div className="absolute top-0 left-0 h-full w-full z-10">
                <Sobrefondo_principal />
            </div>
            <div className="relative z-20 font-serif text-gray-900 bg-[#f5f0e6]">
                    <section className="p-4 bg-[] aling-center flex flex-col w-full z-20">
                        <h4 className="text-2xl font-bold border-b border-black mb-2 uppercase tracking-wide">Sagas Recomendadas</h4>
                        <div className="flex w-full gap-4 overflow-x-scroll bg-[#f5f0e6] border border-black">
                            <Sagas classname="bg-[#f5f0e6]"/>
                        </div>
                    </section>
            </div>
            <br />
            <div className="relative z-20 font-serif text-gray-900 bg-[#f5f0e6]">
                    <section className="p-2">
                        <h4 className="text-2xl font-bold border-b border-black mb-2 uppercase tracking-wide">Historias Recomendadas</h4>
                        <div className="flex w-full gap-4 overflow-x-scroll sm:flex-row z-20 bg-[#fdfaf3] border border-black">
                            <Historias/>
                        </div>
                    </section>
                    <div className="fixed bottom-18 lg:bottom-10 bg-[#f5f0e6]">
                        <UseMensajeRedirigir/>
                    </div>
            </div>
        </div>
    );
}

export default Inicio;