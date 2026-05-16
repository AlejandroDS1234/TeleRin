import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import InputWithIcon from "./inputWithIcon";
import { MensajePlano } from "./mensaje";
import { SquareLibrary, SquareX } from "lucide-react";
import type { ApiMessage } from "../../types";
import { useCrearSaga } from "../../pages/hook/hookCrearSaga";

type CrearSagaForm = {
  nombre_saga: string;
  descripcion_saga: string;
};

type CrearSagaProps = {
  onClose: () => void;
};

function CrearSaga({ onClose }: CrearSagaProps) {
  const [res, setRes] = useState<ApiMessage | null>(null);

  const [nuevaFoto, setNuevaFoto] = useState<File | null>(null);
  const [imagen, setImagen] = useState("/api/Fotos/fotos_sagas/predefinido.jpg");
  const inputFotoRef = useRef<HTMLInputElement | null>(null);
  const [mensajeFoto, setMensajeFoto] = useState<ApiMessage | null>(null);
  function limpiarSeleccionFoto() {
    setNuevaFoto(null);
    setImagen("/api/Fotos/fotos_sagas/predefinido.jpg");
    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CrearSagaForm>();

  const crearSaga = useCrearSaga();

  const onSubmit = async (data: CrearSagaForm) => {
    if (!nuevaFoto) {
      setMensajeFoto({ mensaje: "Debe seleccionar una imagen", tipo: "danger" });
      return;
    }
    const form = new FormData();
    form.append("imagen_saga", nuevaFoto);
    form.append("nombre_saga", data.nombre_saga);
    form.append("descripcion_saga", data.descripcion_saga);

    const res = await crearSaga.mutateAsync(form);
    setRes({ mensaje: res.mensaje, tipo: res.tipo });

    if (res.tipo == "success") {
      setTimeout(() => {
        limpiarSeleccionFoto();
        onClose();
        reset();
      }, 1500);
    }
  };

  return (
    <form className="grid sm:grid-cols-2 grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1 justify-center items-center ">
        <label className="hover:cursor-pointer">
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const archivo = e.target.files?.[0];
              if (archivo) {
                setNuevaFoto(archivo);
                setImagen(URL.createObjectURL(archivo));
              }
            }}
          />

          <img src={imagen} className="aspect-square w-50" />
        </label>
        {nuevaFoto && (
          <div className="flex gap-4">
            <SquareX
              color="#FF0000"
              className="hover:cursor-pointer"
              onClick={() => {
                limpiarSeleccionFoto();
              }}
            />
          </div>
        )}
        {nuevaFoto && <p className="truncate w-full">{nuevaFoto.name}</p>}
        {mensajeFoto && (
          <MensajePlano
            mensaje={mensajeFoto.mensaje}
            tipo={mensajeFoto.tipo}
            id={Date.now()}
            onHide={() => setMensajeFoto(null)}
          />
        )}
      </div>
      <div className="flex flex-col gap-4 ">
        <h3>Crear saga</h3>
        <InputWithIcon
          icon={<SquareLibrary />}
          placeholder="Título de la saga"
          register={register("nombre_saga", {
            required: "El nombre es obligatorio",
            maxLength: {
              value: 25,
              message: "El nombre no puede tener más de 25 caracteres",
            },
          })}
        />
        {errors.nombre_saga && <p className="text-red-500 text-sm">{errors.nombre_saga.message}</p>}

        <textarea
          className={`overflow-y-auto scroll-suave h-20 resize-none w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400`}
          placeholder="Descripción de la saga"
          {...register("descripcion_saga", {
            required: "La descripción es obligatoria",
            maxLength: {
              value: 400,
              message: "La descripción no puede tener más de 400 caracteres",
            },
          })}
        />

        {errors.descripcion_saga && (
          <p className="text-red-500 text-sm">{errors.descripcion_saga.message}</p>
        )}
        <button
          type="submit"
          disabled={crearSaga.isPending}
          className="flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:cursor-pointer hover:bg-orange-600 transition"
        >
          {crearSaga.isPending ? <p>Guardando</p> : "Guardar"}
        </button>
      </div>
      {res && (
        <MensajePlano
          mensaje={res.mensaje}
          tipo={res.tipo}
          id={Date.now()}
          onHide={() => setRes(null)}
        />
      )}
    </form>
  );
}

export default CrearSaga;
