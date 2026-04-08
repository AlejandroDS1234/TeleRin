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
    const pro = await fetch("http://localhost:1240/sesion", { method: "POST", credentials: "include" })
    const res = await pro.json()
    return res
}

