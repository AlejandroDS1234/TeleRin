import { useForm } from "react-hook-form";
import { Mensaje } from "../assets/componentes/mensaje";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enviarInfoServer, redirigir, cambiarTamañoBarraContraseña } from "../function_generales";
import { EyeClosed, Eye, Loader, Mail, UserRoundPlus } from "lucide-react";
import Sobrefondo_registro from "../assets/sobre_fondos_de_menus/sobre_fondo_registro";
import InputWithIcon from "../assets/componentes/inputWithIcon";
import type { ApiMessage } from "../types";

type RegistroForm = {
  nombre_usuario: string;
  correo_usuario: string;
  contraseña_usuario: string;
};

function FormularioRegistro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroForm>();
  const [res, setRes] = useState<ApiMessage | null>(null);
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const onSubmit = async (data: RegistroForm) => {
    setCargando(true);
    try {
      const res = await enviarInfoServer<ApiMessage, RegistroForm>("/api/registrarse", data);
      redirigir(navigate, res);
      setRes(res);
    } catch (error) {
      setRes({ mensaje: "Error de conexión", tipo: "danger" });
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [contraseñaSegura, setContraseñaSegura] = useState("0%");
  const [colorBarra, setColorBarra] = useState("");

  const handleContraseñaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const { width, color } = cambiarTamañoBarraContraseña(valor);
    setContraseñaSegura(width);
    setColorBarra(color);
  };

  return (
    <div>
      <form
        className="flex flex-col gap-2 bg-(--color_principal) w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputWithIcon
          icon={<UserRoundPlus />}
          autoComplete="off"
          placeholder="Nombre"
          register={register("nombre_usuario", {
            required: "El nombre es obligatorio",
          })}
        />
        {errors.nombre_usuario && (
          <p className="text-(--danger) text-sm">{errors.nombre_usuario.message}</p>
        )}
        <InputWithIcon
          icon={<Mail />}
          placeholder="Correo"
          register={register("correo_usuario", {
            required: "El correo es obligatorio",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "El correo no es válido",
            },
          })}
        />
        {errors.correo_usuario && (
          <p className="text-(--danger) text-sm">{errors.correo_usuario.message}</p>
        )}

        <InputWithIcon
          icon={
            mostrarContraseña ? (
              <Eye
                onClick={() => setMostrarContraseña(false)}
                className="hover:cursor-pointer animate-pulse"
              />
            ) : (
              <EyeClosed
                onClick={() => setMostrarContraseña(true)}
                className="hover:cursor-pointer animate-pulse"
              />
            )
          }
          autoComplete="off"
          type={mostrarContraseña ? "text" : "password"}
          placeholder="Contraseña"
          {...register("contraseña_usuario", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
            pattern: {
              value: /^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){1,}).{8,}$/,
              message: "La contraseña debe tener al menos 3 mayúsculas, 3 minúsculas y un número",
            },
            onChange: (e) => {
              handleContraseñaChange(e);
            },
          })}
        />

        <div className="h-4 bg-(--color_bordes_claro) rounded-full flex items-center px-2">
          <div
            className="h-2 rounded-full"
            style={{ width: contraseñaSegura, backgroundColor: colorBarra }}
          ></div>
        </div>
        {errors.contraseña_usuario && (
          <p className="text-(--danger)">{errors.contraseña_usuario.message}</p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="flex items-center justify-center gap-3 mt-4 bg-(--color_botones) text-(--color_texto_botones) py-2 rounded-lg hover:bg-(--color_botones_presionado) transition cursor-pointer"
        >
          {cargando ? (
            <>
              <p className="flex gap-2 text-(--color_texto_botones)">
                Registrando <Loader className="animate-spin" />
              </p>
            </>
          ) : (
            "Registrarse"
          )}
        </button>

        {res && (
          <Mensaje mensaje={res.mensaje} tipo={res.tipo} id={1} onHide={() => setRes(null)} />
        )}
      </form>
    </div>
  );
}

function Registrarse() {
  return (
    <div>
      <div className="absolute top-0 right-0 h-full w-full lg:w-2/4 z-20">
        <Sobrefondo_registro />
      </div>
      <div className="relative z-30 iteflex ms-center justify-center top-[30vh] lg:justify-start lg:w-[30%] lg:left-[10%] lg:top-[26vh]">
        <div className="bg-(--color_principal_claro) backdrop-blur-2xl p-8 rounded-2xl">
          <FormularioRegistro />
        </div>
      </div>
    </div>
  );
}
export default Registrarse;
