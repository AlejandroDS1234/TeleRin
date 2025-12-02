document.addEventListener("DOMContentLoaded", async function() {

    // Inicializar TinyMCE cuando el DOM esté listo
    if (typeof tinymce !== "undefined") {
        tinymce.init({
            selector: '#editor',
            branding: false,
            menubar: false,
            width: '100%',
            height: '100%',
            toolbar: 'undo redo | styles forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | image',
            statusbar: false,
        });
    } else {
        console.error("❌ TinyMCE no se cargó. Revisa la ruta del script en el HTML.");
    }

    // ---- EL RESTO DE TU CÓDIGO ---- //

    paisesLlenar();
    cargarSagas()
    const MenuCfotoCerrado = sessionStorage.getItem("menuCambiarFotoCerrado")
    const MenuUcerrado = sessionStorage.getItem("menuUsuarioCerrado")

    if (MenuCfotoCerrado == "false") {
        document.querySelector("#foto_mostrar").showModal()
    } else {
        document.querySelector("#foto_mostrar").close()
    }

    if (MenuUcerrado == "false") {
        document.querySelector("#ingresar_info_usuario").classList.remove("ocultar")
    } else {
        document.querySelector("#ingresar_info_usuario").classList.add("ocultar")
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

});

// ----------------------
// FUNCIONES Y EVENTOS
// ----------------------

async function paisesLlenar() {
    const res = await fetch("/api/paises_generos");
    const Li = await res.json();

    const up = Li.pais_usuario;
    const p = Li.paises;
    const ug = Li.genero_usuario;
    const g = Li.generos;

    const listap = document.getElementById("pais");
    listap.options.length = 0;
    const listag = document.getElementById("genero");
    listag.options.length = 0;

    const miPais = document.createElement("option");
    miPais.value = String(up.id_pais);
    miPais.textContent = String(up.nombre_pais);
    miPais.selected = true;
    listap.appendChild(miPais);

    const miGenero = document.createElement("option");
    miGenero.value = String(ug.id_genero);
    miGenero.textContent = String(ug.nombre_genero);
    miGenero.selected = true;
    listag.appendChild(miGenero);
    p.forEach(pais => {
        if (pais.id_pais === up.id_pais) return;
        const opcion = document.createElement("option");
        opcion.value = String(pais.id_pais);
        opcion.textContent = String(pais.nombre_pais);
        listap.appendChild(opcion);
    });

    g.forEach(genero => {
        if (genero.id_genero === ug.id_genero) return;
        const opcion = document.createElement("option");
        opcion.value = String(genero.id_genero);
        opcion.textContent = String(genero.nombre_genero);
        listag.appendChild(opcion);
    });

    const botonFila = document.getElementById("boton1");
    const boton = document.createElement("button");
    boton.textContent = "Editar"
    boton.type = "submit"
    boton.classList.add("boton")
    boton.classList.add("editar")
    botonFila.appendChild(boton)

}

const menu_info = document.querySelector("#ingresar_info_usuario")
const boton_cerrar = document.querySelector("#cerrar_ventana")
const boton_abrir = document.querySelector("#foto_perfil_caja")

boton_cerrar.addEventListener("click", () => {
    menu_info.classList.add("ocultar")
    sessionStorage.setItem("menuUsuarioCerrado", "true")
});

boton_abrir.addEventListener("click", () => {
    menu_info.classList.remove("ocultar")
    sessionStorage.setItem("menuUsuarioCerrado", "false")
})

const boton_cambiar_foto = document.querySelector("#foto_perfil_cambiar")
const menu_cambiar_foto = document.querySelector("#foto_mostrar")
const cerrar_ventana_foto = document.querySelector("#cerrar_ventana_editar_foto")

boton_cambiar_foto.addEventListener("click", () => {
    menu_cambiar_foto.showModal()
    sessionStorage.setItem("menuCambiarFotoCerrado", "false")
})
cerrar_ventana_foto.addEventListener("click", () => {
    menu_cambiar_foto.close()
    sessionStorage.setItem("menuCambiarFotoCerrado", "true")
})



//crear sagas

//boton cerrrar
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

