from flask import Blueprint, request, jsonify
from PIL import Image

from servidor.core.db import actualizar_datos
from servidor.core.decoradores import necesita
from servidor.services.servicios_sesion import obtener_usuario, sesion_iniciada
from servidor.services.servicios_perfil import (
    verficar_nombre_usuario,
    verificar_descripcion_usuario,
    verificar_pais_usuario,
    verificar_genero_usuario,
)
from servidor.services.servicios_archivos import (
    ruta_guardado,
    validar_imagen_completa,
    generar_imagen_reducida,
)

perfil_bp = Blueprint("perfil", __name__)

@perfil_bp.route("/api/perfil", methods=["POST"])
def perfil(): 
    verificaciones = {"nombre_usuario": verficar_nombre_usuario, "descripcion_personal": verificar_descripcion_usuario, "id_pais": verificar_pais_usuario, "id_genero": verificar_genero_usuario}
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    form = request.get_json()
    print(form)
    clave, dato =  list(form.items())[0]
    dato = dato.strip()
    print(clave, dato)
    mensaje=verificaciones[clave](dato)
    print(mensaje)
    if mensaje["tipo"] == "success":
        actualizar_datos("USUARIOS", {clave: dato}, {"codigo_usuario": usuario_actual["codigo_usuario"]})
        print("actualizado")
    return jsonify({"mensaje": mensaje, "dato": {"clave": clave, "valor": dato}})
   
@perfil_bp.route("/api/guardar_foto_perfil", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def guardar_foto_perfil():
    if request.method=="POST":
        usuario_actual = obtener_usuario()
        if not usuario_actual:
            return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
        print(request.files)
        imagen=request.files['imagen']
        mensaje, resultado = validar_imagen_completa(imagen)
        if resultado:
            return jsonify({"mensaje": mensaje, "tipo": "danger"})
        nombre_archivo, ruta=ruta_guardado(usuario_actual["codigo_usuario"], "_perfil", "Fotos/perfil")
        
        # Forzar conversión a WebP al guardar la original
        img_original = Image.open(imagen)
        img_original.save(ruta, "WEBP", quality=85)
        
        # Generar y guardar versión reducida
        imagen.seek(0)  # Reset para poder leerla de nuevo
        reducida = generar_imagen_reducida(imagen, 150, 150)
        ruta_reducida = ruta.replace(".webp", "_reducida.webp")
        reducida.save(ruta_reducida, "WEBP", quality=40)  # Muy comprimida
        
        actualizar_datos("USUARIOS", {"foto_perfil_usuario": nombre_archivo}, {"correo_usuario": usuario_actual["correo_usuario"]})
        return jsonify({"mensaje": "Foto de perfil actualizada", "tipo": "success", "foto_perfil_usuario": nombre_archivo})
