import { useState } from "react";
import { useForm } from "react-hook-form";
import { enviarInfoServer, redirigir, cambiarTamañoBarraContraseña } from "../function_generales";
import { Loader, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Mensaje } from "../assets/componentes/mensaje.tsx";
import InputWithIcon from "../assets/componentes/inputWithIcon";
import Sobrefondo_olvido_contraseña from "../assets/sobre_fondos_de_menus/sobre_fondo_olvido_contraseña.tsx";
import type { ApiMessage } from "../types";

type CambiarContrasenaForm = {
  contraseña_usuario_nueva: string;
  contraseña_usuario_nueva_confirmacion: string;
};

function CambiarContraseña() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<CambiarContrasenaForm>();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [res, setRes] = useState<ApiMessage | null>(null);

  const [contraseñaSegura, setContraseñaSegura] = useState("1%");
  const [colorBarra, setColorBarra] = useState("#0000FF");

  const handleContraseñaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const { width, color } = cambiarTamañoBarraContraseña(valor);
    setContraseñaSegura(width);
    setColorBarra(color);
  };

  const onSubmit = async (data: CambiarContrasenaForm) => {
    setCargando(true);
    setRes(null);
    try {
      const res = await enviarInfoServer<ApiMessage, CambiarContrasenaForm>(
        "/api/cambiar_contraseña",
        data
      );
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
    <div>
      <div className="absolute top-0 right-0 h-full w-full z-20">
        <Sobrefondo_olvido_contraseña />
      </div>
      <div className="bg-white/30 backdrop-blur-2xl p-8 rounded-2xl relative z-30 flex items-center justify-center top-[30vh] lg:w-[30%] lg:left-[35%] lg:top-[40vh]">
        <h1 className="absolute text-xl font-bold text-center top-0">Cambiar contraseña</h1>

        <div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <InputWithIcon
              icon={<Lock />}
              type="password"
              placeholder="Contraseña nueva"
              register={register("contraseña_usuario_nueva", {
                required: "La contraseña es obligatoria",
                onChange(e) {
                  handleContraseñaChange(e);
                },
              })}
            />

            {errors.contraseña_usuario_nueva && (
              <p className="text-red-500 text-sm">{errors.contraseña_usuario_nueva.message}</p>
            )}

            <InputWithIcon
              icon={<Lock />}
              type="password"
              placeholder="Confirmar contraseña"
              register={register("contraseña_usuario_nueva_confirmacion", {
                required: "Confirmar contraseña es obligatorio",
                validate: (value) => {
                  const newPassword = getValues("contraseña_usuario_nueva");
                  return newPassword === value || "Las contraseñas no coinciden";
                },
              })}
            />

            <div className="w-full h-4 bg-(--color_bordes) rounded-full flex items-center px-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: contraseñaSegura,
                  backgroundColor: colorBarra,
                }}
              />
            </div>

            {errors.contraseña_usuario_nueva_confirmacion && (
              <p className="text-red-500 text-sm">
                {errors.contraseña_usuario_nueva_confirmacion.message}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <>
                  <p>Cambiando</p>
                  <Loader className="animate-spin" />
                </>
              ) : (
                "Cambiar contraseña"
              )}
            </button>
          </form>
        </div>
      </div>
      <div className="absolute w-[60%] z-40 bottom-[70%]">
        <div>
          {res && (
            <Mensaje mensaje={res.mensaje} tipo={res.tipo} id={1} onHide={() => setRes(null)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default CambiarContraseña;
