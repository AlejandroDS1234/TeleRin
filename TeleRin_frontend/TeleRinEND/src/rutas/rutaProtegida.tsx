import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

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
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data.redirigir) {
            setIsAuthorized(false);
            setRedirectPath(data.redirigir);
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Verificando acceso...</div>
      </div>
    );
  }

  return isAuthorized ? <Outlet /> : <Navigate to={redirectPath} replace />;
}

export default RutaProtegida;
