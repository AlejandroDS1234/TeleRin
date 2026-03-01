import { enviarInfoServer } from "./function_generales.js";

const modal = document.getElementById("modal");
const abrir = document.getElementById("boton_crear_saga");

// Abrir modal al presionar botón
abrir.onclick = () => {
    modal.style.display = "flex";
};

// Cerrar modal al hacer click fuera del contenido
window.onclick = (e) => { 
    if (e.target == modal) {
        modal.style.display = "none";
    }
};


// al insertar una imagen se coloca en la imagen de al lado
const imagen = document.getElementById("imagen_saga")
const input = document.getElementById("imagen_saga_input")
input.addEventListener("change", () => {
    const foto = input.files[0]
    if (foto) {
        imagen.src = URL.createObjectURL(foto)
    }
})

const formulario = document.getElementById("info_saga")
formulario.addEventListener("submit", async (e) => {
    e.preventDefault()
    const datos = new FormData()
    const nombre = document.getElementById("saga_name").value
    const descripcion = document.getElementById("saga_descrip").value
    const imagen = document.getElementById("imagen_saga_input").files[0]
    datos.append("nombre_saga", nombre)
    datos.append("descripcion_saga", descripcion)
    datos.append("foto_saga", imagen)
    console.log(datos)
    enviarInfoServer(e, null, "/crear_saga", "json_mensaje_saga", null, null, datos)
    

})