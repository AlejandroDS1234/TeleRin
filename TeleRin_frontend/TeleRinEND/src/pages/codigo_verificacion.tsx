import UseMensajeRedirigir from "../assets/componentes/mensajeRedirigir";
import { useForm } from "react-hook-form";
import { enviarInfoServer, redirigir } from "../function_generales";
import { Loader, Hash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MensajePlano } from "../assets/componentes/mensaje";
import InputWithIcon from "../assets/componentes/inputWithIcon";
import Sobrefondo_olvido_contraseña from "../assets/sobre_fondos_de_menus/sobre_fondo_olvido_contraseña";
import type { ApiMessage } from "../types";

type CodigoVerificacionForm = {
  codigo: string;
};

function CodigoVerificacion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodigoVerificacionForm>();
  const [res, setRes] = useState<ApiMessage | null>(null);
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const onSubmit = async (data: CodigoVerificacionForm) => {
    setCargando(true);
    try {
      const res = await enviarInfoServer<ApiMessage, CodigoVerificacionForm>(
        "/api/validar_codigo",
        data
      );
      redirigir(navigate, res);
      setRes(res);
    } catch {
      setRes({ mensaje: "Error de conexión", tipo: "danger" });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <div className="absolute top-0 right-0 h-full w-full z-20">
        <Sobrefondo_olvido_contraseña />
      </div>

      <div className="relative z-30 flex items-center justify-center top-[30vh] lg:w-[30%] lg:left-[35%] lg:top-[40vh]">
        <div className="bg-white/30 backdrop-blur-2xl p-8 rounded-2xl flex-col gap-4 w-full flex items-center justify-center">
          <h1 className="text-xl font-bold text-center">Código de verificación</h1>

          <p className="text-sm text-center text-gray-700">
            Ingresa el código que se te ha enviado a tu correo
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} method="POST">
            <InputWithIcon
              icon={<Hash />}
              type="number"
              placeholder="Código de verificación"
              register={register("codigo", {
                required: "Debe ingresar el código de verificación",
              })}
            />

            {errors.codigo && <p className="text-red-500 text-sm">{errors.codigo.message}</p>}

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
              ) : (
                "Validar código"
              )}
            </button>
            {res && (
              <div className="flex justify-center bg-(--color_principal_opaco) rounded-2xl">
                <MensajePlano
                  mensaje={res.mensaje}
                  tipo={res.tipo}
                  id={1}
                  onHide={() => setRes(null)}
                />
              </div>
            )}
          </form>
        </div>
        <div className="fixed bottom-6 lg:bottom-10">
          <div className="w-full bg-white/30">
            <UseMensajeRedirigir />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodigoVerificacion;
