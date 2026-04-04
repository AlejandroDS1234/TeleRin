import { UserRoundPlus, LogIn, Loader } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom";
import botones from '../assets/styles/style.ts'
import UseMensajeRedirigir from '../assets/componentes/mensajeRedirigir.tsx';
import { enviarInfoServer, redirigir } from '../function_generales.tsx';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Mensaje from '../assets/componentes/mensaje.tsx';


function Iniciar_sesion_Form() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navegate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [res, setRes] = useState(null);

    const onSubmit = async (data: any) => {
        setCargando(true);
        setRes(null); // Limpiar mensaje anterior
        try {
            let res = await enviarInfoServer("http://localhost:1240/iniciar_sesion", data);
            setRes(res);
            redirigir(navegate, res);
        } catch (error) {
            console.log(error);
            setRes({ mensaje: "Error de conexión", tipo: "danger" });
        } finally {
            setCargando(false);
        };
    };

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <input autoComplete='off' placeholder="Correos" {...register("correo_usuario", { required: "Ingrese su correo", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "El correo no es válido" } })} />
            {errors.correo_usuario && <p>{errors.correo_usuario.message}</p>}
            <input autoComplete='off' placeholder="Contraseña" {...register("contraseña_usuario", { required: "Ingrese su contraseña" })} />
            {errors.contraseña_usuario && <p>{errors.contraseña_usuario.message}</p>}
            <button className={`${botones.primario} flex`} disabled={cargando} type="submit">
                {cargando ? <><p>Iniciando</p><Loader className="animate-spin" /></> : "Iniciar sesión"}
            </button>
            <Link to="/olvide_mi_contrasena" className={`${botones.secundario} flex items-center gap-1 w-max`}>¿Olvidaste tu contraseña?</Link>
            {res && (<Mensaje mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />)}

        </form>
    )
}


function Iniciar_sesion() {
    return (
        <>
            <UseMensajeRedirigir />
            <Iniciar_sesion_Form />
        </>
    )
}



export default Iniciar_sesion;



