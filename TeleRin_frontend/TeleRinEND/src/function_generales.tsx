export async function enviarInfoServer(url: string, data: any) {
    let tipo = data instanceof FormData;

    const opciones: any = {
        method: "POST",
        body: tipo ? data : JSON.stringify(data),
        credentials: "include"
    }

    if (!tipo) {
        opciones.headers = {
            "Content-Type": "application/json"
        }
    }

    let pro = await fetch(url, opciones)
    let res = await pro.json();
    return res
}

export function redirigir(navigate: any, datos: any = {}) {
    if (!datos.redirigir) return;
    console.log(datos);
    navigate(datos.redirigir, { state: datos.mensaje_redirigir ? datos.mensaje_redirigir : {} });
}

export function cambiarTamañoBarraContraseña(input: string) {
    const valor = input
    const lista = valor.split("")
    let porcentaje = 0
    if (valor.length < 8) {
        porcentaje += 25 / 8 * valor.length
    } else {
        porcentaje += 25
    }
    let listaMayusculas = lista.filter(caracter => /[A-Z]/.test(caracter))
    let listaMinusculas = lista.filter(caracter => /[a-z]/.test(caracter))
    let listaNumeros = lista.filter(caracter => /[0-9]/.test(caracter))
    if (listaMayusculas.length < 3) {
        porcentaje += 25 / 3 * listaMayusculas.length
    } else {
        porcentaje += 25
    }

    if (listaMinusculas.length < 3) {
        porcentaje += 25 / 3 * listaMinusculas.length
    } else {
        porcentaje += 25
    }

    if (listaNumeros.length < 2) {
        porcentaje += 25 / 2 * listaNumeros.length
    } else {
        porcentaje += 25
    }

    let color = "";
    if (porcentaje < 25) {
        color = "#ff4d4d"
    } else if (porcentaje < 50) {
        color = "#ffff4d"
    } else if (porcentaje < 75) {
        color = "#ff944d"
    } else if (porcentaje < 100) {
        color = "#4dff4d"
    } else {
        color = "#4dffff"
    }
    let width = `${porcentaje}%`
    return { width, color }
}

export async function actualizarSesion() {
    const pro = await fetch("/api/sesion", { method: "POST", credentials: "include" })
    const res = await pro.json()
    return res
}

export function Suiche({ label, register }) {
    return (
        <label className="inline-flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="sr-only peer" {...register} />
            <div className="relative w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
            <span>{label}</span>
        </label>
    );
}

import { useEffect, useState } from "react";

export function useIsLg() {
    const [isLg, setIsLg] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsLg(window.innerWidth >= 1024);

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isLg;
}
