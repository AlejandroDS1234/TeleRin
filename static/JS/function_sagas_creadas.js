document.addEventListener("DOMContentLoaded", async function() {
    try {
        const usuario = document.querySelector(".header").getAttribute("data-usuario-correo")
        cargarSagas(1, usuario, "listaSagas")
    } catch {
        null
    }
    
})

