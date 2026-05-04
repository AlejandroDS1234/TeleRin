import { useLocation } from "react-router-dom";
import { Mensaje } from "./mensaje";
import { useEffect } from "react";
import type { RedirectPayload } from "../../types";

function UseMensajeRedirigir() {
    const location = useLocation();
    const state = location.state as RedirectPayload["mensaje_redirigir"] | null;
    useEffect(() => {
        if (state) {
            window.history.replaceState({}, document.title);
        }
    }, [state]);

    if (!state) return null;

    return <Mensaje mensaje={state.mensaje} tipo={state.tipo} id={1} />;
}

export default UseMensajeRedirigir;
