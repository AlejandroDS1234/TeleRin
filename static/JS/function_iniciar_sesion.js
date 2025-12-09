import { enviarInfoServer } from "./function_generales.js";



// /inicio_usuario

const formularioIniciarSesion = document.getElementById("formulario_iniciar_sesion")
formularioIniciarSesion.addEventListener("submit", async (e)=>{
    const correoUsuario = document.querySelector("[name='correo_usuario']").value
    const contrasenaUsuario = document.querySelector("[name='contrasena_usuario'] ").value
    const datosIniciarSesion = {"correo_usuario": correoUsuario, "contrasena_usuario": contrasenaUsuario}

    enviarInfoServer(e, datosIniciarSesion, "/inicio_usuario", "json_mensaje", "errores", "./function_iniciar_sesion.js")

})


export async function errores() {
    const conresponse = await fetch("/cantida_errores")
    const errores = await conresponse.json()
    const cantidadErrores = errores.errores;
    if (cantidadErrores >= 2) {
        const captchaContainer = document.querySelector("#olvidar_contraseña");
        const url = captchaContainer.getAttribute("data-url");
        captchaContainer.innerHTML = `<a href="${url}">¿Olvidaste tu contraseña?</a>`;
    }
}