import UseMensajeRedirigir from "../assets/componentes/mensajeRedirigir";
import { useForm } from "react-hook-form";
import { enviarInfoServer, redirigir } from "../function_generales";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Mensaje from "../assets/componentes/mensaje";


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
        <>
            <div>
                <UseMensajeRedirigir />
            </div>
            <div className="container">
                <h1>Codigo de verificacion</h1>
                <p>Ingresa el codigo de verificacion que se te ha enviado a tu correo</p>
                <form onSubmit={handleSubmit(onSubmit)} method="POST">
                    <input autoComplete="off" type="number" {...register("codigo", { required: "Debe ingresar el codigo de verificacion" })} placeholder="Codigo de verificacion" />
                    {errors.codigo && <p>{errors.codigo.message}</p>}
                    <button type="submit" disabled={cargando} className="flex items-center gap-2">
                        {cargando ? <> <p>Validando</p> <Loader className="animate-spin" /> </> : "Validar codigo"}
                    </button>
                    {res && (<Mensaje mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />)}
                </form>
            </div >
        </>
    );
}

export default CodigoVerificacion;