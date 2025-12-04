document.addEventListener("DOMContentLoaded", async function() {
    errores()
})

async function errores() {
    const conresponse = await fetch("/cantida_errores")
    const errores = await conresponse.json()
    const cantidadErrores = errores.errores;
    if (cantidadErrores >= 3) {
        const captchaContainer = document.querySelector("#olvidar_contraseña");
        captchaContainer.innerHTML = `<a href="/olvidar_contraseña">¿Olvidaste tu contraseña?</a>`;
    }
}