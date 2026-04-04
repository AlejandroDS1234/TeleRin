import { useForm } from 'react-hook-form';
import Mensaje from "../assets/componentes/mensaje";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enviarInfoServer, redirigir, cambiarTamañoBarraContraseña } from "../function_generales";
import { EyeClosed, Eye, Loader } from "lucide-react";
import Sobrefondo_registro from "../assets/sobre_fondos_de_menus/sobre_fondo_registro";


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
        <div>
            <form className="flex flex-col bg-[var(--color_principal)] w-full" onSubmit={handleSubmit(onSubmit)}>
                <input
                    autoComplete="off"
                    placeholder="Nombre"
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...register("nombre_usuario", {
                        required: "El nombre es obligatorio",
                    })} />
                {errors.nombre_usuario && (
                    <p className="text-red-500 text-sm">
                        {errors.nombre_usuario.message}
                    </p>
                )}

                <input
                    autoComplete="off"
                    placeholder="Correo"
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    {...register("correo_usuario", {
                        required: "El correo es obligatorio",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "El correo no es válido"
                        }
                    })} />
                {errors.correo_usuario && (
                    <p className="text-red-500 text-sm">
                        {errors.correo_usuario.message}
                    </p>
                )}

                <div className="w-full flex items-center gap-1">
                    <input
                        autoComplete="off"
                        type={mostrarContraseña ? "text" : "password"}
                        placeholder="Contraseña"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        {...register("contraseña_usuario", {
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


                <button
                    type="submit"
                    disabled={cargando}
                    className="flex items-center justify-center gap-3 mt-4 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                    {cargando ? <> <p>Registrando</p> <Loader className="animate-spin" /> </> : "Registrarse"}
                </button>
                {res && (<Mensaje mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />)}
            </form>
        </div>
    )
}


function Registrarse() {
    return (
        <>
            <div className="absolute top-0 right-0 h-full w-full lg:w-2/4 z-20">
                <Sobrefondo_registro />
            </div>
            <div className="relative z-30 iteflex ms-center justify-center top-[30vh] lg:justify-start lg:w-[30%] lg:left-[10%] lg:top-[26vh]">
                <div className="bg-white/30 backdrop-blur-2xl p-8 rounded-2xl">
                    <FormularioRegistro />
                </div>
            </div>
        </>
    )
}
export default Registrarse;