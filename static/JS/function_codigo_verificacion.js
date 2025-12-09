import { enviarInfoServer } from "./function_generales.js"

const formularioCodigoVerifiacion = document.getElementById("formularioCodigoVerifiacion")
formularioCodigoVerifiacion.addEventListener("submit", (e)=>{

    const codigo = document.getElementById("codigo_usuario").value
    const direccion_ = `/verificar_codigo/${codigo}`
    enviarInfoServer(e, false, direccion_, "json_mensaje")
})