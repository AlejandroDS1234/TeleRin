import Header from "../header";
import { useForm } from 'react-hook-form';

function FormularioRegistro() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        console.log(data);
        fetch("http://telerin:1240/registrarse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
    };

    return (
        <form className="flex flex-col bg-amber-200 w-full" onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="Nombre" {...register("nombre_usuario", {
                required: "El nombre es obligatorio",
                minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres"
                }
            })} />
            {errors.nombre_usuario && <p>{errors.nombre_usuario.message}</p>}
            <input placeholder="Correo" {...register("correo_usuario", { required: "El correo es obligatorio" })} />
            {errors.correo_usuario && <p>{errors.correo_usuario.message}</p>}
            <input placeholder="Contraseña" {...register("contraseña_usuario", { required: "La contraseña es obligatoria" })} />
            {errors.contraseña_usuario && <p>{errors.contraseña_usuario.message}</p>}
            <button>Registrarse</button>
            <div>aaaaaaaaaaaaaaaaabbbbbbbbbbbbbb</div>
        </form>
    )
}


function Registrarse() {
    return (
        <>
            <Header />
            <h1>registrarse</h1>
            <FormularioRegistro />
        </>
    )
}
export default Registrarse;