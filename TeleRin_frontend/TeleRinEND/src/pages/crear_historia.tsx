import Editor from "../assets/componentes/editor_texto.tsx";
import { useSesion } from "./hook/usuario/hookSesion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../assets/componentes/modal.tsx";
import InputWithIcon from "../assets/componentes/inputWithIcon.tsx";
import { Suiche, deltaTexto } from "../function_generales.tsx";
import { NotebookPen, BookOpenText, ChevronRight, ChevronLeft, Save, Loader } from "lucide-react";
import CrearSaga from "../assets/componentes/crear_saga.tsx";
import { CustomSelect } from "../assets/componentes/CustomSelect.tsx";
import { SagasCardHorizontal } from "../assets/componentes/sagas_cards";
import type { Saga } from "../types";
import type Delta from "quill-delta";
import { redirigir } from "../function_generales.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MensajePlano } from "../assets/componentes/mensaje.tsx";
import { useCrearHistoria } from "./hook/historias/hookCrearHistoria.ts";
import { useSagasCreadas } from "./hook/sagas/hookSagasCreadas";
import {
  useEditarHistoria,
  useCrearBorradorHistoria,
  useGuardarBorradorHistoria,
} from "./hook/historias/hookEditarHistoria";

type EditorContenido = {
  html: string;
  texto: string;
  delta: Delta;
};

type GuardarHistoriaForm = {
  nombre_historia: string;
  descripcion_historia: string;
  visibilidad_historia: boolean;
};

type SeleccionarSagaProps = {
  error?: { message?: string } | null;
  abrirCrearSaga: () => void;
  sagaSeleccionada: (value: string) => void;
  saga?: string;
};

type GuardarHistoriaProps = {
  nuevaSaga: boolean;
  abrirCrearSaga: () => void;
  contenido: EditorContenido | null;
  idHistoria: string;
};

function SeleccionarSaga({ error, abrirCrearSaga, sagaSeleccionada, saga }: SeleccionarSagaProps) {
  const { data: usuario } = useSesion("codigo_usuario");
  const [sagaSeleccion, setSagaSeleccion] = useState(saga || "");

  const { data = [] } = useSagasCreadas(usuario?.codigo_usuario);

  return (
    <>
      <CustomSelect
        key={data?.length}
        titulo="Seleccionar saga"
        options={[
          {
            value: "__crear__",
            label: (
              <button className="hover:cursor-pointer font-[sloganGrande] text-center text-3xl text-(--color_botones_presionado) w-full">
                Crear Saga
              </button>
            ),
          },
          {
            value: "",
            label: <p className="text-center text-(--color_texto_oscuro) w-full">Sin saga</p>,
          },
          ...data?.map((saga: Saga) => ({
            value: saga?.id_saga,
            label: (
              <SagasCardHorizontal
                img={saga?.imagen_saga}
                titulo={saga?.nombre_saga}
                className="h-15"
              />
            ),
          })),
        ]}
        value={sagaSeleccion}
        onChange={(value) => {
          if (value === "__crear__") {
            abrirCrearSaga();
            setSagaSeleccion("");
            sagaSeleccionada("");
            return;
          }
          setSagaSeleccion(value);
          sagaSeleccionada(value);
        }}
        className="w-64"
      />
      {error?.message && <p className="text-(--warning) text-sm">{error.message}</p>}
    </>
  );
}

function Guardar_historia({ abrirCrearSaga, contenido, idHistoria }: GuardarHistoriaProps) {
  const mutatecrearHistoria = useCrearHistoria();
  const [sagaSeleccion, setSagaSeleccion] = useState("");
  const navigate = useNavigate();
  const { data, isLoading } = useEditarHistoria(idHistoria);
  console.log(data);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GuardarHistoriaForm>({
    defaultValues: {
      nombre_historia: "",
      descripcion_historia: "",
      visibilidad_historia: false,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        nombre_historia: data.nombre_historia ?? "",
        descripcion_historia: data.descripcion_historia ?? "",
        visibilidad_historia: data.visibilidad_historia ?? false,
      });
      setSagaSeleccion(data.id_saga ?? "");
    }
  }, [data, reset]);

  const onSubmit = async (data: GuardarHistoriaForm) => {
    console.log(contenido);
    const payload = {
      ...data,
      saga_historia: sagaSeleccion,
      historia: contenido?.delta ?? null,
      texto_historia: contenido?.texto ?? "",
      id_historia: idHistoria ?? "",
    };
    mutatecrearHistoria.mutate(payload);
  };

  useEffect(() => {
    if (mutatecrearHistoria.data?.mensaje_redirigir?.tipo === "success") {
      sessionStorage.removeItem("borrador_activo");
      redirigir(navigate, mutatecrearHistoria.data);
    }
  }, [mutatecrearHistoria.data, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-(--color_texto_oscuro)">Guardar historia</h3>
        <InputWithIcon placeholder="Nombre de la historia" icon={<NotebookPen />} disabled={true} />
        <InputWithIcon
          placeholder="Descripción de la historia"
          icon={<BookOpenText />}
          disabled={true}
        />
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-(--color_texto_oscuro)">Guardar historia</h3>
      <InputWithIcon
        placeholder="Nombre de la historia"
        register={register("nombre_historia", {
          required: "El nombre es obligatorio",
        })}
        icon={<NotebookPen />}
      />
      {errors.nombre_historia && (
        <p className="text-(--warning) text-sm">{errors.nombre_historia.message}</p>
      )}

      <InputWithIcon
        placeholder="Descripción de la historia"
        register={register("descripcion_historia", {
          required: "La descripción es obligatoria",
        })}
        icon={<BookOpenText />}
      />

      {errors.descripcion_historia && (
        <p className="text-(--warning) text-sm">{errors.descripcion_historia.message}</p>
      )}

      <Suiche label="Publico" register={register("visibilidad_historia")} />

      <SeleccionarSaga
        abrirCrearSaga={abrirCrearSaga}
        sagaSeleccionada={(value) => setSagaSeleccion(value)}
        saga={data?.id_saga}
      />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-(--color_botones) text-(--color_texto_botones) py-2 rounded-lg hover:bg-(--color_botones_presionado) transition"
      >
        {mutatecrearHistoria.isPending ? (
          <p className="flex gap-2 items-center text-(--color_texto_oscuro)">
            Guardando <Loader className="animate-spin" />
          </p>
        ) : (
          <p className="text-(--color_texto_oscuro)">Guardar</p>
        )}
      </button>
      {mutatecrearHistoria.data && (
        <MensajePlano
          mensaje={mutatecrearHistoria.data.mensaje}
          tipo={mutatecrearHistoria.data.tipo}
          id={1}
          onHide={() => mutatecrearHistoria.reset()}
        />
      )}
      {mutatecrearHistoria.error && (
        <MensajePlano
          mensaje={mutatecrearHistoria.error.message}
          tipo="danger"
          id={1}
          onHide={() => mutatecrearHistoria.reset()}
        />
      )}
    </form>
  );
}

function PaginaEditor() {
  const [searchParams] = useSearchParams();
  const historia = searchParams.get("id_historia");
  const [idHistoria, setIdHistoria] = useState(historia || "");

  const { data, isLoading } = useEditarHistoria(historia || "");

  const [nuevaSaga, setNuevaSaga] = useState(false);
  const [crearSaga, setCrearSaga] = useState(false); // flecha
  const [crearSagaMostrar, setCrearSagaMostrar] = useState(false); //mostrar crear saga
  const [abrirModal, setAbrirModal] = useState(false);

  const [contenido, setContenido] = useState<EditorContenido | null>(null);

  console.log(data);

  const mutateCrearBorrador = useCrearBorradorHistoria();
  const mutateGuardarBorrador = useGuardarBorradorHistoria();

  const navigate = useNavigate();

  // Sincronizar idHistoria cuando el searchParams cambia
  useEffect(() => {
    if (historia) {
      setIdHistoria(historia);
      setContenido(null);
    }
  }, [historia]);

  useEffect(() => {
    if (!historia) return;
    if (data?.borrador_historia) {
      const delta = data.borrador_historia;
      const textoPlano = deltaTexto(delta);
      setContenido({
        html: "", //cuando se necesite se pone
        texto: textoPlano,
        delta: delta,
      });
    }
  }, [data, historia]);

  useEffect(() => {
    redirigir(navigate, data);
  }, [historia, data, idHistoria]);

  useEffect(() => {
    const borradorActivoString = sessionStorage.getItem("borrador_activo");
    if (!borradorActivoString) return;
    if (historia) return;

    try {
      const borradorActivo = JSON.parse(borradorActivoString);
      const tiempoAhora = new Date();
      const tiempoUltimo = new Date(borradorActivo.tiempo);
      const diferencia = tiempoAhora.getTime() - tiempoUltimo.getTime();
      if (diferencia > 5 * 60 * 1000) {
        sessionStorage.removeItem("borrador_activo");
      } else {
        navigate(`/editor?id_historia=${borradorActivo.id_historia}`);
      }
    } catch (error) {
      sessionStorage.removeItem("borrador_activo");
    }
  }, []);

  useEffect(() => {
    if (!contenido) return;
    const textoLimpio = contenido.texto.trim();
    // Caso A: No hay ID y ya escribió 10 caracteres -> Crea la historia
    if (!idHistoria && textoLimpio.length >= 10 && !mutateCrearBorrador.isPending) {
      mutateCrearBorrador.mutate(
        { historia: contenido.delta, texto_historia: contenido.texto, id_historia: "" },
        { onSuccess: (nuevoId) => setIdHistoria(nuevoId) }
      );
    }
    // Caso B: Ya existe un ID -> Actualiza el borrador con un retraso (Debounce)
    else if (idHistoria) {
      const temporizador = setTimeout(() => {
        mutateGuardarBorrador.mutate({
          id_historia: idHistoria,
          borrador_historia: contenido.delta,
        });
      }, 2000); // Espera 2 segundos después de que el usuario para de escribir
      sessionStorage.setItem(
        "borrador_activo",
        JSON.stringify({ id_historia: idHistoria, tiempo: new Date() })
      );
      return () => clearTimeout(temporizador); // Limpia el timer automáticamente si sigue escribiendo
    }
  }, [contenido, idHistoria]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <p className="flex items-center gap-2 text-(--color_texto_oscuro)">
          Cargando contenido <Loader className="animate-spin" />
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center lg:items-center">
      <Modal
        open={abrirModal}
        onClose={() => setAbrirModal(false)}
        className="bg-(--color_principal) w-full m-5 sm:w-130 flex flex-col justify-center items-center"
      >
        <div className="flex flex-col gap-4 items-center justify-center w-full h-full p-10">
          <div className={crearSagaMostrar ? "block" : "hidden"}>
            <CrearSaga
              onClose={() => {
                setCrearSagaMostrar(false);
                setNuevaSaga((prev) => !prev);
                setCrearSaga(false);
              }}
            />
          </div>

          <div className={crearSagaMostrar ? "hidden" : "block"}>
            <Guardar_historia
              nuevaSaga={nuevaSaga}
              contenido={contenido}
              abrirCrearSaga={() => {
                setCrearSagaMostrar(true);
                setCrearSaga(true);
              }}
              idHistoria={idHistoria}
            />
          </div>

          <div
            className={`${crearSaga ? "flex" : "hidden"} w-full justify-center items-center bg-amber-200`}
            onClick={() => setCrearSagaMostrar((prev) => !prev)}
          >
            {crearSagaMostrar ? (
              <ChevronRight className="hover:cursor-pointer" />
            ) : (
              <ChevronLeft className="hover:cursor-pointer" />
            )}
          </div>
        </div>
      </Modal>

      <div className=" bg-[#e5e3dc] w-full max-w-175 shadow-xl flex flex-col items-center p-4">
        <Editor
          onChangeContenido={(datos) => {
            setContenido(datos);
          }}
          contenidoInicial={data?.borrador_historia}
          toolbarItems={[
            {
              type: "quill",
              value: "header",
              tag: "select",
              options: [
                { value: "1", label: "H1" },
                { value: "2", label: "H2" },
                { value: "", label: "Normal" },
              ],
            },
            { type: "quill", value: "bold" },
            { type: "quill", value: "italic" },
            { type: "quill", value: "underline" },
            { type: "quill", value: "image" },
            { type: "quill", value: "code-block" },
            {
              type: "custom",
              value: "titulo",
              className: "",
              content: (
                <button
                  className="font-bold hover:cursor-pointer"
                  onClick={() => setAbrirModal(true)}
                >
                  <p className="hidden sm:block">Guardar</p>
                  <Save className="block sm:hidden" />
                </button>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default PaginaEditor;
