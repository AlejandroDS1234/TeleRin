import Editor from "../assets/componentes/editor_texto.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader, BookHeart, Book } from 'lucide-react'
import { redirigir } from "../function_generales.tsx";
import { useNavigate } from "react-router-dom";
import { MensajePlano } from "../assets/componentes/mensaje.tsx";


function Calificacion() {
    const { id_historia } = useParams();
    const [calificacion, setCalificacion] = useState(0);
    const [res, setRes] = useState(null);

    useEffect(() => {
        const fetchCalificacion = async () => {
            try {
                const res = await fetch(`/api/calificacion_historia/${encodeURIComponent(id_historia)}`, { method: "POST", credentials: "include" })
                const calificacion = await res.json();
                setCalificacion(calificacion);
            } catch (error) {
                console.log(error);
            }
        };
        fetchCalificacion();
    }, [])

    const enviarCalificacion = async (calificacion) => {
        try {
            const res = await fetch(`/api/calificar_historia/${encodeURIComponent(id_historia)}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "calificacion": calificacion })
            });
            const data = await res.json();
            setRes(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex">
            <p>Calificar:</p>
            <div className="flex">
                {
                    Array.from({ length: 3 }).map((_, i) => (
                        <button type="button" key={i} className="flex hover:cursor-pointer"
                            onClick={() => { setCalificacion(calificacion === (i + 1) ? 0 : i + 1); enviarCalificacion(calificacion === (i + 1) ? 0 : i + 1) }}>
                            {i + 1 <= calificacion ? <BookHeart color="#FF0000" /> : <Book />}
                        </button>
                    ))
                }
            </div>
        </div>
    )

}



function Historias() {
    const navigate = useNavigate();
    const [contenido, setContenido] = useState(null);
    const [cargando, setCargando] = useState(true);
    const { id_historia } = useParams()

    useEffect(() => {
        const fetchContenido = async () => {
            try {
                ;
                console.log(id_historia)
                const res = await fetch(`/api/historia/${encodeURIComponent(id_historia)}`, { method: "POST", credentials: "include" })
                const historia = await res.json();
                redirigir(navigate, historia);
                setContenido(historia);
            } catch (error) {
                console.log(error);
            } finally {
                setCargando(false);
            }
        };
        fetchContenido();
    }, []);

    if (cargando) {
        return (
            <div className="flex justify-center lg:items-center">
                <div className="min-h-screen bg-[#e5e3dc] w-full max-w-[700px] h-[90vh] shadow-xl flex flex-col items-center p-4">
                    <p>Cargando<Loader className="animate-spin" /></p>
                </div>
            </div>
        )
    }
    console.log(contenido)

    return (
        <div className="flex justify-center lg:items-center">
            <div className="min-h-screen bg-[#e5e3dc] w-full max-w-[700px] h-[90vh] shadow-xl flex flex-col items-center p-4">

                <Editor
                    soloLectura={false}
                    contenidoInicial={contenido.historia.contenido_historia}
                    onChangeContenido={null}
                    toolbarItems={[
                        {
                            type: "custom",
                            value: "titulo",
                            className: "flex-1",
                            content: (<h2 className="font-bold">{contenido.historia.nombre_historia}</h2>)
                        },
                        {
                            type: "custom",
                            value: "calificar",
                            className: "ml-auto",
                            content: (
                                <Calificacion />
                            )
                        }
                    ]}
                ></Editor>

            </div>
        </div>
    )

}

export default Historias