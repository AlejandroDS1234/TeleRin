import Header from '../header.tsx'
import Index from '../pages/index.tsx'
import Registrarse from '../pages/registrarse.tsx'
import Iniciar_sesion from '../pages/iniciar_sesion.tsx'
import CodigoVerificacion from '../pages/codigo_verificacion.tsx'
import Inicio from '../pages/inicio.tsx'
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import { UserProvider } from '../assets/componentes/userContext.tsx'
import CorreoCambiarContraseña from '../pages/correo_cambiar_contraseña.tsx';
import CambiarContraseña from '../pages/cambiar_contraseña.tsx'

interface RutaProtegidaProps {
    verificarUrl: string;
}

function RutaProtegida({ verificarUrl }: RutaProtegidaProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [redirectPath, setRedirectPath] = useState("/iniciar_sesion");

    useEffect(() => {
        const verificarAcceso = async () => {
            try {
                const response = await fetch(verificarUrl, { credentials: "include" });
                console.log(response);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    if (data.redirigir) {
                        setIsAuthorized(false);
                        setRedirectPath(data.redirigir);
                        console.log(data.redirigir);
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

function RutasSinSesion() {
    return (
        <>
            <div className="absolute w-full insert-0 z-30">
                <Header url="/" />
            </div>
            <Outlet />
        </>
    )
}

function RutasConSesion() {
    return (
        <>
            <div className="absolute w-full insert-0 z-30">
                <Header url="/inicio" />
            </div>
            <Outlet />
        </>
    )
}


function RutasIngresar() {
    return (
        <Routes>
            <Route element={<RutasSinSesion />}>
                <Route path="/" element={<Index />} />
                <Route path="/registrarse" element={<Registrarse />} />
                <Route path="/iniciar_sesion" element={<Iniciar_sesion />} />
                <Route path="/olvide_mi_contrasena" element={<CorreoCambiarContraseña />} />
                <Route element={<RutaProtegida verificarUrl="http://localhost:1240/ingresar_codigo_validacion" />}>
                    <Route path="/codigo_verificacion" element={<CodigoVerificacion />} />
                </Route>
                <Route element={<RutaProtegida verificarUrl="http://localhost:1240/cambiar_contraseña" />}>
                    <Route path="/cambiar_contraseña" element={<CambiarContraseña />} />
                </Route>
            </Route>


            <Route element={<RutasConSesion />}>
                <Route element={<UserProvider><RutaProtegida verificarUrl="http://localhost:1240/inicio" /></UserProvider>}>
                    <Route path="/inicio" element={<Inicio />} />
                </Route>
            </Route>
        </Routes>)
}

export default RutasIngresar;
export { RutaProtegida };