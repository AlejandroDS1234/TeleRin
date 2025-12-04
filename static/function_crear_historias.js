document.addEventListener("DOMContentLoaded", async function() {
    cargarSagas()
    if (typeof tinymce !== "undefined") {
        tinymce.init({
            selector: '#editor',
            branding: false,
            menubar: false,
            width: '100%',
            height: '100%',
            toolbar: 'undo redo | styles forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | image',
            statusbar: false,
            content_css: "static/style.css",
            content_style: `
                body {
                    color: var(--texto);
                    
                }`,
            setup: (editor)=> {
                editor.on("init", ()=>{
                    const container = editor.editorContainer
                    
                    container.style.borderRadius = "0px"
                    container.style.border = "2px solid var(--bordes)";

                    const toolbar = editor.editorContainer.querySelector(".tox-editor-header");
                    toolbar.style.backgroundColor = "var(--parteMenuLateral)";

                    const editArea = container.querySelector(".tox-edit-area");
                    editArea.style.backgroundColor = "var(--colorBotones)";
                })
            }
        });
    } else {
        console.error("❌ TinyMCE no se cargó. Revisa la ruta del script en el HTML.");
    }
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
    cargarSagas()

})

async function cargarSagas() {
    const respuesta = await fetch("/sagas_creadas", {method:"POST"});
    const sagas = await respuesta.json();
    const contenedor = document.getElementById("listaSagas");
    contenedor.innerHTML = ""; // limpiar
    sagas.forEach(saga => {
        const html = `
            <div class="dropdown-item p-0 seleccionar-saga"
                data-id="${saga.id_saga}"
                data-nombre="${saga.nombre_saga}">
                
                <div class="card mb-2" style="max-width: 100%;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="/fotos_sagas/${saga.imagen_saga}" class="img-fluid rounded-start">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h6 class="card-title m-0">${saga.nombre_saga}</h6>
                                <p class="card-text"><small>${saga.descripcion_saga}</small></p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;

        contenedor.insertAdjacentHTML("beforeend", html);
    });
    document.querySelectorAll('.seleccionar-saga').forEach(item => {
    item.addEventListener('click', function() {
        let nombre = this.dataset.nombre;
        let id = this.dataset.id;
        // Cambiar el texto del botón
        elegirSaga.innerHTML = nombre;

        // Guardar en un input oculto
        document.getElementById('id_saga').value = id;
    });
});

}





const formCrearSaga = document.querySelector("#form_crear_saga")
const btnCrearSaga = document.querySelector("#btn_crear_saga")


btnCrearSaga.addEventListener("click", CrearSagaFuncion)
    
async function CrearSagaFuncion(e) {
    e.preventDefault()
    e.stopPropagation()

    const datosFormulario = new FormData(formCrearSaga)

    const crearSaga = await fetch("/crear_saga", {method:"POST", body: datosFormulario})
    const crearSagaDatos = await crearSaga.json()

    const mensajeArea = document.querySelector("#menaje_json")
    mensajeArea.innerHTML = crearSagaDatos.mensaje
    mensajeArea.classList.add("mensaje")
    mensajeArea.classList.add(`mensaje-${crearSagaDatos.tipo}`)
    }
