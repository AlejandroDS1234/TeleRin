import { enviarInfoServer } from "./function_generales.js";
import { mostrarContraseña } from "./function_generales.js";

// /inicio_usuario
const formularioIniciarSesion = document.getElementById("formulario_iniciar_sesion")
formularioIniciarSesion.addEventListener("submit", async(e) => {
    const correoUsuario = document.querySelector("[name='correo_usuario']").value
    const contrasenaUsuario = document.querySelector("[name='contrasena_usuario'] ").value
    const datosIniciarSesion = { "correo_usuario": correoUsuario, "contraseña_usuario": contrasenaUsuario }

    enviarInfoServer(e, datosIniciarSesion, "/iniciar_sesion", "json_mensaje")
 
})

const mostrarContraseñaBoton = document.getElementById("mostrar_contraseña")
const contraseñaInput = document.querySelector("[name='contrasena_usuario'] ")
mostrarContraseñaBoton.addEventListener("click", () => {
    mostrarContraseña(mostrarContraseñaBoton, contraseñaInput)
})