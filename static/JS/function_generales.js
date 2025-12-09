export function mensaje(id, tipo, mensaje) {
    console.log(id, tipo, mensaje)
    const mensajeArea = document.getElementById(id)
    mensajeArea.style.display = "block"
    mensajeArea.classList = null
    mensajeArea.innerHTML = ""
    mensajeArea.innerHTML = mensaje
    void mensajeArea.offsetWidth
    mensajeArea.classList.add("mensaje")
    mensajeArea.classList.add(`mensaje-${tipo}`)

    setTimeout(() => {
        mensajeArea.style.display = "none"
    }, 8000);
}

export function botonCargando() {
    const botones = document.querySelectorAll(".boton")
    botones.forEach(boton => {
        boton.innerHTML = ` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="false"></span>
                            <span class="sr-only">Cargando...</span>`
        boton.disabled = true
    })
}

export function finBotonCargando() {
    const botones = document.querySelectorAll(".boton")
    botones.forEach(boton => {
        boton.innerHTML = `${boton.name}`
        boton.disabled = false
    })
}

export async function enviarInfoServer(e, info, direccion, mensajeArea, funcion=false, archivo=null) {

    e.preventDefault()
    botonCargando()
    let config = {method:"POST"}
    if (info) {
        config.headers = {"Content-Type":"application/json"}
        config.body= JSON.stringify(info)
    } 
    const res = await fetch(direccion, config)
    
    if (res.redirected) {
        window.location.href = res.url
    } else {
        const mensajeRecibido = await res.json()
        mensaje(mensajeArea, mensajeRecibido["tipo"], mensajeRecibido["mensaje"])
        if (funcion && archivo) {
            const arc = await import(archivo)
            arc[funcion]()
        }
    }
    finBotonCargando()
    
}

