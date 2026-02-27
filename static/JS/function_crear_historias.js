import { cargarSagas } from "./function_generales.js";
import { enviarInfoServer } from "./function_generales.js";


const quill = new Quill('#editor', {
    theme: 'snow'
});
const usuario = document.querySelector("#crear_historia").getAttribute("data-usuario-correo")
cargarSagas("vertical", usuario, "sagas_pertenece")


const elegirSaga = document.querySelector("#sagas_pertenece")
elegirSaga.addEventListener("click", async()=> {
    const usuario = document.querySelector("#crear_historia").getAttribute("data-usuario-correo")
    await cargarSagas("vertical", usuario, "sagas_pertenece")
    seleccionarSaga()
})

function seleccionarSaga() {
    console.log("entro")
    document.querySelectorAll('.seleccionar-saga').forEach(item => {
        item.addEventListener('click', function() {
            console.log("click")
            let nombre = this.dataset.nombre;
            let id = this.dataset.id;
            try {
                // Cambiar el texto del botón
                const elegirSaga = document.getElementById("boton_seleccionar_saga")
                elegirSaga.innerHTML = nombre;
                elegirSaga.name = nombre;
                // Guardar en un input oculto
                document.getElementById('id_saga').value = id;
            } catch (error) {
                console.log("estoy en esta pagina", error)
            }
        });
    });
}
seleccionarSaga()

const formulario = document.querySelector("#crear_historia_form")
formulario.addEventListener("submit", async (e)=>{
    e.preventDefault()
    const nombreHistoria = document.getElementById("nombre_historia").value
    const descripcionHistoria = document.getElementById("descripcion_historia").value
    const sagaHistoria = document.getElementById("id_saga").value
    const textoHistoria = quill.getText()
    const Historia = quill.getContents()

    const visibilidadHistoria = document.querySelector("input[name='visibilidad']:checked").value

    let contenido = {
            nombre_historia: nombreHistoria,
            descripcion_historia: descripcionHistoria,
            saga_historia: sagaHistoria,
            texto_historia: textoHistoria,
            historia: Historia,
            visibilidad_historia: visibilidadHistoria
        }

    enviarInfoServer(e, contenido, "/crear_historia", "json_mensaje")
})