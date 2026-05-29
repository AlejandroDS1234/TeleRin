import { useState } from "react";
import InputWithIcon from "../assets/componentes/inputWithIcon";
import { useForm } from "react-hook-form";
import { enviarInfoServer, redirigir } from "../function_generales";
import { Loader, BookUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MensajePlano } from "../assets/componentes/mensaje.tsx";
import Sobrefondo_olvido_contraseña from "../assets/sobre_fondos_de_menus/sobre_fondo_olvido_contraseña.tsx";
import type { ApiMessage } from "../types";

type CorreoCambiarContrasenaForm = {
  correo_para_codigo_usuario: string;
};

function CorreoCambiarContraseña() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CorreoCambiarContrasenaForm>();
  const [cargando, setCargando] = useState(false);
  const [res, setRes] = useState<ApiMessage | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: CorreoCambiarContrasenaForm) => {
    setCargando(true);
    try {
      const res = await enviarInfoServer<ApiMessage, CorreoCambiarContrasenaForm>(
        "/api/codigo_verificacion_cambiar_contrasena",
        data
      );
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
      <div className="absolute bottom-0 right-0 h-full w-full z-20">
        <Sobrefondo_olvido_contraseña />
      </div>
      <div className="relative z-30 iteflex ms-center justify-center top-[30vh] lg:w-[30%] lg:left-[35%] lg:top-[26vh]">
        <div className="bg-white/30 backdrop-blur-2xl p-8 rounded-2xl">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <InputWithIcon
              icon={<BookUser />}
              placeholder="Correo"
              register={register("correo_para_codigo_usuario", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "El correo no es válido",
                },
              })}
            />

            {errors.correo_para_codigo_usuario && (
              <p className="text-red-500 text-sm">{errors.correo_para_codigo_usuario.message}</p>
            )}

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
              ) : (
                "Enviar correo de verificación"
              )}
            </button>
            {res && (
              <div className="flex justify-center bg-(--color_fondo_transparente) rounded-2xl">
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
      </div>
    </div>
  );
}

export default CorreoCambiarContraseña;
