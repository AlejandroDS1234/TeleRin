import { useState } from "react"
import { useForm } from "react-hook-form"
import { enviarInfoServer } from "../../function_generales"
import InputWithIcon from "./inputWithIcon"
import { SquareLibrary, BookCopy, ThumbsUp, SquareX } from "lucide-react"

function CrearSaga() {
    const [res, setRes] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [imagen, setImagen] = useState("/api/Fotos/fotos_sagas/predefinido.jpg")
    const [nuevaImagen, setNuevaImagen] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => { console.log(data) }

    return (
        <form className="grid sm:grid-cols-2 grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 justify-center">
                <label className="hover:cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                setNuevaImagen(true)
                                setImagen(URL.createObjectURL(e.target.files[0]))
                            }
                        }} />
                    <img
                        src={imagen}
                        className="object-cover aspect-square" />
                </label>
                {nuevaImagen && (
                    <div className="flex gap-4 justify-center items-center">
                        <ThumbsUp />
                        <SquareX />
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-4 ">
                <h3>Crear saga</h3>
                <InputWithIcon
                    icon={<SquareLibrary />}
                    placeholder="Título de la saga"
                    register={register("nombre_saga", {
                        required: "El nombre es obligatorio",
                    })}
                />
                {errors.nombre_saga && <p className="text-red-500 text-sm">{errors.nombre_saga.message}</p>}

                <InputWithIcon
                    icon={<BookCopy />}
                    placeholder="Descripción de la saga"
                    register={register("descripcion_saga", {
                        required: "La descripción es obligatoria",
                    })}
                />
                {errors.descripcion_saga && <p className="text-red-500 text-sm">{errors.descripcion_saga.message}</p>}
                <button
                    type="submit"
                    disabled={cargando}
                    className="flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:cursor-pointer hover:bg-orange-600 transition"
                >
                    {cargando ? <p>Guardando</p> : "Guardar"}
                </button>
            </div>
        </form>
    )
}

export default CrearSaga;