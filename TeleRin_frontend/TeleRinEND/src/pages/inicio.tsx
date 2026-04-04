import { useUser } from "../assets/componentes/userContext";
import { useEffect, useState } from "react";
import UseMensajeRedirigir from "../assets/componentes/mensajeRedirigir";

function Inicio() {
    const { usuario } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (usuario !== null) {
            setIsLoading(false);
        }
    }, [usuario]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Cargando perfil...</div>
            </div>
        );
    }

    return (
        <>
            <h1>inicio</h1>
            <UseMensajeRedirigir />
            {usuario && <p>Bienvenido, {usuario.nombre_usuario}</p>}
        </>
    );
}

export default Inicio;