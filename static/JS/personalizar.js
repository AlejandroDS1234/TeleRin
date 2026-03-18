import { enviarInfoServer } from "./function_generales.js";

let contenedor = document.getElementById("iconos")
document.addEventListener("DOMContentLoaded", async (e)=> {

    // Colacar las paletas de la base de datos
    let pro = await fetch("/paletas", {method: "POST"}) 
    let paletas = await pro.json()
    paletas.forEach(paleta => {
        let html=`
        <svg class="icono" data-id="${paleta.id_paleta}" xmlns="http://www.w3.org/2000/svg" viewBox="28 8 100 55">
                <path fill="${paleta.color1}" d="M-68.236679-20.150304a22.210299 20.23605 0 0 1-1.148374-28.582924 22.210299 20.23605 0 0 1 31.370196-1.078303 22.210299 20.23605 0 0 1 1.218632 28.580509 22.210299 20.23605 0 0 1-31.367467 1.142314L-53.10754-34.9655Z" transform="scale(-1)"/>
                
                <path fill="${paleta.color2}" d="M-91.97868-20.393986a22.210299 20.23605 0 0 1-1.148374-28.582924 22.210299 20.23605 0 0 1 31.370197-1.078304 22.210299 20.23605 0 0 1 1.218632 28.580509 22.210299 20.23605 0 0 1-31.367467 1.142314l15.056151-14.876792z" transform="scale(-1)"/>
                
                <path fill="${paleta.color3}" d="M-117.39713-20.579079a22.210299 20.23605 0 0 1-1.14837-28.582924 22.210299 20.23605 0 0 1 31.370193-1.078304 22.210299 20.23605 0 0 1 1.218632 28.580509 22.210299 20.23605 0 0 1-31.367465 1.142314l15.05615-14.876792z" transform="scale(-1)"/>
                
                <path fill="${paleta.color3}" d="M21.751643-90.398928a18.01502 19.248926 0 0 1-.931459-27.188632 18.01502 19.248926 0 0 1 25.444715-1.02571 18.01502 19.248926 0 0 1 .988447 27.186342 18.01502 19.248926 0 0 1-25.442502 1.086591l12.212212-14.151093z" transform="rotate(90)"/>
        </svg>
        `
        contenedor.insertAdjacentHTML("beforeend", html)
    })

    // Al undirle a la paleta cambia el color
    const paletasElements = document.querySelectorAll(".icono");
    paletasElements.forEach(paleta => {
        paleta.addEventListener("click", function(e) {
            let id = paleta.dataset.id
            document.getElementById("iconos").dataset.id = id
            paletas.forEach(paleta => {
            
                if (paleta.id_paleta == id) {
                    document.documentElement.style.setProperty("--color1", paleta.color1);
                    document.documentElement.style.setProperty("--color2", paleta.color2);
                    document.documentElement.style.setProperty("--color3", paleta.color3);
                }
            });
        });
    });
})

function obtener_colores_input() {
    const coloresOriginales = {
        "color1original": document.getElementById("color1"),
        "color2original": document.getElementById("color2"),
        "color3original": document.getElementById("color3")
    }
    return coloresOriginales
}
function cambiar_colores(colores) {
    document.documentElement.style.setProperty("--color1", colores.color1original.value);
    document.documentElement.style.setProperty("--color2", colores.color2original.value);
    document.documentElement.style.setProperty("--color3", colores.color3original.value);
    console.log("pink")   
}
function obtener_colores() {
    let coloresOriginales = {
        "color1original": {"value": document.getElementById("color1").value},
        "color2original": {"value": document.getElementById("color2").value},
        "color3original": {"value": document.getElementById("color3").value}
    }
    return coloresOriginales
}

// obtener los colores que tiene predefinico el usuario
let coloresOriginales = obtener_colores()

// abrir modal
const modal = document.getElementById("modalPersonalizar");
const abrir = document.getElementById("abrirModal");
const cerrar = document.querySelector(".cerrar");
/* abrir modal */
abrir.addEventListener("click", () => {
    modal.style.display = "flex";
});
/* cerrar con X */
cerrar.addEventListener("click", () => {
    modal.style.display = "none";
    cambiar_colores(coloresOriginales);
});
/* cerrar haciendo click afuera */
window.addEventListener("click", (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
        cambiar_colores(coloresOriginales);
    }
});

let colores = obtener_colores_input()
Object.values(colores).forEach(color => {
    color.addEventListener("input", () => {
        cambiar_colores(obtener_colores_input())
    })
})




// guardar paleta personalizada
let formulario_paleta_personalizada = document.getElementById("crear_paleta_personalizada")
formulario_paleta_personalizada.addEventListener("submit", async (e) => {
    colores = obtener_colores()
    console.log(colores)
    enviarInfoServer(e, colores, "/guardar_paleta_personalizada", "json_paleta")
})

// guardar paleta
let formulario_paleta = document.getElementById("paletas")
formulario_paleta.addEventListener("submit", async (e) => {
    let id_paleta = document.getElementById("iconos").dataset.id
    let datos = {"id_paleta": id_paleta}
    enviarInfoServer(e, datos, "/guardar_paleta", "json_paleta_elegir")
})


