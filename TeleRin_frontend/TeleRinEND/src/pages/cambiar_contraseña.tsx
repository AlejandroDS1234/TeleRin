import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { enviarInfoServer, redirigir, cambiarTamañoBarraContraseña } from '../function_generales';
import { Loader, EyeClosed, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Mensaje from '../assets/componentes/mensaje.tsx';

function CambiarContraseña() {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [res, setRes] = useState(null);

    const [contraseñaSegura, setContraseñaSegura] = useState(1);
    const [colorBarra, setColorBarra] = useState("#0000FF");
    const handleContraseñaChange = (e) => {
        const valor = e.target.value;
        const { width, color } = cambiarTamañoBarraContraseña(valor);
        setContraseñaSegura(width);
        setColorBarra(color);
    };

    const onSubmit = async (data: any) => {
        setCargando(true);
        setRes(null); // Limpiar mensaje anterior
        try {
            let res = await enviarInfoServer("http://localhost:1240/cambiar_contraseña", data);
            setRes(res);
            redirigir(navigate, res);
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            setRes({ mensaje: "Error de conexión", tipo: "danger" });
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <h1>cambiar contraseña</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input id="contraseña_usuario_nueva" type="password" placeholder="Contraseña nueva" {...register("contraseña_usuario_nueva", {
                    required: "La contraseña es obligatoria",
                    onChange(e) {
                        handleContraseñaChange(e);
                    },
                })} />
                {errors.contraseña_usuario_nueva && <p>{errors.contraseña_usuario_nueva.message}</p>}
                <input type="password" placeholder="Confirmar contraseña" {...register("contraseña_usuario_nueva_confirmacion", {
                    required: "Confirmar contraseña es obligatorio",
                    validate: (value: string) => {
                        const newPassword = getValues("contraseña_usuario_nueva");
                        return newPassword === value || "Las contraseñas no coinciden";
                    }
                })} />
                <div className="h-4 bg-[var(--color_bordes)] rounded-full flex items-center px-2">
                    <div className="h-2 rounded-full" style={{ width: `${parseInt(contraseñaSegura)}%`, backgroundColor: colorBarra }}></div>
                </div>
                {errors.contraseña_usuario_nueva_confirmacion && <p>{errors.contraseña_usuario_nueva_confirmacion.message}</p>}
                <button type="submit" disabled={cargando} className="flex items-center gap-2">
                    {cargando ? <><p>Cambiando</p><Loader className="animate-spin" /></> : "Cambiar contraseña"}
                </button>
                {res && (<Mensaje mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />)}

            </form>
        </>
    )
}
export default CambiarContraseña;