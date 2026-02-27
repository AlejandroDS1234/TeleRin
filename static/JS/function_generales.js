document.addEventListener("DOMContentLoaded", () => {
    let fecha = document.getElementById("fecha_actualizacion")
    fecha.innerHTML = `<p>TeleRin ${new Date().getFullYear()}</p>`
})



export function mensaje(id, tipo, mensaje) {
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
        boton.innerHTML = ` <span class="rueda"></span>
                            <span class="sr-only">Cargando...</span>`
        boton.classList.add("cargando")
        boton.disabled = true
    })
}

export function finBotonCargando() {
    const botones = document.querySelectorAll(".boton")
    botones.forEach(boton => {
        boton.innerHTML = `${boton.name}`
        boton.disabled = false
        boton.classList.remove("cargando")
    })
}

export async function enviarInfoServer(e, info, direccion, mensajeArea, funcion=false, archivo=null, imagen=null) {
    e.preventDefault()  
    e.stopPropagation()
    botonCargando()
    let config = {method:"POST", credentials: "same-origin"}
    if (info) {
        config.headers = {"Content-Type":"application/json"}
        config.body= JSON.stringify(info)
    } 
    if (imagen) {
        config.body= imagen
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
    setTimeout(() => {
        finBotonCargando()}, 100);
}



document.addEventListener("DOMContentLoaded",() => {
    const mensajes = document.querySelectorAll(".mensaje_flotante");

    mensajes.forEach(mensaje => {
        setTimeout(() => {
            mensaje.style.transition = "opacity 0.5s ease";
            mensaje.style.opacity = "0";
            
            setTimeout(() => {
                mensaje.remove();
            }, 500);
        }, 4000); // 4 segundos
    });
});

export function mostrarContraseña(boton, input) {
    if (input.type === "password") {
        input.type = "text"
        boton.style.backgroundColor = "var(--color_botones_presionado)"
    } else {
        input.type = "password"
        boton.style.backgroundColor = "var(--color_botones)"
    }
}

export function cambiarTamañoBarraContraseña(input, barra) {
    const valor = input.value
    const lista= valor.split("")
    let porcentaje = 0
    if (valor.length < 8) {
        porcentaje += 25/8 * valor.length
    } else {
        porcentaje += 25
    }
    let listaMayusculas = lista.filter(caracter => /[A-Z]/.test(caracter))
    let listaMinusculas = lista.filter(caracter => /[a-z]/.test(caracter))
    let listaNumeros = lista.filter(caracter => /[0-9]/.test(caracter))
    if (listaMayusculas.length < 3) {
        porcentaje += 25/3 * listaMayusculas.length
    } else {
        porcentaje += 25
    }

    if (listaMinusculas.length < 3) {
        porcentaje += 25/3 * listaMinusculas.length
    } else {
        porcentaje += 25
    }

    if (listaNumeros.length < 2) {
        porcentaje += 25/2 * listaNumeros.length
    } else {
        porcentaje += 25
    }

    if (porcentaje < 25) {
        barra.style.backgroundColor = "#ff4d4d"
    } else if (porcentaje < 50) {
        barra.style.backgroundColor = "#ffff4d"
    } else if (porcentaje < 75) {
        barra.style.backgroundColor = "#ff944d"
    } else if (porcentaje < 100) {
        barra.style.backgroundColor = "#4dff4d"
    } else {
        barra.style.backgroundColor = "#4dffff"
    }
    barra.style.width = `${porcentaje}%`
}

export async function cargarSagas(tipo, usuario, conten) {
    const respuesta = await fetch(`/sagas_creadas/${usuario}`, {method:"POST"});
    const sagas = await respuesta.json();
    const contenedor = document.getElementById(conten);
    contenedor.innerHTML = ""; // limpiar
    sagas.forEach(saga => {
        let html
        if (tipo=="vertical") {
            html = `
                <div class="seleccionar-saga saga"  
                    data-id="${saga.id_saga}"
                    data-nombre="${saga.nombre_saga}">
                    <div class="cardvertical" style="width: 18rem;">
                        <img src="/Fotos/fotos_sagas/${saga.imagen_saga}" class="foto_card_vertical foto_saga_creada">
                        <div class="card-body">
                            <h6 class="card-title m-0">${saga.nombre_saga}</h6>
                            <p class="card-text"><small>${saga.descripcion_saga}</small></p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            html= ` <div class="card seleccionar-saga" style="width: 18rem;">
                        <img class="card-img-top" src="/Fotos/fotos_sagas/${saga.imagen_saga}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>`
        }
        contenedor.insertAdjacentHTML("beforeend", html);
    });
}
