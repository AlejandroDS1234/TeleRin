import { useState } from 'react';
import InputWithIcon from "../assets/componentes/inputWithIcon";
import { set, useForm } from 'react-hook-form';
import { enviarInfoServer, redirigir } from '../function_generales';
import { Loader, Mail, BookUser } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Mensaje } from '../assets/componentes/mensaje.tsx';
import Sobrefondo_olvido_contraseña from '../assets/sobre_fondos_de_menus/sobre_fondo_olvido_contraseña.tsx';

function CorreoCambiarContraseña() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [cargando, setCargando] = useState(false);
    const [res, setRes] = useState(null);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setCargando(true);
        try {
            let res = await enviarInfoServer("http://localhost:1240/codigo_verificacion_cambiar_contrasena", data);
            setRes(res);
            redirigir(navigate, res);
        } catch (error) {
            console.error("Error al enviar correo de verificación:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div>
            <div className="absolute button-0 right-0 h-full w-full z-20">
                <Sobrefondo_olvido_contraseña />
            </div>
            <div className="relative z-30 iteflex ms-center justify-center top-[30vh] lg:w-[30%] lg:left-[35%] lg:top-[26vh]">
                <div className="bg-white/30 backdrop-blur-2xl p-8 rounded-2xl">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

                        {/* INPUT CON ICONO */}
                        <InputWithIcon
                            icon={<BookUser />}
                            placeholder="Correo"
                            register={register("correo_para_codigo_usuario", {
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "El correo no es válido"
                                }
                            })}
                        />

                        {/* ERROR */}
                        {errors.correo_para_codigo_usuario && (
                            <p className="text-red-500 text-sm">
                                {errors.correo_para_codigo_usuario.message}
                            </p>
                        )}

                        {/* BOTÓN */}
                        <button
                            type="submit"
                            disabled={cargando}
                            className="flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                        >
                            {cargando ? (
                                <>
                                    <p>Enviando</p>
                                    <Loader className="animate-spin" />
                                </>
                            ) : "Enviar correo de verificación"}
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
                </div>
            </div>
        </div>
    )
}

export default CorreoCambiarContraseña;