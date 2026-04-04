import { useForm } from 'react-hook-form';
import Mensaje from "../assets/componentes/mensaje";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enviarInfoServer, redirigir, cambiarTamañoBarraContraseña } from "../function_generales";
import { EyeClosed, Eye, Loader } from "lucide-react";


function FormularioRegistro() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [res, setRes] = useState(null);
    let navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const onSubmit = async (data) => {
        setCargando(true);
        try {
            let res = await enviarInfoServer("http://localhost:1240/registrarse", data);
            console.log(res);
            redirigir(navigate, res);
            setRes(res);
        } catch (error) {
            console.log(error);
        } finally {
            setCargando(false);
        }
    };

    const [mostrarContraseña, setMostrarContraseña] = useState(false);
    const [contraseñaSegura, setContraseñaSegura] = useState(1);
    const [colorBarra, setColorBarra] = useState("#0000FF");
    const handleContraseñaChange = (e) => {
        const valor = e.target.value;
        const { width, color } = cambiarTamañoBarraContraseña(valor);
        setContraseñaSegura(width);
        setColorBarra(color);
    };
    return (
        <form className="flex flex-col bg-[var(--color_principal)] w-full" onSubmit={handleSubmit(onSubmit)}>
            <input autoComplete="off" placeholder="Nombre" {...register("nombre_usuario", {
                required: "El nombre es obligatorio",
            })} />
            {errors.nombre_usuario && <p>{errors.nombre_usuario.message}</p>}
            <input autoComplete="off" placeholder="Correo" {...register("correo_usuario", {
                required: "El correo es obligatorio",
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "El correo no es válido"
                }
            })} />
            {errors.correo_usuario && <p>{errors.correo_usuario.message}</p>}
            <div className="flex items-center gap-1">
                <input autoComplete="off" type={mostrarContraseña ? "text" : "password"} placeholder="Contraseña" {...register("contraseña_usuario", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                        value: 8,
                        message: "La contraseña debe tener al menos 8 caracteres"
                    },
                    pattern: {
                        value: /^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){1,}).{8,}$/,
                        message: "La contraseña debe tener al menos 3 mayúsculas, 3 minúsculas y un número"
                    },
                    onChange: (e) => {
                        handleContraseñaChange(e)
                    }
                })} />
                {mostrarContraseña ? <Eye onClick={() => setMostrarContraseña(false)} className="" /> : <EyeClosed onClick={() => setMostrarContraseña(true)} className="" />}
            </div>
            <div className="h-4 bg-[var(--color_bordes)] rounded-full flex items-center px-2">
                <div className="h-2 rounded-full" style={{ width: `${parseInt(contraseñaSegura)}%`, backgroundColor: colorBarra }}></div>
            </div>
            {errors.contraseña_usuario && <p>{errors.contraseña_usuario.message}</p>}
            <button type="submit" disabled={cargando} className="flex items-center gap-2">
                {cargando ? <> <p>Registrando</p> <Loader className="animate-spin" /> </> : "Registrarse"}
            </button>
            {res && (<Mensaje mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />)}
        </form>
    )
}


function Registrarse() {
    return (
        <>
            <h1>registrarse</h1>
            <FormularioRegistro />
        </>
    )
}
export default Registrarse;