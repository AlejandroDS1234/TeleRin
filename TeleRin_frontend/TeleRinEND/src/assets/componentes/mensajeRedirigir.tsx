import { useLocation } from "react-router-dom";
import Mensaje from "./mensaje";
import { useEffect } from "react";

function UseMensajeRedirigir() {
    const location = useLocation();
    useEffect(() => {
        if (location.state) {
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    if (!location.state) return null;

    return location.state ? <Mensaje mensaje={location.state.mensaje} tipo={location.state.tipo} id={Date.now()} /> : null;
}

export default UseMensajeRedirigir;