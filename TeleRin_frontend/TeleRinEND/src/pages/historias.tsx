import Historia from "../assets/componentes/visalizar_texto.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from 'lucide-react'
import { redirigir } from "../function_generales.tsx";
import { useNavigate } from "react-router-dom";




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
                const res = await fetch(`/api/historia/${id_historia}`, { method: "POST", credentials: "include" })
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

                <Historia contenidoInicial={contenido.contenido_historia}></Historia>

            </div>
        </div>
    )

}

export default Historias