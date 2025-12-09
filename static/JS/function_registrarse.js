import { enviarInfoServer } from "./function_generales.js"

const formularioRegistrarse = document.getElementById("formularioRegistrarse")
formularioRegistrarse.addEventListener("submit", (e)=>{

    const nombreUsuario = document.querySelector("[name='nombre_usuario'] ").value
    const correoUsuario = document.querySelector("[name='correo_usuario'] ").value
    const contraseñaUsuario = document.querySelector("[name='contraseña_usuario'] ").value
    const datosRegistrarse = {"nombre_usuario": nombreUsuario, "correo_usuario": correoUsuario, "contraseña_usuario": contraseñaUsuario}
    enviarInfoServer(e, datosRegistrarse, "/registrarse", "json_mensaje")
})