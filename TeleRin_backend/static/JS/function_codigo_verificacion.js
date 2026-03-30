import { enviarInfoServer } from "./function_generales.js"

const formularioCodigoVerifiacion = document.getElementById("formularioCodigoVerifiacion")
formularioCodigoVerifiacion.addEventListener("submit", (e)=>{

    const codigo = document.getElementById("codigo_usuario").value
    const direccion_ = `/validar_codigo`
    enviarInfoServer(e, {"codigo": codigo}, direccion_, "json_mensaje")
})