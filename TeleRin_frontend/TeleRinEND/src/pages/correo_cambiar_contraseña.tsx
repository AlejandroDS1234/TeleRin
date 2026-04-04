import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { enviarInfoServer, redirigir } from '../function_generales';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        <form onSubmit={handleSubmit(onSubmit)}>
            <input autoComplete="off" placeholder="Correo" {...register("correo_para_codigo_usuario", { required: "El correo es obligatorio", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "El correo no es válido" } })} />
            {errors.correo_para_codigo_usuario && <p>{errors.correo_para_codigo_usuario.message}</p>}
            <button type="submit" disabled={cargando} className="flex items-center gap-2">
                {cargando ? <><p>Enviando</p><Loader className="animate-spin" /></> : "Enviar correo de verificación"}
            </button>
        </form>
    )
}

export default CorreoCambiarContraseña;