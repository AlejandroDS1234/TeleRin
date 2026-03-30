import { enviarInfoServer } from "./function_generales.js";


const editodiv = document.getElementById("leer")

const contenido = JSON.parse(editodiv.dataset.contenido)

const editor = new Quill('#leer', {
    theme: 'snow',
    readOnly: true,
    modules: {toolbar: false}
});

editor.setContents(contenido);


const calificacionForm = document.getElementById("calificacion_historia");
calificacionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(calificacionForm);
    const id_historia = calificacionForm.dataset.idHistoria;
    const calificacion = formData.get("calificacion");
    let datos = {
        "id_historia": id_historia,
        "calificacion": calificacion
    }
    enviarInfoServer(e, datos, "/calificar_historia", "json_mensaje");
});
