import { UserRoundPlus, LogIn, Loader,EyeClosed,Mail } from 'lucide-react'
import InputWithIcon from "../assets/componentes/inputWithIcon";
import { Link, useNavigate } from "react-router-dom";
import botones from '../assets/styles/style.ts'
import UseMensajeRedirigir from '../assets/componentes/mensajeRedirigir.tsx';
import { enviarInfoServer, redirigir } from '../function_generales.tsx';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Mensaje from '../assets/componentes/mensaje.tsx';
import Sobrefondo_inicio_sesion from '../assets/sobre_fondos_de_menus/sobre_fondo_iniciar_sesion.tsx';


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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

        {/* CORREO */}
        <InputWithIcon 
            icon={<Mail />}
            placeholder="Correo"
            register={register("correo_usuario", {
            required: "Ingrese su correo",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "El correo no es válido"
            }
            })}
        />
        {errors.correo_usuario && (
            <p className="text-red-500 text-sm">
            {errors.correo_usuario.message}
            </p>
        )}

        {/* CONTRASEÑA */}
        <InputWithIcon 
            icon={<EyeClosed />}
            placeholder="Contraseña"
            type="password"
            register={register("contraseña_usuario", {
            required: "Ingrese su contraseña"
            })}
        />
        {errors.contraseña_usuario && (
            <p className="text-red-500 text-sm">
            {errors.contraseña_usuario.message}
            </p>
        )}

        {/* BOTÓN */}
        <button
            className={`flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition`}
            disabled={cargando}
            type="submit"
        >
            {cargando ? (
            <>
                <p>Iniciando</p>
                <Loader className="animate-spin" />
            </>
            ) : "Iniciar sesión"}
        </button>

        {/* LINK */}
        <Link 
            to="/olvide_mi_contrasena" 
            className={`flex items-center justify-center gap-1 mt-2`}
        >
            ¿Olvidaste tu contraseña?
        </Link>

        {/* MENSAJE */}
        {res && (
            <Mensaje 
            mensaje={res.mensaje} 
            tipo={res.tipo} 
            id={Date.now()} 
            onHide={() => setRes(null)} 
            />
        )}

        </form>
    )
}


function Iniciar_sesion() {
    return (
        <div>
            <div className="absolute top-0 right-0 h-full w-full z-20">
                <Sobrefondo_inicio_sesion />
            </div>
            <div className="relative z-30 iteflex ms-center justify-center top-[30vh] lg:w-[30%] lg:left-[3%] lg:top-[26vh]">
                <div className="bg-white/30 backdrop-blur-2xl p-8 rounded-2xl">
                    <UseMensajeRedirigir />
                    <Iniciar_sesion_Form />
                </div>
            </div>
        </div>
    )
}



export default Iniciar_sesion;



