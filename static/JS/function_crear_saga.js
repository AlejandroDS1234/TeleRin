import { enviarInfoServer } from "./function_generales.js"

const botonCrearSaga = document.querySelector("#crear_saga")
const menuCrearSaga = document.querySelector("#menu_crear_saga")
const cerrarMenuCrearSaga = document.querySelector("#cerrar_ventana_menu_crear_saga")
botonCrearSaga.addEventListener("click", ()=> {
    menuCrearSaga.showModal()
})
cerrarMenuCrearSaga.addEventListener("click", ()=>{
    menuCrearSaga.close()
})

//mostrar previsualizacion foto de la saga
const fotoPrevisualizarSaga = document.querySelector("#imagen_saga")
const inputPrevizualizar = document.querySelector("#cargar_imagen_saga")
inputPrevizualizar.addEventListener('change', function() {
    const foto = this.files[0]
    if (foto) {
        fotoPrevisualizarSaga.src = URL.createObjectURL(foto)
    }
})

const formCrearSaga = document.querySelector("#form_crear_saga")
const btnCrearSaga = document.querySelector("#btn_crear_saga")
btnCrearSaga.addEventListener("click", CrearSagaFuncion)
    
async function CrearSagaFuncion(e) {
    const datosFormulario = new FormData(formCrearSaga)

    enviarInfoServer(e, null, "/crear_saga", "menaje_json", null, null, datosFormulario)
}