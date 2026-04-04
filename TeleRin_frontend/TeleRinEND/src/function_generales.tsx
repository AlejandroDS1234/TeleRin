import { useLocation } from "react-router-dom";
import Mensaje from "./assets/componentes/mensaje";
import { useEffect } from "react";

export async function enviarInfoServer(url: string, data: any) {
    let tipo = data instanceof FormData;
    let pro = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": tipo ? "multipart/form-data" : "application/json"
        },
        body: tipo ? data : JSON.stringify(data),
        credentials: "include"
    })
    let res = await pro.json();
    return res
}

export function redirigir(navigate: any, datos: any = {}) {
    if (!datos.redirigir) return;
    console.log(datos);
    navigate(datos.redirigir, { state: datos.mensaje_redirigir ? datos.mensaje_redirigir : {} });
}

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

