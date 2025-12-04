document.addEventListener("DOMContentLoaded", async function() {
    errores()
})

async function errores() {
    const conresponse = await fetch("/cantida_errores")
    const errores = await conresponse.json()
    const cantidadErrores = errores.errores;
    if (cantidadErrores >= 3) {
        const captchaContainer = document.querySelector("#olvidar_contraseña");
        const url = captchaContainer.getAttribute("data-url");
        captchaContainer.innerHTML = `<a href="${url}">¿Olvidaste tu contraseña?</a>`;
    }
}