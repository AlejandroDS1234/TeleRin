import { enviarInfoServer } from "./function_generales.js";

document.addEventListener("DOMContentLoaded", async function() {
    paisesLlenar();
})
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
    miPais.classList.add("ingresar")
    listap.appendChild(miPais);
    const miGenero = document.createElement("option");
    miGenero.value = String(ug.id_genero);
    miGenero.textContent = String(ug.nombre_genero);
    miGenero.selected = true;
    miGenero.classList.add("ingresar")
    listag.appendChild(miGenero);
    p.forEach(pais => {
        if (pais.id_pais === up.id_pais) return;
        const opcion = document.createElement("option");
        opcion.value = String(pais.id_pais);
        opcion.textContent = String(pais.nombre_pais);
        opcion.classList.add("ingresar")
        listap.appendChild(opcion);
    });
    g.forEach(genero => {
        if (genero.id_genero === ug.id_genero) return;
        const opcion = document.createElement("option");
        opcion.value = String(genero.id_genero);
        opcion.textContent = String(genero.nombre_genero);
        opcion.classList.add("ingresar")
        listag.appendChild(opcion);
    });
    const boton = document.getElementById("boton_guardar_datos");
    boton.textContent = "Editar"
    boton.type = "submit"
    boton.name = "Editar"
    
}

const datos_usuario = document.getElementById("informacion_del_usuario")
datos_usuario.addEventListener("submit", async (e) => {
    const nombre_usuario = document.getElementById("nombre_usuario").value
    const pais = document.getElementById("pais").value
    const genero = document.getElementById("genero").value
    const descripcion = document.getElementById("Descripcion").value
    const datos = {
        "nombre_usuario": nombre_usuario,
        "pais": pais,
        "genero": genero,
        "descripcion": descripcion}
    enviarInfoServer(e, datos, "/perfil", "json_mensaje_datos")
})

const editarFotoPerfilBoton = document.getElementById("editar_foto_perfil_boton")
const cuadroEditarFotoPerfil = document.getElementById("cambiar_foto_perfil_container")
const cerrarcuadroEditarFotoPerfil = document.getElementById("cerrar")
const fondoOscuro = document.querySelector(".fondo_oscuro")
editarFotoPerfilBoton.addEventListener("click", () => {
    cuadroEditarFotoPerfil.classList.remove("oculto")
    fondoOscuro.classList.remove("oculto")
})
cerrarcuadroEditarFotoPerfil.addEventListener("click", () => {
    cuadroEditarFotoPerfil.classList.add("oculto")
    fondoOscuro.classList.add("oculto")
})

const foto_perfil_cambiar_previsualizar = document.getElementById("cambiar_foto_perfil_img")
const foto_perfil_cambiar_input = document.getElementById("foto_perfil_input")
foto_perfil_cambiar_input.addEventListener('change', function() {
    const foto = this.files[0]
    if (foto) {
        foto_perfil_cambiar_previsualizar.src = URL.createObjectURL(foto)
    }
})

const foto_perfil_cambiar_form = document.getElementById("formulario_cambiar_foto_perfil")
foto_perfil_cambiar_form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const foto = foto_perfil_cambiar_input.files[0]
    const datos = new FormData()
    datos.append("imagen", foto)

    enviarInfoServer(e, null, "/guardar_foto_perfil" ,"json_mensaje_cambiar_foto_perfil",null,null ,datos)
})


const historias_historial = document.querySelectorAll(".historia_historial")
historias_historial.forEach(historia => {
    historia.addEventListener("click", () => {
        const id_historia = historia.dataset.id
        window.location.href = `/historia/${id_historia}`
    })
})



