import Index from '../pages/index.tsx'
import Registrarse from '../pages/registrarse.tsx'
import Iniciar_sesion from '../pages/iniciar_sesion.tsx'
import CodigoVerificacion from '../pages/codigo_verificacion.tsx'
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';

interface RutaProtegidaProps {
    verificarUrl: string;
}

function RutaProtegida({ verificarUrl }: RutaProtegidaProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [redirectPath, setRedirectPath] = useState("/iniciar_sesion");

    useEffect(() => {
        const verificarAcceso = async () => {
            try {
                const response = await fetch(verificarUrl, { credentials: "include" });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.status);
                    console.log(data);

                    if (data.status == true) {
                        setIsAuthorized(true);
                        console.log("Acceso autorizado");
                    } else {
                        setIsAuthorized(false);
                        console.log("Acceso denegado");
                        if (data.redirigir) {
                            setRedirectPath(data.redirigir);
                            console.log(data.redirigir);
                        }
                    }
                } else {
                    setIsAuthorized(false);
                    console.error("Error verificando acceso:", response.status);
                }
            } catch (error) {
                console.error("Error verificando acceso:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        verificarAcceso();
    }, [verificarUrl]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-xl">Verificando acceso...</div>
        </div>;
    }

    return isAuthorized ? <Outlet /> : <Navigate to={redirectPath} replace />;
}

function RutasIngresar() {
    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/registrarse" element={<Registrarse />} />
            <Route path="/iniciar_sesion" element={<Iniciar_sesion />} />
            <Route element={<RutaProtegida verificarUrl="http://localhost:1240/ingresar_codigo_validacion" />}>
                <Route path="/codigo_verificacion" element={<CodigoVerificacion />} />
            </Route>
        </Routes>)
}

export default RutasIngresar;
export { RutaProtegida };