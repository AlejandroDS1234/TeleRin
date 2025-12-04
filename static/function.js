document.addEventListener("DOMContentLoaded", async function() {
    paisesLlenar();
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
