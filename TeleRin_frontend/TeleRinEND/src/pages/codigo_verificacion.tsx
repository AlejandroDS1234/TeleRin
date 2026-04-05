import UseMensajeRedirigir from "../assets/componentes/mensajeRedirigir";
import { useForm } from "react-hook-form";
import { enviarInfoServer, redirigir } from "../function_generales";
import { Loader, Hash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Mensaje from "../assets/componentes/mensaje";
import InputWithIcon from "../assets/componentes/inputWithIcon";
import Sobrefondo_olvido_contraseña from "../assets/sobre_fondos_de_menus/sobre_fondo_olvido_contraseña";


function CodigoVerificacion() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [res, setRes] = useState(null);
    let navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const onSubmit = async (data) => {
        setCargando(true);
        try {
            let res = await enviarInfoServer("http://localhost:1240/validar_codigo", data);
            console.log(res);
            redirigir(navigate, res);
            setRes(res);
        } catch (error) {
            console.log(error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div>
        {/* FONDO */}
            <div className="absolute top-0 right-0 h-full w-full z-20">
                <Sobrefondo_olvido_contraseña />
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="relative z-30 flex items-center justify-center top-[30vh] lg:w-[30%] lg:left-[35%] lg:top-[40vh]">

                {/* CARD */}
                <div className="bg-white/30 backdrop-blur-2xl p-8 rounded-2xl flex flex-col gap-4 w-full flex items-center justify-center">

                    {/* TEXTO */}
                    <h1 className="text-xl font-bold text-center">
                        Código de verificación
                    </h1>

                    <p className="text-sm text-center text-gray-700">
                        Ingresa el código que se te ha enviado a tu correo
                    </p>

                    {/* FORM */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} method="POST">

                        <InputWithIcon 
                        icon={<Hash />} 
                        type="text"
                        placeholder="Código de verificación"
                        register={register("codigo", {
                            required: "Debe ingresar el código de verificación"
                        })}
                        />

                        {errors.codigo && (
                        <p className="text-red-500 text-sm">
                            {errors.codigo.message}
                        </p>
                        )}

                        <button
                        type="submit"
                        disabled={cargando}
                        className="flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {cargando ? (
                            <>
                            <p>Validando</p>
                            <Loader className="animate-spin" />
                            </>
                        ) : "Validar código"}
                        </button>

                        {res && (
                        <Mensaje 
                            mensaje={res.mensaje} 
                            tipo={res.tipo} 
                            id={Date.now()} 
                            onHide={() => setRes(null)} 
                        />
                        )}

                    </form>
                    {/* MENSAJE REDIRECCIÓN */}
                    <div className="w-full">
                        <UseMensajeRedirigir />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodigoVerificacion;