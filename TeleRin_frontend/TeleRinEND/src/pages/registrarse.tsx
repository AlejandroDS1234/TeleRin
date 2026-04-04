import Header from "../header";
import { useForm } from 'react-hook-form';
import Mensaje from "../assets/componentes/mensaje";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enviarInfoServer } from "../function_generales";
import { redirigir } from "../function_generales";

function FormularioRegistro() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [res, setRes] = useState(null);
    let navigate = useNavigate();

    const onSubmit = async (data) => {
        let res = await enviarInfoServer("http://localhost:1240/registrarse", data);
        console.log(res);
        redirigir(navigate, res);
        setRes(res);
    };

    return (
        <form className="flex flex-col bg-[var(--color_principal)] w-full" onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="Nombre" {...register("nombre_usuario", {
                required: "El nombre es obligatorio",
            })} />
            {errors.nombre_usuario && <p>{errors.nombre_usuario.message}</p>}
            <input placeholder="Correo" {...register("correo_usuario", {
                required: "El correo es obligatorio",
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "El correo no es válido"
                }
            })} />
            {errors.correo_usuario && <p>{errors.correo_usuario.message}</p>}
            <input placeholder="Contraseña" {...register("contraseña_usuario", {
                required: "La contraseña es obligatoria",
                minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres"
                },
                pattern: {
                    value: /^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){1,}).{8,}$/,
                    message: "La contraseña debe tener al menos 3 mayúsculas, 3 minúsculas y un número"
                }
            })} />
            {errors.contraseña_usuario && <p>{errors.contraseña_usuario.message}</p>}
            <button>Registrarse</button>
            {res && (<Mensaje mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} />)}
        </form>
    )
}


function Registrarse() {
    return (
        <>
            <Header />
            <h1>registrarse</h1>
            <FormularioRegistro />
        </>
    )
}
export default Registrarse;