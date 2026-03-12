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

let descripcionHistoriahtml = document.getElementById("descripcion_historia")
let descripcionQuill = new Quill('#descripcion_historia', {
    theme: 'snow',
    modules: { toolbar: false}
})

descripcionQuill.on("text-change", function(delta, oldDelta, source) {
  if (source !== "user") return;
  const descripciontext = descripcionQuill.getText();
  const regex = /#\w+/g;
  let match;
  while ((match = regex.exec(descripciontext)) !== null) {
    descripcionQuill.formatText(
      match.index,
      match[0].length,
      { color: "var(--color_hashtag)" }
    );
    descripcionQuill.formatText(
      match.index + match[0].length, 1,
      { color: "var(--color_texto)" }
    );
  }
});


const formulario = document.querySelector("#crear_historia_form")
formulario.addEventListener("submit", async (e)=>{
    e.preventDefault()
    const nombreHistoria = document.getElementById("nombre_historia").value
    const descripcionHistoria = descripcionQuill.getText()
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