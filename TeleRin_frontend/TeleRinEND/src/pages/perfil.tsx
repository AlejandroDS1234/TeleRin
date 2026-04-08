import { useUser } from "../assets/componentes/userContext"
import InputWithIcon from "../assets/componentes/inputWithIcon"
import { BookUser } from 'lucide-react'
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"


function Historial() {
    return (
        <div>hi</div>
    )
}

function Datos() {
    const {register, handleSubmit, formState: { errors }} = useForm()
    const [res, setRes] = useState(null)

    const [cargando, setCargando] = useState(false)

    const {usuario} = useUser()


    return (
        <div className="max-w-md mx-auto bg-[#F4E2B6] border-4 border-black p-6 font-serif text-center shadow-xl">

            <h1 className="text-4xl font-extrabold tracking-widest border-b-4 border-black pb-2 mb-4">
                SE BUSCA
            </h1>

            {/* Imagen */}
            <div className="flex justify-center mb-4">
                <img 
                    className="w-40 h-40 object-cover border-2 border-black grayscale"
                    src={`http://localhost:1240/Fotos/perfil/${usuario.foto_perfil_usuario}`} 
                />
            </div>

            <h2 className="text-xl font-bold uppercase border-y-2 border-black py-2 mb-3">
                Lector Serial
            </h2>

            <p className="text-left mb-2">
                <span className="font-bold">Nombre:</span> {usuario.nombre_usuario}
            </p>

            <p className="text-left mb-4">
                <span className="font-bold">Descripción:</span> Acusado de tener un mundo entero de conocimiento en la palma de su mano.
            </p>

            <div className="border-t-2 border-black pt-3 mt-4">
                <p className="font-bold uppercase">Se busca información</p>
            </div>

        </div>
    )
}


function Perfil() {
    return (
        <Datos/>
    )
}

export default Perfil