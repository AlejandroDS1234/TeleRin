import { enviarInfoServer } from "./function_generales.js";

console.log("entro al js de correo para codigo")

const formularioCodigoVerifiacion = document.getElementById("formularioCorreoCodigoVerifiacion")
formularioCodigoVerifiacion.addEventListener("submit", async(e)=>{
    const correoParaCodigoUsuario = document.querySelector("[name='correo_para_codigo_usuario'] ").value
    const datosCorreoParaCodigo = {"correo_para_codigo_usuario": correoParaCodigoUsuario}
    enviarInfoServer(e, datosCorreoParaCodigo, "/codigo_verificacion_cambiar_contrasena", "json_mensaje")
})