import { cargarSagas } from "./function_sagas_creadas.js";
import { mensaje } from "./function_generales.js";

document.addEventListener("DOMContentLoaded", async function() {
    if (typeof tinymce !== "undefined") {
        tinymce.init({
            selector: '#editor',
            branding: false,
            menubar: false,
            width: '100%',
            height: '100%',
            toolbar: 'undo redo | styles forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | image',
            statusbar: false,
            content_css: "static/CSS/style_tinyMCE.css",
            content_style: `
                body {
                    color: var(--texto);
                    background-color: var(--menusLaterales);
                }
                `,
            setup: (editor)=> {
                editor.on("init", ()=>{
                    const container = editor.editorContainer
                    
                    container.style.borderRadius = "0px"
                    container.style.border = "2px solid var(--bordes)";
                })
            }
        });
    } else {
        console.error("❌ TinyMCE no se cargó. Revisa la ruta del script en el HTML.");
    }
    const usuario = document.querySelector(".header").getAttribute("data-usuario-correo")
    cargarSagas(1, usuario)
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            setTimeout(() => {
                form.submit();
            }, 50);
        });
    });
})
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


const elegirSaga = document.querySelector("#elegir_saga")
elegirSaga.addEventListener("click", ()=> {
    const usuario = document.querySelector(".header").getAttribute("data-usuario-correo")
    cargarSagas(1, usuario, "listaSagas")

})




const formCrearSaga = document.querySelector("#form_crear_saga")
const btnCrearSaga = document.querySelector("#btn_crear_saga")
btnCrearSaga.addEventListener("click", CrearSagaFuncion)
    
async function CrearSagaFuncion(e) {
    e.preventDefault()
    e.stopPropagation()

    const datosFormulario = new FormData(formCrearSaga)

    const crearSaga = await fetch("/crear_saga", {method:"POST", body: datosFormulario})
    const crearSagaDatos = await crearSaga.json()

    mensaje("menaje_json", crearSagaDatos.tipo, crearSagaDatos.mensaje)
    }




const formulario = document.querySelector("#boton_nueva_historia")
formulario.addEventListener("click", async (e)=>{


    

    const nombreHistoria = document.getElementById("nombre_historia").value
    const descripcionHistoria = document.getElementById("descripcion_saga").value
    const sagaHistoria = document.getElementById("id_saga").value
    if (nombreHistoria.trim() == "" || descripcionHistoria.trim() == "" || sagaHistoria == "") {
        mensaje("menaje_json_historia", "danger", "Tienes que llenar todos los campos")
        return
    }
    const resp = await fetch("/historias_creadas_bd", {method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            nombre_historia: nombreHistoria,
            saga_historia: sagaHistoria,
        })
    })
    const data = await resp.json()
    if (data["historia_repetida"]) {
        mensaje("menaje_json_historia", "danger", "Ya hay una historia con ese nombre en la saga");
        return
    } 

    const textoHistoria = tinymce.activeEditor.getContent({format: 'text'})
    if (textoHistoria.replaceAll(' ','').length <200) {
        mensaje("menaje_json_historia", "danger", "Tu historia es muy corta")
        return
    }
    const htmlHistoria = tinymce.activeEditor.getContent()

    const visibilidadHistoria = document.querySelector("input[name='visibilidad']:checked").value
    fetch("/crear_historias", {method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            nombre_historia: nombreHistoria,
            descripcion_historia: descripcionHistoria,
            saga_historia: sagaHistoria,
            html_historia: htmlHistoria,
            visibilidad_historia: visibilidadHistoria
        })
    })
    mensaje("menaje_json_historia", "success", "Historia Creada")

})