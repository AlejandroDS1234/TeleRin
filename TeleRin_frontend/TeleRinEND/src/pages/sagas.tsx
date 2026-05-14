import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { redirigir, ColorRandom } from "../function_generales";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HistoriaCard, HistoriaCardCargando } from "../assets/componentes/sagas&historias_cards";


function SagasInfo() {
    const navigate = useNavigate();
    const {id_saga = ""} = useParams();
    const [fotoCargada, setFotoCargada] = useState(false);
    const { isLoading, error, data } = useQuery({
        queryKey: ['sagas', id_saga],
        queryFn: async () => {
            const response = await fetch(`/api/saga_info/${encodeURIComponent(id_saga)}`);
            const data = await response.json();
            redirigir(navigate, data);
            return data;
        }
    })

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <Loader className="animate-spin" />
        </div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen">
            <p className="text-red-500">Error loading saga information. {error.message}</p>
        </div>;
    }

    return (
        <div>
            <div 
                className="relative h-43 w-30"
                style={{ backgroundColor: ColorRandom() }}
            >
                <img 
                    src={`/api/Fotos/fotos_sagas/${data.imagen_saga}?size=reducida`} 
                    alt={data.nombre_saga} 
                    className="w-full h-full object-cover absolute" 
                    style={{ opacity: fotoCargada? 0: 1 }}
                />

                <img
                    src={`/api/Fotos/fotos_sagas/${data.imagen_saga}`}
                    alt={data.nombre_saga}
                    onLoad={() => setFotoCargada(true)}
                    style={{ opacity: fotoCargada? 1:0}}
                    className=" w-full h-full object-cover transition-opacity duration-500"
                />
            </div>
            <h1>nombre: {data.nombre_saga}</h1>
            <p>nombre: {data.descripcion_saga}</p>
            <p>Libros: {data.libros}</p>
            <p>Autor: {data.nombre_usuario}</p>
        </div>
    )
}

function SagasHistorias() {
    const {id_saga = ""} = useParams();
    const {isLoading, error, data} = useQuery({
        queryKey: ['sagas_historia', id_saga],
        queryFn: async () => {
            const response = await fetch(`/api/sagas_historias/${encodeURIComponent(id_saga)}`, {
                method: 'POST'
            });
            const data = await response.json();
            console.log(data);
            return data;
        }
    })
    if (isLoading) {
        return <>
            {[...Array(5)].map((_, index) => (
                <HistoriaCardCargando key={index} />
            ))}
        </>;
    }
    if (error) {
        return <div className="flex items-center justify-center h-screen">
            <p className="text-red-500">Error loading saga stories. {error.message}</p>
        </div>;
    }

    return (
        <>
            {data.length ? data.map((historia: any) => (
                <HistoriaCard 
                    key={historia.id_historia}
                    idh={historia.id_historia}
                    titulo={historia.nombre_historia}
                    descripcion={historia.descripcion_historia}
                    calificacion={historia.calificacion_p}
                    autor={historia.nombre_usuario}
                />
            )): <p>Sin historias</p>}
        </>
    )
}

function Sagas() {
    return (
        <>
        <SagasInfo />
        <div>
            <SagasHistorias />
        </div>
        </>
    )
}


export default Sagas;