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
        <div>
            <img src={`http://localhost:1240/Fotos/perfil/${usuario.foto_perfil_usuario}`}/>
            <InputWithIcon
                icon={<BookUser/>}
                autoComplete="off"
                placeholder="Nombre Usuario"
                value={usuario.nombre_usuario}
            />
        </div>
    )
}


function Perfil() {
    return (
        <Datos/>
    )
}

export default Perfil