import { enviarInfoServer } from "./function_generales.js";
import { cambiarTamañoBarraContraseña } from "./function_generales.js";


const formulario = document.getElementById("formulario_cambiar_contraseña");
formulario.addEventListener("submit", async(e) => {
    let contraseña_usuario_nueva = formulario.elements["contraseña_usuario_nueva"].value;
    let contraseña_usuario_nueva_confirmacion = formulario.elements["contraseña_usuario_nueva_confirmacion"].value;
    let datos= {"contraseña_usuario_nueva": contraseña_usuario_nueva, "contraseña_usuario_nueva_confirmacion": contraseña_usuario_nueva_confirmacion}
    enviarInfoServer(e, datos, "/cambiar_contraseña", "json_mensaje")
    console.log(datos)
})

const contraseñaUsuario = document.querySelector("[name='contraseña_usuario_nueva'] ")
contraseñaUsuario.addEventListener("input", (e)=>{
    const barra = document.querySelector(".barra")
    cambiarTamañoBarraContraseña(e.target, barra)
})