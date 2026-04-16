import Editor from "../assets/componentes/editor_texto.tsx";
import { useUser } from "../assets/componentes/userContext.tsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../assets/componentes/modal.tsx";
import InputWithIcon from "../assets/componentes/inputWithIcon.tsx";
import { enviarInfoServer, Suiche } from "../function_generales.tsx";
import { NotebookPen, Loader, BookOpenText, ChevronRight, ChevronLeft, Save, ChevronDown, ChevronUp } from 'lucide-react'
import CrearSaga from "../assets/componentes/crear_saga.tsx";

// const [nuevaSaga, setNuevaSaga] = useState(false);

// function SeleccionarSaga() {
//   const { usuario } = useUser();
//   const [sagas, setSagas] = useState([]);
//   const [cargando, setCargando] = useState(true);

//   useEffect(() => {
//     const fetchSagas = async () => {
//       try {
//         const res = await fetch(`/api/sagas_creadas/${usuario.codigo_usuario}`, { method: "POST", credentials: "include" })
//         const sagas = await res.json();
//         setSagas(sagas);
//         setCargando(false);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setCargando(false);
//       }
//     };
//     fetchSagas();
//   }, [nuevaSaga]);

//   return (
//     <select
//       className="w-full border-b-2"
//       disabled={cargando}
//       value={paisUsuario}
//       onChange={(e) => {
//         setPaisUsuario(e.target.value)
//         cambiarDato({ "id_pais": e.target.value }, hola, setCargando, setRes, setUsuario)
//       }
//       }
//     >
//       {paises.map(pais => (
//         <option key={pais.id_pais} value={pais.id_pais}>
//           {pais.nombre_pais}
//         </option>
//       ))}
//     </select>
//   )

// }


function Guardar_historia() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
  }


  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h3>Guardar historia</h3>
      <InputWithIcon
        placeholder="Nombre de la historia"
        register={register("nombre_historia", {
          required: "El nombre es obligatorio",
        })}
        icon={<NotebookPen />}
      />
      {errors.nombre_historia && (
        <p className="text-red-500 text-sm">
          {errors.nombre_historia.message}
        </p>
      )}
      <InputWithIcon
        placeholder="Descripción de la historia"
        register={register("descripcion_historia", {
          required: "La descripción es obligatoria",
        })}
        icon={<BookOpenText />}
      />
      {errors.descripcion_historia && (
        <p className="text-red-500 text-sm">
          {errors.descripcion_historia.message}
        </p>
      )}

      <Suiche label="Publico" register={register("visibilidad_historia")} />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
      >
        Guardar
      </button>

    </form>
  )
}






function PaginaEditor() {
  const [contenido, setContenido] = useState(null);
  const [abrirModal, setAbrirModal] = useState(false);
  const [crearSagaMostrar, setCrearSagaMostrar] = useState(true);


  return (
    <div className="flex justify-center lg:items-center">


      <Modal open={abrirModal}
        onClose={() => setAbrirModal(false)}
        className="bg-[var(--color_principal)] w-full h-130 sm:h-100 m-5 sm:w-130 flex flex-col justify-center items-center">
        <div className={`flex flex-col gap-4 items-center justify-center w-full h-full p-10`}>
          <div className={crearSagaMostrar ? "block" : "hidden"}><CrearSaga /></div>
          <div className={crearSagaMostrar ? "hidden" : "block"}><Guardar_historia /></div>
          <div className="w-full flex justify-center items-center bg-amber-200" onClick={() => setCrearSagaMostrar((prev) => !prev)}>
            {crearSagaMostrar ?
              <ChevronRight className="hover:cursor-pointer" /> :
              <ChevronLeft className="hover:cursor-pointer" />}
          </div>
        </div>
      </Modal>


      <div className="min-h-screen bg-[#e5e3dc] w-full max-w-[700px] h-[90vh] shadow-xl flex flex-col items-center p-4">

        {/* ✏️ EDITOR */}
        <Editor
          onChangeContenido={setContenido}
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
              content: (<button className="font-bold hover:cursor-pointer" onClick={() => setAbrirModal(true)}>
                <p className="hidden sm:block">Guardar</p>
                <Save className="block sm:hidden" />
              </button>)
            }
          ]}
        />

      </div>
    </div>

  );
}

export default PaginaEditor;