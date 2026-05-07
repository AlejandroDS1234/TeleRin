import { Loader, EyeClosed, BookUser, Eye } from "lucide-react";
import InputWithIcon from "../assets/componentes/inputWithIcon";
import { Link, useNavigate } from "react-router-dom";
import UseMensajeRedirigir from "../assets/componentes/mensajeRedirigir.tsx";
import { enviarInfoServer, redirigir } from "../function_generales.tsx";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Mensaje } from "../assets/componentes/mensaje.tsx";
import Sobrefondo_inicio_sesion from "../assets/sobre_fondos_de_menus/sobre_fondo_iniciar_sesion.tsx";
import type { ApiMessage } from "../types.ts";

type IniciarSesionForm = {
    correo_usuario: string;
    contraseña_usuario: string;
};

function Iniciar_sesion_Form() {
    const { register, handleSubmit, formState: { errors } } = useForm<IniciarSesionForm>();
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [res, setRes] = useState<ApiMessage | null>(null);
    const [mostrarContraseña, setMostrarContraseña] = useState(false);

    const onSubmit = async (data: IniciarSesionForm) => {
        setCargando(true);
        setRes(null);
        try {
            const res = await enviarInfoServer<ApiMessage, IniciarSesionForm>("/api/iniciar_sesion", data);
            setRes(res);
            redirigir(navigate, res);
        } catch {
            setRes({ mensaje: "Error de conexión", tipo: "danger" });
        } finally {
            setCargando(false);
        }
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <InputWithIcon
                icon={<BookUser />}
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

            <InputWithIcon
                icon={mostrarContraseña ? <Eye onClick={() => setMostrarContraseña(false)} className="hover:cursor-pointer animate-pulse" /> : <EyeClosed onClick={() => setMostrarContraseña(true)} className="hover:cursor-pointer animate-pulse" />}
                placeholder="Contraseña"
                type={mostrarContraseña ? "text" : "password"}
                register={register("contraseña_usuario", {
                    required: "Ingrese su contraseña"
                })}
            />
            {errors.contraseña_usuario && (
                <p className="text-red-500 text-sm">
                    {errors.contraseña_usuario.message}
                </p>
            )}

            <button
                className="flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
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

            <Link
                to="/olvide_mi_contrasena"
                className="flex items-center justify-center gap-1 mt-2"
            >
                ¿Olvidaste tu contraseña?
            </Link>

            <UseMensajeRedirigir />
            {res && (
                <Mensaje
                    mensaje={res.mensaje}
                    tipo={res.tipo}
                    id={1}
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
            <div className="relative z-30 iteflex ms-center justify-center top-[30vh] lg:w-[30%] lg:left-[35%] lg:top-[26vh]">
                <div className="bg-white/30 backdrop-blur-2xl p-8 rounded-2xl">
                    <Iniciar_sesion_Form />
                </div>
            </div>
        </div>
    )
}

export default Iniciar_sesion;
